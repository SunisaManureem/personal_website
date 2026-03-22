// ===== CANVAS =====
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

// ===== GAME STATE =====
let carX = 160;
let speed = 3;
let roadCurve = 0;
let score = 0;
let gameRunning = true;
let lives = 3;

let left = false;
let right = false;

let obstacles = [];

// ===== SIZE =====
const carWidth = 30;
const carHeight = 40;
const obsSize = 25;

// ===== CONTROL =====
document.addEventListener("keydown", e => {
    if(e.key === "ArrowLeft") left = true;
    if(e.key === "ArrowRight") right = true;
});

document.addEventListener("keyup", e => {
    if(e.key === "ArrowLeft") left = false;
    if(e.key === "ArrowRight") right = false;
});

document.getElementById("leftBtn").onmousedown = () => left = true;
document.getElementById("leftBtn").onmouseup = () => left = false;

document.getElementById("rightBtn").onmousedown = () => right = true;
document.getElementById("rightBtn").onmouseup = () => right = false;

// ===== CREATE OBSTACLE =====
function createObstacle(){
    let roadCenter = 160 + roadCurve;
    let x = roadCenter + (Math.random() - 0.5) * 100;

    let type = Math.random() < 0.5 ? "cone" : "tire";

    obstacles.push({x: x, y: 0, type: type});
}

// ===== GAME OVER =====
function endGame(){
    gameRunning = false;
    document.getElementById("gameOver").classList.remove("hidden");
    document.getElementById("finalScore").innerText = "Score: " + score;
}

// ===== RESTART =====
function restartGame(){
    location.reload();
}

// ===== GAME LOOP =====
function gameLoop(){

    if(!gameRunning) return;

    ctx.clearRect(0,0,320,500);

    // ===== ROAD =====
    roadCurve += (Math.random() - 0.5) * 2;
    let roadCenter = 160 + roadCurve;

    ctx.fillStyle = "#2c2c2c";
    ctx.fillRect(roadCenter - 80, 0, 160, 500);

    // ===== LANE =====
    ctx.strokeStyle = "white";
    ctx.setLineDash([10,10]);
    ctx.beginPath();
    ctx.moveTo(roadCenter, 0);
    ctx.lineTo(roadCenter, 500);
    ctx.stroke();

    // ===== CONTROL =====
    if(left) carX -= 5;
    if(right) carX += 5;

    // กันรถออกนอกจอ
    if(carX < 20) carX = 20;
    if(carX > 300) carX = 300;

    // ===== DRAW CAR (emoji) =====
    ctx.font = "40px Arial";
    ctx.fillText("🏎️", carX - 20, 460);

    // ===== OBSTACLES =====
    ctx.font = "25px Arial";

    obstacles.forEach((obs, i) => {

        obs.y += speed;

        // ให้เลี้ยวตามถนน
        obs.x += roadCurve * 0.02;

        // วาด obstacle
        if(obs.type === "cone"){
            ctx.fillText("🚧", obs.x - 10, obs.y);
        }else{
            ctx.fillText("🛞", obs.x - 10, obs.y);
        }

        // ===== COLLISION (แก้แล้ว) =====
        if(
            carX - carWidth/2 < obs.x + obsSize &&
            carX + carWidth/2 > obs.x &&
            420 < obs.y + obsSize &&
            420 + carHeight > obs.y
        ){
            lives--;

            // อัปเดตชีวิต
            document.getElementById("lives").innerText =
                "Lives: " + "❤️".repeat(lives);

            obstacles.splice(i,1);

            if(lives <= 0){
                endGame();
            }
        }

        // remove obstacle
        if(obs.y > 500){
            obstacles.splice(i,1);
        }

    });

    // spawn obstacle
    if(Math.random() < 0.02){
        createObstacle();
    }

    // ===== OUT OF ROAD =====
    if(carX < roadCenter - 80 || carX > roadCenter + 80){
        endGame();
    }

    // ===== SCORE =====
    score++;
    document.getElementById("score").innerText = "Score: " + score;

    // ===== SPEED =====
    if(score % 200 === 0){
        speed += 0.5;
    }

    requestAnimationFrame(gameLoop);
}

// เริ่มเกม
gameLoop();