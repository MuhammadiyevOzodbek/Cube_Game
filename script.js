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

let keysPressed = {}; // Tugmalarni bosish holatini saqlash

// O'yinchi harakatini boshqarish (W, A, S, D)
document.addEventListener('keydown', (e) => {
    if (gameOver || gamePaused) return;  // O'yin to'xtatilgan yoki tugagan bo'lsa, harakatni bloklash

    keysPressed[e.key] = true;  // Tugma bosilganini belgilash

    if (e.key === 'w' || e.key === 'W') {
        playerVelocity.y = -playerSpeed;  // Yuqoriga harakat
    }
    if (e.key === 's' || e.key === 'S') {
        playerVelocity.y = playerSpeed;  // Pastga harakat
    }
    if (e.key === 'a' || e.key === 'A') {
        playerVelocity.x = -playerSpeed;  // Chapga harakat
    }
    if (e.key === 'd' || e.key === 'D') {
        playerVelocity.x = playerSpeed;  // O'ngga harakat
    }
});

// Klavish tugmasi bo'shatilganida, tezlikni to'xtatish
document.addEventListener('keyup', (e) => {
    if (gameOver || gamePaused) return;  // O'yin to'xtatilgan yoki tugagan bo'lsa, harakatni bloklash

    keysPressed[e.key] = false;  // Tugma bo'shatilganini belgilash

    // Agar boshqa biror tugma hali bosilgan bo'lsa, harakatni to'xtatmang
    if (e.key === 'w' || e.key === 's' || e.key === 'W' || e.key === 'S') {
        if (!keysPressed['w'] && !keysPressed['s'] && !keysPressed['W'] && !keysPressed['S']) {
            playerVelocity.y = 0; // Harakatni to'xtatish
        }
    }

    if (e.key === 'a' || e.key === 'd' || e.key === 'A' || e.key === 'D') {
        if (!keysPressed['a'] && !keysPressed['d'] && !keysPressed['A'] && !keysPressed['D']) {
            playerVelocity.x = 0; // Harakatni to'xtatish
        }
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
/***************************************************************/
class SuperAI {
    constructor(bot) {
        this.bot = bot;
        this.strategyHistory = [];
        this.performanceHistory = [];
        this.communicationNetwork = [];
        this.adaptiveLearningRate = 0.5;
        this.neuralNetworkModel = new NeuralNetwork();
        this.resources = { health: 100, energy: 100 };
        this.emotionalState = 'neutral'; // Ruhiy holat
    }

    synchronizeWithPeers() {
        this.communicationNetwork.forEach(peerBot => {
            let synchronizedStrategy = this.exchangeStrategies(peerBot);
            this.bot.strategy = synchronizedStrategy;
        });
    }

    exchangeStrategies(peerBot) {
        let peerStrategy = peerBot.strategy;
        if (this.bot.performanceHistory.length < 5) return peerStrategy;
        let adaptiveStrategy = this.adjustStrategyBasedOnPerformance(peerStrategy);
        return adaptiveStrategy;
    }

    adjustStrategyBasedOnPerformance(peerStrategy) {
        let performance = this.evaluatePerformance();
        if (performance < 50) {
            return "defensive";
        } else if (performance > 80) {
            return "aggressive";
        } else {
            return peerStrategy;
        }
    }

    selfLearn() {
        let performance = this.evaluatePerformance();
        let successRate = this.calculateSuccessRate();
        this.neuralNetworkModel.train(performance, successRate);
        this.adjustLearningRate();
    }

    evaluatePerformance() {
        let pastPerformance = this.performanceHistory.reduce((sum, performance) => sum + performance, 0);
        return pastPerformance / this.performanceHistory.length;
    }

    calculateSuccessRate() {
        let totalActions = this.performanceHistory.length;
        let successfulActions = this.performanceHistory.filter(score => score > 60).length;
        return (successfulActions / totalActions) * 100;
    }

    adjustLearningRate() {
        let currentLearningRate = this.neuralNetworkModel.getLearningRate();
        if (currentLearningRate < 0.1) {
            this.neuralNetworkModel.setLearningRate(this.adaptiveLearningRate);
        }
    }

    emotionalDecisionMaking(player) {
        let mood = this.analyzeEmotions(player);
        if (mood === 'aggressive') {
            this.bot.strategy = 'aggressive';
        } else if (mood === 'calm') {
            this.bot.strategy = 'defensive';
        }
    }

    analyzeEmotions(player) {
        if (player.health < 30) {
            return 'aggressive';
        } else if (player.health > 70) {
            return 'calm';
        } else {
            return 'neutral';
        }
    }

    analyzeGameContext(player) {
        let analysis = {
            position: player.position,
            health: player.health,
            nearbyObjects: this.scanForNearbyObjects(player),
            enemyDistance: this.calculateDistanceToEnemy(player),
            behaviorPatterns: this.getBehaviorPatterns(player),
            timeLeft: player.timeLeft // Vaqtni ham hisoblash
        };
        let decision = this.makeComplexDecision(analysis);
        return decision;
    }

    makeComplexDecision(analysis) {
        this.synchronizeWithPeers();

        let decisionScore = 0;
        if (analysis.position === 'danger') decisionScore += 30;
        if (analysis.health < 50) decisionScore += 40;
        if (analysis.nearbyObjects.includes('powerup')) decisionScore += 30;
        if (analysis.enemyDistance < 50) decisionScore += 50;

        if (analysis.timeLeft < 10) decisionScore += 50; // Vaqtni tejash

        return decisionScore > 70 ? 'attack' : 'defend';
    }

    scanForNearbyObjects(player) {
        let objects = ['enemy', 'powerup', 'safezone'];
        return objects.filter(obj => player.objects.includes(obj));
    }

    calculateDistanceToEnemy(player) {
        let enemy = player.objects.find(obj => obj === 'enemy');
        return Math.abs(player.position - enemy.position);
    }

    getBehaviorPatterns(player) {
        // O'yinchining xatti-harakatlarini tahlil qilish
        return player.behaviorPatterns;
    }

    manageResources() {
        // Resurslarni boshqarish
        if (this.resources.health < 50) {
            this.bot.strategy = 'defensive';
            console.log('Health low, switching to defensive mode.');
        }
        if (this.resources.energy < 30) {
            this.bot.strategy = 'rest';
            console.log('Energy low, bot is resting.');
        }
    }

    creativityInDecisionMaking(player) {
        // Yaratuvchan qarorlar
        if (player.isPredictable()) {
            console.log("Player is predictable, adjusting strategy!");
            this.bot.strategy = 'unpredictable';
        } else {
            this.bot.strategy = 'aggressive';
        }
    }

    adaptToUncertainty() {
        // Noaniqlikka moslashish
        let randomFactor = Math.random();
        if (randomFactor > 0.7) {
            this.bot.strategy = 'adaptive';
            console.log("Random event occurred, adapting strategy.");
        }
    }
}

// Super aqlli botlarni ishlatish
function superSmartAI(bot, player) {
    let ai = new SuperAI(bot);

    ai.selfLearn();
    ai.emotionalDecisionMaking(player);
    ai.manageResources(); // Resurslarni boshqarish
    ai.creativityInDecisionMaking(player); // Yaratuvchan qarorlar
    ai.adaptToUncertainty(); // Noaniqliklarga moslashish
    let decision = ai.analyzeGameContext(player);

    if (decision === "attack") {
        bot.action = "attack";
        console.log("Bot hujum qiladi!");
    } else {
        bot.action = "defend";
        console.log("Bot himoya qiladi.");
    }
}

// Botlarni boshqarish
function manageBots(player) {
    if (gamePaused) return;

    bots.forEach(bot => {
        superSmartAI(bot, player);
    });
}
/************************************************************/
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
