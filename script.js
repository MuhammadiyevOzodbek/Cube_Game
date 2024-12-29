const playerCube = document.getElementById('playerCube');
const gameArea = document.getElementById('gameArea');

const gameAreaWidth = gameArea.clientWidth;
const gameAreaHeight = gameArea.clientHeight;

let playerPosition = { x: 100, y: 100 }; // O'yinchi boshlang'ich pozitsiyasi
let bots = [
    { x: 400, y: 400, speed: 2, targetX: 0, targetY: 0, state: 'idle' }  // Birinchi bot boshlang'ich pozitsiyasi va maqsadi
];
const playerSpeed = 10;  // O'yinchi tezligi
let playerVelocity = { x: 0, y: 0 };  // O'yinchi tezligi
let gamePaused = false;  // O'yinning holati, boshlang'ichda o'yin ishlamoqda

let timeLeft = 10;  // 10 soniya vaqt
let timeInterval;   // Vaqt intervali
let botCreationInterval; // Yangi botni yaratish vaqti

let gameOver = false; // O'yinning tugaganligini aniqlovchi flag

// O'yinchi harakatini boshqarish (W, A, S, D)
document.addEventListener('keydown', (e) => {
    if (gameOver) return;  // Agar o'yin tugagan bo'lsa, harakatni blokla

    switch (e.key) {
        case 'w':
        case 'W':
            playerVelocity.y = -playerSpeed;  // Yuqoriga harakat
            break;
        case 's':
        case 'S':
            playerVelocity.y = playerSpeed;  // Pastga harakat
            break;
        case 'a':
        case 'A':
            playerVelocity.x = -playerSpeed;  // Chapga harakat
            break;
        case 'd':
        case 'D':
            playerVelocity.x = playerSpeed;  // O'ngga harakat
            break;
    }
});

// Klavish tugmasi bo'shatilganida, tezlikni to'xtatish
document.addEventListener('keyup', (e) => {
    if (e.key === 'w' || e.key === 's' || e.key === 'W' || e.key === 'S') {
        playerVelocity.y = 0;
    }
    if (e.key === 'a' || e.key === 'd' || e.key === 'A' || e.key === 'D') {
        playerVelocity.x = 0;
    }
});

// O'yinni to'xtatish va davom ettirish
function toggleGamePause() {
    gamePaused = !gamePaused;  // Holatni teskari qilish
}

// O'yinchining pozitsiyasini yangilash
function updatePlayerPosition() {
    if (gamePaused) return;  // Agar o'yin to'xtatilgan bo'lsa, harakatni to'xtatish

    playerPosition.x += playerVelocity.x;
    playerPosition.y += playerVelocity.y;

    // O'yinchi chegaradan chiqmasligi uchun cheklov
    if (playerPosition.x < 0) playerPosition.x = 0;
    if (playerPosition.x > gameAreaWidth - 50) playerPosition.x = gameAreaWidth - 50;
    if (playerPosition.y < 0) playerPosition.y = 0;
    if (playerPosition.y > gameAreaHeight - 50) playerPosition.y = gameAreaHeight - 50;
}

// Botlarni o'yinchiga qarab harakatlantirish
function moveBots() {
    if (gamePaused) return;  // Agar o'yin to'xtatilgan bo'lsa, bot harakatini to'xtatish

    bots.forEach(bot => {
        // O'yinchiga qarab yo'nalish aniqlanadi
        const directionX = playerPosition.x > bot.x ? 1 : -1;
        const directionY = playerPosition.y > bot.y ? 1 : -1;

        // O'yinchi bilan birga botlarni harakatlantirish (qiymatni optimallashtirish)
        bot.x += bot.speed * directionX;
        bot.y += bot.speed * directionY;

        // Botning holatini yangilash
        if (bot.state === 'idle') {
            // Bot o'yinchini kuzatadi
            const angle = Math.atan2(playerPosition.y - bot.y, playerPosition.x - bot.x);
            bot.x += bot.speed * Math.cos(angle);
            bot.y += bot.speed * Math.sin(angle);
        } else if (bot.state === 'chase') {
            // Bot o'yinchiga qattiqroq intiladi
            const angle = Math.atan2(playerPosition.y - bot.y, playerPosition.x - bot.x);
            bot.x += bot.speed * Math.cos(angle) * 1.2; // Bot tezligini 1.5 dan 1.2 ga kamaytirdik
            bot.y += bot.speed * Math.sin(angle) * 1.2;
        }

        // Botlar orasida to'qnashuvni oldini olish
        bots.forEach((otherBot, idx) => {
            if (otherBot !== bot) {
                const distance = Math.sqrt(Math.pow(bot.x - otherBot.x, 2) + Math.pow(bot.y - otherBot.y, 2));
                if (distance < 50) {  // Agar botlar juda yaqin bo'lsa
                    bot.x -= bot.speed * directionX * 0.5;
                    bot.y -= bot.speed * directionY * 0.5;
                }
            }
        });

        // Botlarni to'qnashmasligi uchun holatni o'zgartirish
        if (Math.random() < 0.1) {  // Tasodifiy holatni o'zgartirish
            bot.state = bot.state === 'idle' ? 'chase' : 'idle';
        }
    });

    updatePositions();
}

// To'qnashuvni tekshirish
function checkCollision() {
    if (gamePaused || gameOver) return;  // Agar o'yin to'xtatilgan bo'lsa yoki o'yin tugagan bo'lsa, tekshirishni to'xtatish

    const playerRect = playerCube.getBoundingClientRect();  // O'yinchining rectangle'ini olish
    bots.forEach(bot => {
        let botCube = document.getElementById(`botCube${bots.indexOf(bot)}`);
        if (!botCube) return;

        const botRect = botCube.getBoundingClientRect();  // Botning rectangle'ini olish

        // Agar o'yinchi va botning rectangle'lari to'qnashsa, game over
        if (
            playerRect.left < botRect.right &&
            playerRect.right > botRect.left &&
            playerRect.top < botRect.bottom &&
            playerRect.bottom > botRect.top
        ) {
            if (!gameOver) {  // Faqat o'yin hali tugamagan bo'lsa, game over ni chaqirish
                gameOver = true;
                alert("Game Over!");
                resetGame();
            }
        }
    });
}




// Pozitsiyalarni yangilash
function updatePositions() {
    playerCube.style.left = playerPosition.x + 'px';
    playerCube.style.top = playerPosition.y + 'px';

    bots.forEach((bot, index) => {
        let botCube = document.getElementById(`botCube${index}`);
        if (!botCube) {
            botCube = document.createElement('div');
            botCube.id = `botCube${index}`;
            botCube.classList.add('bot');
            gameArea.appendChild(botCube);
        }
        botCube.style.left = bot.x + 'px';
        botCube.style.top = bot.y + 'px';
    });
}

// Yangi botni yaratish
function createNewBot() {
    bots.push({
        x: Math.random() * (gameAreaWidth - 50), // Yangi botning tasodifiy pozitsiyasi
        y: Math.random() * (gameAreaHeight - 50),
        speed: 2,  // Yangi botning tezligi
        state: 'idle'  // Yangi botning holati
    });
}

// Vaqtni boshqarish va yangi bot yaratish
function startTimer() {
    timeInterval = setInterval(() => {
        if (gamePaused) return;

        timeLeft--;
        if (timeLeft <= 0) {
            createNewBot();  // Yangi bot qo'shilishi
            timeLeft = 10;    // Vaqtni yana 10 ga tiklash
        }
    }, 1000);
}

let gameLoopRequest; // Global o'zgaruvchi, game loop uchun request aniqlanadi

// O'yinni qayta boshlash
function resetGame() {
    playerPosition = { x: 100, y: 100 };
    bots = [{ x: 400, y: 400, speed: 2, state: 'idle' }];  // Faqat bitta botni qayta boshlash
    gamePaused = false;  // O'yinni qayta ishga tushiradi
    timeLeft = 10;  // 10 soniya vaqtni tiklash
    updatePositions();
    gameOver = false;  // gameOver holatini qayta o'rnatish
    playerVelocity = { x: 0, y: 0 };  // O'yinchi tezligini to'xtatish
}

// O'yin tsiklini yaratish (game loop)
function gameLoop() {
    if (gamePaused || gameOver) return;  // Agar o'yin to'xtatilgan bo'lsa yoki o'yin tugagan bo'lsa, loopni to'xtatish

    updatePlayerPosition();  // O'yinchi tezligini yangilash
    moveBots();              // Botlar harakatini yangilash
    checkCollision();        // To'qnashuvni tekshirish
    gameLoopRequest = requestAnimationFrame(gameLoop);  // Keyingi frame uchun qayta chaqirish
}

startTimer();  // Vaqtni boshlash
gameLoop();
