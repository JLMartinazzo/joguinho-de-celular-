const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


// cria o boneco do jogardor
let player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 120,
    width: 40,
    height: 40
};

// variaveis de dados do jogo
let obstacles = [];
let particles = [];
let stars = [];
let score = 0;
let gameOver = false;
let frameCount = 0;

// balanço de dificulade
let difficulty = {
    level: 1,
    obstacleSpeed: 3,
    spawnRate: 0.02
};

// Criar estrelas de fundo
for (let i = 0; i < 80; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        speed: Math.random() * 1 + 0.5
    });
}

// controlar com o toque
canvas.addEventListener("touchmove", (e) => {
    let touch = e.touches[0];
    player.x = touch.clientX - player.width / 2;
});

//controlar com o mouse
canvas.addEventListener("mousemove", (e) => {
    player.x = e.clientX - player.width / 2;
});

//desenha as estrelas no fundo do mapa
function drawStars() {
    ctx.fillStyle = "white";
    stars.forEach(star => {
        ctx.globalAlpha = Math.random();
        ctx.fillRect(star.x, star.y, star.size, star.size);
        star.y += star.speed;
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
    });
    ctx.globalAlpha = 1;
}

//cria os obstaculos para serem colocados
function createObstacle() {
    let size = Math.random() * 40 + 20;

    obstacles.push({
        x: Math.random() * (canvas.width - size),
        y: -size,
        width: size,
        height: size,
        speed: difficulty.obstacleSpeed + Math.random()
    });
}

function drawRoundedRect(x, y, width, height, radius, color) {
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;

    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();

    ctx.shadowBlur = 0;
}

function drawPlayer() {
    drawRoundedRect(player.x, player.y, player.width, player.height, 12, "#ffd600");
}

function drawObstacles() {
    obstacles.forEach(obs => {
        drawRoundedRect(obs.x, obs.y, obs.width, obs.height, 8, "#ff1744");
    });
}

function createParticles(x, y) {
    for (let i = 0; i < 20; i++) {
        particles.push({
            x,
            y,
            dx: (Math.random() - 0.5) * 6,
            dy: (Math.random() - 0.5) * 6,
            life: 30
        });
    }
}

function drawParticles() {
    ctx.fillStyle = "orange";
    particles.forEach(p => {
        ctx.globalAlpha = p.life / 30;
        ctx.fillRect(p.x, p.y, 4, 4);
        p.x += p.dx;
        p.y += p.dy;
        p.life--;
    });
    ctx.globalAlpha = 1;
    particles = particles.filter(p => p.life > 0);
}

function updateObstacles() {
    obstacles.forEach(obs => {
        obs.y += obs.speed;

        if (
            player.x < obs.x + obs.width &&
            player.x + player.width > obs.x &&
            player.y < obs.y + obs.height &&
            player.y + player.height > obs.y
        ) {
            createParticles(player.x + player.width/2, player.y + player.height/2);
            endGame();
        }
    });

    obstacles = obstacles.filter(obs => obs.y < canvas.height);
}

function updateDifficulty() {
    if (frameCount % 450 === 0) {
        difficulty.level++;
        difficulty.obstacleSpeed += 0.4;
        difficulty.spawnRate += 0.009;
    }
}

function endGame() {
    gameOver = true;
    document.getElementById("gameOverScreen").classList.remove("hidden");
}

function restartGame() {
    obstacles = [];
    particles = [];
    score = 0;
    frameCount = 0;
    gameOver = false;

    difficulty = {
        level: 1,
        obstacleSpeed: 3,
        spawnRate: 0.02
    };

    document.getElementById("score").innerText = "0";
    document.getElementById("gameOverScreen").classList.add("hidden");
    loop();
}

function loop() {
    if (gameOver && particles.length === 0) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    frameCount++;

    drawStars();
    drawPlayer();
    drawObstacles();
    drawParticles();
    updateObstacles();
    updateDifficulty();

    score++;
    document.getElementById("score").innerText = score;

    if (!gameOver && Math.random() < difficulty.spawnRate) {
        createObstacle();
    }

    requestAnimationFrame(loop);
}

loop();