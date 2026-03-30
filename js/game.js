
(function() {
  'use strict';

  // ── Feature detection ──────────────────────────────────────
  const supportsGrid   = CSS.supports('display', 'grid');
  const supportsFlip   = CSS.supports('transform-style', 'preserve-3d');
  const supportsLS     = (() => { try { localStorage.setItem('_t','1'); localStorage.removeItem('_t'); return true; } catch(e){ return false; } })();

  // ── Emoji pool ────────────────────────────────────────────
  const EMOJIS = [
    ['🐱','Cat'],['🐶','Dog'],['🦊','Fox'],['🐸','Frog'],
    ['🐧','Penguin'],['🦁','Lion'],['🐻','Bear'],['🦋','Butterfly'],
    ['🌸','Blossom'],['🍕','Pizza'],['🎸','Guitar'],['🚀','Rocket'],
    ['🎯','Target'],['🌈','Rainbow'],['⚡','Lightning'],['🍩','Donut'],
    ['🎪','Circus'],['🦄','Unicorn'],['🌵','Cactus'],['🎭','Theater'],
    ['🧩','Puzzle'],['🎲','Dice'],['🔮','Crystal ball'],['🎈','Balloon'],
  ];

  // ── State ─────────────────────────────────────────────────
  let cards        = [];
  let flipped      = [];
  let matched      = 0;
  let moves        = 0;
  let lockBoard    = false;
  let timer        = 0;
  let timerID      = null;
  let gameStarted  = false;
  let gridCols     = 4;   // columns
  let gridPairs    = 8;   // pairs (8 = 4×4)

  // ── DOM refs ──────────────────────────────────────────────
  const board       = document.getElementById('board');
  const winMsg      = document.getElementById('win-msg');
  const winDetail   = document.getElementById('win-detail');
  const statMoves   = document.getElementById('stat-moves');
  const statPairs   = document.getElementById('stat-pairs');
  const statTime    = document.getElementById('stat-time');
  const statBest    = document.getElementById('stat-best');
  const timerBar    = document.getElementById('timer-bar');
  const fallbackDiv = document.getElementById('fallback-list');

  // ── Hide fallback when JS is running ─────────────────────
  if (fallbackDiv) fallbackDiv.style.display = 'none';

  // ── Utilities ─────────────────────────────────────────────
  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function bestKey() { return 'memory_best_' + gridPairs; }

  function loadBest() {
    if (!supportsLS) return null;
    const v = localStorage.getItem(bestKey());
    return v ? parseInt(v) : null;
  }

  function saveBest(m) {
    if (!supportsLS) return;
    const prev = loadBest();
    if (prev === null || m < prev) localStorage.setItem(bestKey(), m);
  }

  function updateBestDisplay() {
    const b = loadBest();
    statBest.textContent = b !== null ? b : '—';
  }

  // ── Timer ─────────────────────────────────────────────────
  function startTimer() {
    timerID = setInterval(() => {
      timer++;
      statTime.textContent = timer;
      // Timer bar — max 120s visual
      const pct = Math.max(0, 100 - (timer / 120) * 100);
      timerBar.style.width = pct + '%';
      if (pct < 30) timerBar.style.background = 'var(--accent2)';
    }, 1000);
  }

  function stopTimer() { clearInterval(timerID); timerID = null; }

  // ── Build board ───────────────────────────────────────────
  function initGame() {
    stopTimer();
    timer = 0; moves = 0; matched = 0;
    lockBoard = false; flipped = []; gameStarted = false;
    cards = [];

    statMoves.textContent = '0';
    statPairs.textContent = '0';
    statTime.textContent  = '0';
    timerBar.style.width  = '100%';
    timerBar.style.background = '';
    winMsg.classList.remove('show');

    updateBestDisplay();

    // pick pairs
    const pool    = shuffle(EMOJIS).slice(0, gridPairs);
    const doubled = shuffle([...pool, ...pool]);

    board.innerHTML = '';
    // set grid class
    board.className = 'grid-' + gridCols;

    doubled.forEach(([emoji, label], idx) => {
      const card = createCard(emoji, label, idx);
      board.appendChild(card);
      cards.push(card);
    });
  }

  // ── Create card element ───────────────────────────────────
  function createCard(emoji, label, idx) {
    const card = document.createElement('div');
    card.className = 'card';
    card.setAttribute('role', 'gridcell');
    card.setAttribute('aria-label', 'Card ' + (idx + 1) + ' — hidden');
    card.setAttribute('tabindex', '0');
    card.dataset.emoji = emoji;
    card.dataset.label = label;

    // LAYER 1: falls back gracefully if CSS 3D not supported
    if (supportsFlip) {
      card.innerHTML = `
        <div class="card-inner">
          <div class="card-back" aria-hidden="true">✦</div>
          <div class="card-front" aria-hidden="true">
            <span>${emoji}</span>
            <span class="card-label">${label}</span>
          </div>
        </div>`;
    } else {
      // No 3D support: simple show/hide instead of flip
      card.innerHTML = `<div class="card-back" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;border-radius:var(--radius);background:var(--card-back);">✦</div>
                        <div class="card-front" style="display:none;width:100%;height:100%;align-items:center;justify-content:center;border-radius:var(--radius);background:var(--surface);">${emoji}</div>`;
    }

    // LAYER 3: Click handler
    card.addEventListener('click', () => flipCard(card));

    // LAYER 3: Keyboard support (Space / Enter)
    card.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        flipCard(card);
      }
    });

    // LAYER 3: Touch support
    card.addEventListener('touchend', (e) => {
      e.preventDefault();
      flipCard(card);
    }, { passive: false });

    return card;
  }

  // ── Flip logic ────────────────────────────────────────────
  function flipCard(card) {
    if (lockBoard) return;
    if (card.classList.contains('flipped')) return;
    if (card.classList.contains('matched')) return;

    // Start timer on first flip
    if (!gameStarted) { gameStarted = true; startTimer(); }

    // No-3D fallback flip
    if (!supportsFlip) {
      card.querySelector('.card-back').style.display = 'none';
      card.querySelector('.card-front').style.display = 'flex';
    }

    card.classList.add('flipped');
    card.setAttribute('aria-label', 'Card — ' + card.dataset.label);
    flipped.push(card);

    if (flipped.length === 2) checkMatch();
  }

  // ── Match check ───────────────────────────────────────────
  function checkMatch() {
    lockBoard = true;
    moves++;
    statMoves.textContent = moves;

    const [a, b] = flipped;

    if (a.dataset.emoji === b.dataset.emoji) {
      // Match!
      a.classList.add('matched'); a.classList.remove('flipped');
      b.classList.add('matched'); b.classList.remove('flipped');
      a.setAttribute('aria-label', 'Matched — ' + a.dataset.label);
      b.setAttribute('aria-label', 'Matched — ' + b.dataset.label);
      a.removeAttribute('tabindex'); b.removeAttribute('tabindex');
      matched++;
      statPairs.textContent = matched;
      flipped = [];
      lockBoard = false;
      if (matched === gridPairs) endGame();
    } else {
      // No match — shake and flip back
      a.classList.add('wrong'); b.classList.add('wrong');
      setTimeout(() => {
        a.classList.remove('flipped', 'wrong');
        b.classList.remove('flipped', 'wrong');
        a.setAttribute('aria-label', 'Card — hidden');
        b.setAttribute('aria-label', 'Card — hidden');
        if (!supportsFlip) {
          [a, b].forEach(c => {
            c.querySelector('.card-back').style.display = 'flex';
            c.querySelector('.card-front').style.display = 'none';
          });
        }
        flipped = [];
        lockBoard = false;
      }, 900);
    }
  }

  // ── End game ──────────────────────────────────────────────
  function endGame() {
    stopTimer();
    saveBest(moves);
    updateBestDisplay();
    winDetail.textContent = `เวลา ${timer} วินาที · ${moves} ครั้ง · ${gridPairs} คู่`;
    winMsg.classList.add('show');
    winMsg.focus();
  }

  // ── Difficulty buttons ────────────────────────────────────
  document.querySelectorAll('[data-size]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-size]').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      const s = parseInt(btn.dataset.size);
      if (s === 4) { gridCols = 4; gridPairs = 8; }
      if (s === 3) { gridCols = 4; gridPairs = 6; }
      if (s === 2) { gridCols = 4; gridPairs = 4; }
      initGame();
    });
  });

  // ── Restart button ────────────────────────────────────────
  document.getElementById('restartBtn').addEventListener('click', initGame);
  const winRestartBtn = document.getElementById('winRestartBtn');
  if (winRestartBtn) {
    winRestartBtn.addEventListener('click', initGame);
  }

  // ── Dark/light theme toggle ───────────────────────────────
  const themeBtn = document.getElementById('themeBtn');
  const root = document.documentElement;

  // Respect saved preference
  if (supportsLS) {
    const saved = localStorage.getItem('theme');
    if (saved) root.setAttribute('data-theme', saved);
  }

  themeBtn.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') !== 'light';
    root.setAttribute('data-theme', isDark ? 'light' : 'dark');
    if (supportsLS) localStorage.setItem('theme', isDark ? 'light' : 'dark');
  });

  // ── Page visibility — pause timer when tab hidden ─────────
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && gameStarted && timerID) stopTimer();
    else if (!document.hidden && gameStarted && !timerID && matched < gridPairs) startTimer();
  });

  // ── Cleanup on unload — prevent memory leak ───────────────
  window.addEventListener('beforeunload', stopTimer);

  // ── Start! ────────────────────────────────────────────────
  initGame();

})();