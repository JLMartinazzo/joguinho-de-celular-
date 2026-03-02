const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 120,
    width: 50,
    height: 50,
    color: "yellow"
};

let obstacles = [];
let score = 0;
let gameOver = false;
let frameCount = 0;

// Sistema de dificuldade
let difficulty = {
    level: 1,
    obstacleSpeed: 3,
    spawnRate: 0.02,
    maxObstacleSize: 40
};

// Controle touch
canvas.addEventListener("touchmove", (e) => {
    let touch = e.touches[0];
    player.x = touch.clientX - player.width / 2;
});

// Controle mouse (desktop)
canvas.addEventListener("mousemove", (e) => {
    player.x = e.clientX - player.width / 2;
});

function createObstacle() {
    let size = Math.random() * difficulty.maxObstacleSize + 20;

    obstacles.push({
        x: Math.random() * (canvas.width - size),
        y: -size,
        width: size,
        height: size,
        speed: difficulty.obstacleSpeed + Math.random() * 1.5
    });
}

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawObstacles() {
    ctx.fillStyle = "red";
    obstacles.forEach(obs => {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
    });
}

function updateObstacles() {
    obstacles.forEach(obs => {
        obs.y += obs.speed;

        // Detecção de colisão (AABB)
        if (
            player.x < obs.x + obs.width &&
            player.x + player.width > obs.x &&
            player.y < obs.y + obs.height &&
            player.y + player.height > obs.y
        ) {
            endGame();
        }
    });

    obstacles = obstacles.filter(obs => obs.y < canvas.height);
}

function updateDifficulty() {
    // A cada 600 frames (~10 segundos)
    if (frameCount % 600 === 0) {
        difficulty.level++;
        difficulty.obstacleSpeed += 0.5;
        difficulty.spawnRate += 0.005;
        difficulty.maxObstacleSize += 5;

        console.log("Level:", difficulty.level);
    }
}

function updateScore() {
    score++;
    document.getElementById("score").innerText = score;
}

function endGame() {
    gameOver = true;
    document.getElementById("gameOverScreen").classList.remove("hidden");
}

function restartGame() {
    obstacles = [];
    score = 0;
    frameCount = 0;
    gameOver = false;

    difficulty = {
        level: 1,
        obstacleSpeed: 3,
        spawnRate: 0.02,
        maxObstacleSize: 40
    };

    document.getElementById("score").innerText = "0";
    document.getElementById("gameOverScreen").classList.add("hidden");
    loop();
}

function loop() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    frameCount++;

    updateDifficulty();

    drawPlayer();
    drawObstacles();
    updateObstacles();
    updateScore();

    if (Math.random() < difficulty.spawnRate) {
        createObstacle();
    }

    requestAnimationFrame(loop);
}

loop();