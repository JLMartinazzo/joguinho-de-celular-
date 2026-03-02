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

// Controle por toque
canvas.addEventListener("touchmove", (e) => {
    let touch = e.touches[0];
    player.x = touch.clientX - player.width / 2;
});

// Controle para desktop também
canvas.addEventListener("mousemove", (e) => {
    player.x = e.clientX - player.width / 2;
});

function createObstacle() {
    let size = 40;
    obstacles.push({
        x: Math.random() * (canvas.width - size),
        y: -size,
        width: size,
        height: size,
        speed: 4
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

        // Colisão
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

function endGame() {
    gameOver = true;
    document.getElementById("gameOverScreen").classList.remove("hidden");
}

function restartGame() {
    obstacles = [];
    score = 0;
    gameOver = false;
    document.getElementById("gameOverScreen").classList.add("hidden");
    loop();
}

function updateScore() {
    score++;
    document.getElementById("score").innerText = score;
}

function loop() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    drawObstacles();
    updateObstacles();
    updateScore();

    if (Math.random() < 0.03) {
        createObstacle();
    }

    requestAnimationFrame(loop);
}

loop();