const savedMode = localStorage.getItem("gameMode");

if (savedMode === "upload") {
    setTimeout(() => {
        document.getElementById("uploadImage").click();
    }, 500);
}
let imageSrc = "images/f1.jpg";
let mode = "default"; // default | upload
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

    const boardSize = 320;
    const tileSize = boardSize / size;

    for (let i = 0; i < size * size; i++) {
        const tile = document.createElement("div"); // ✅ ต้องมาก่อน
        tile.classList.add("tile");

        const x = i % size;
        const y = Math.floor(i / size);

        tile.style.backgroundImage = `url(${imageSrc})`;
        tile.style.backgroundSize = `${boardSize}px ${boardSize}px`; // ✅ ย้ายมานี่
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
        tile.style.outline = "3px solid #10b981";
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
    checkCorrectTiles();
}
function checkCorrectTiles() {
    const boardSize = 320;
    const tileSize = boardSize / size;

    tiles.forEach((tile, i) => {
        const x = i % size;
        const y = Math.floor(i / size);
        const correctPos = `${-x * tileSize}px ${-y * tileSize}px`;

        if (tile.style.backgroundPosition === correctPos) {
            tile.style.boxShadow = "0 0 10px #10b981";
        } else {
            tile.style.boxShadow = "none";
        }
    });
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
    const boardSize = 320;
    const tileSize = boardSize / size;
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
    document.body.style.background = "#d1fae5";

    alert(`🎉 You Win!\n⏱ Time: ${timer}s\n🔢 Moves: ${moves}`);

    document.body.style.background = "";
}, 300);
    }
}

// init
startGame();

// ===== Preview Hold Button =====
const previewBtn = document.getElementById("previewBtn");
const previewImage = document.getElementById("previewImage");

if(previewBtn && previewImage){

    previewBtn.addEventListener("mousedown", () => {
        previewImage.style.opacity = "1";
        previewImage.style.transform = "scale(1.2)";
    });

    previewBtn.addEventListener("mouseup", () => {
        previewImage.style.opacity = "0.6";
        previewImage.style.transform = "scale(1)";
    });

    previewBtn.addEventListener("mouseleave", () => {
        previewImage.style.opacity = "0.6";
        previewImage.style.transform = "scale(1)";
    });

}
const defaultBtn = document.getElementById("defaultMode");
const uploadBtn = document.getElementById("uploadMode");
const uploadInput = document.getElementById("uploadImage");

defaultBtn.addEventListener("click", () => {
    mode = "default";
    imageSrc = "images/f1.jpg";

    createPuzzle();
    shuffle();
});

uploadBtn.addEventListener("click", () => {
    mode = "upload";
    uploadInput.click(); // เปิด file picker
});
uploadInput.addEventListener("change", function(e) {
    const file = e.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function(event) {
            imageSrc = event.target.result;

            createPuzzle();
            shuffle();
        };

        reader.readAsDataURL(file);
    }
});

defaultBtn.addEventListener("click", () => {
    defaultBtn.classList.add("active");
    uploadBtn.classList.remove("active");
});

uploadBtn.addEventListener("click", () => {
    uploadBtn.classList.add("active");
    defaultBtn.classList.remove("active");
});
