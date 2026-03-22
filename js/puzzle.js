const board = document.getElementById("puzzleBoard");
const sizeSelect = document.getElementById("difficulty");

let size = 3;
let tiles = [];
let selected = null;

let moves = 0;
let timer = 0;
let interval;

// ===== START GAME =====
function startGame() {
    size = parseInt(sizeSelect.value);
    moves = 0;
    timer = 0;

    document.getElementById("moves").innerText = moves;
    document.getElementById("timer").innerText = timer;

    clearInterval(interval);
    interval = setInterval(() => {
        timer++;
        document.getElementById("timer").innerText = timer;
    }, 1000);

    createPuzzle();
    shuffle();
}

// ===== CREATE =====
function createPuzzle() {
    board.innerHTML = "";
    tiles = [];

    board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

    const tileSize = 300 / size;

    for (let i = 0; i < size * size; i++) {
        const tile = document.createElement("div");
        tile.classList.add("tile");

        const x = i % size;
        const y = Math.floor(i / size);

        tile.style.backgroundImage = "url('images/f1.jpg')";
        tile.style.backgroundSize = "300px 300px";
        tile.style.backgroundPosition = `${-x * tileSize}px ${-y * tileSize}px`;

        tile.addEventListener("click", () => swap(tile));

        tiles.push(tile);
        board.appendChild(tile);
    }
}

// ===== SWAP =====
function swap(tile) {
    if (!selected) {
        selected = tile;
        tile.style.outline = "3px solid red";
    } else {
        let temp = selected.style.backgroundPosition;
        selected.style.backgroundPosition = tile.style.backgroundPosition;
        tile.style.backgroundPosition = temp;

        selected.style.outline = "none";
        selected = null;

        moves++;
        document.getElementById("moves").innerText = moves;

        checkWin();
    }
}

// ===== SHUFFLE =====
function shuffle() {
    let positions = tiles.map(t => t.style.backgroundPosition);

    for (let i = positions.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    tiles.forEach((tile, i) => {
        tile.style.backgroundPosition = positions[i];
    });
}

// ===== CHECK WIN =====
function checkWin() {
    const tileSize = 300 / size;
    let correct = true;

    tiles.forEach((tile, i) => {
        const x = i % size;
        const y = Math.floor(i / size);
        const correctPos = `${-x * tileSize}px ${-y * tileSize}px`;

        if (tile.style.backgroundPosition !== correctPos) {
            correct = false;
        }
    });

    if (correct) {
        clearInterval(interval);

        setTimeout(() => {
            alert(`🎉 You Win!\n⏱ Time: ${timer}s\n🔢 Moves: ${moves}`);
        }, 300);
    }
}

// init
startGame();