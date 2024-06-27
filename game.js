// Constants
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// Game variables
let player = {
    x: canvasWidth / 2,
    y: canvasHeight - 50,
    width: 50,
    height: 20,
    speed: 8
};

let enemies = [];
const enemySize = 20;
const enemySpeed = 2;
const numEnemies = 10;

for (let i = 0; i < numEnemies; i++) {
    enemies.push({
        x: i * (enemySize + 10) + 30,
        y: 30,
        width: enemySize,
        height: enemySize,
        direction: 1
    });
}

let bullets = [];
const bulletSize = 5;
const bulletSpeed = 5;

// Event listeners
document.addEventListener('keydown', handleKeyDown);
document.addEventListener('keyup', handleKeyUp);

// Functions
function handleKeyDown(event) {
    if (event.key === 'ArrowLeft') {
        player.dx = -player.speed;
    } else if (event.key === 'ArrowRight') {
        player.dx = player.speed;
    } else if (event.key === ' ') {
        bullets.push({
            x: player.x + player.width / 2 - bulletSize / 2,
            y: player.y - bulletSize,
            width: bulletSize,
            height: bulletSize,
            dy: -bulletSpeed
        });
    }
}

function handleKeyUp(event) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        player.dx = 0;
    }
}

function drawPlayer() {
    ctx.fillStyle = '#00FF00';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawEnemies() {
    ctx.fillStyle = '#FF0000';
    enemies.forEach(function(enemy) {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

function drawBullets() {
    ctx.fillStyle = '#FFFFFF';
    bullets.forEach(function(bullet) {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

function update() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    drawPlayer();
    drawEnemies();
    drawBullets();

    // Update player position
    player.x += player.dx;
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvasWidth) player.x = canvasWidth - player.width;

    // Update enemies position
    enemies.forEach(function(enemy) {
        enemy.x += enemySpeed * enemy.direction;
        if (enemy.x < 0 || enemy.x + enemy.width > canvasWidth) {
            enemy.direction *= -1;
            enemy.y += enemy.height;
        }
    });

    // Update bullets position
    bullets.forEach(function(bullet, bulletIndex) {
        bullet.y += bullet.dy;

        // Remove bullets that go offscreen
        if (bullet.y < 0) {
            bullets.splice(bulletIndex, 1);
        }

        // Check collision with enemies
        enemies.forEach(function(enemy, enemyIndex) {
            if (bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y) {
                // Remove both bullet and enemy on collision
                bullets.splice(bulletIndex, 1);
                enemies.splice(enemyIndex, 1);
            }
        });
    });

    requestAnimationFrame(update);
}

// Start the game loop
update();
