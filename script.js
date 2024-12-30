// DOM Elements
const setupScreen = document.getElementById("setupScreen");
const gameScreen = document.getElementById("gameScreen");
const playerNameInput = document.getElementById("playerName");
const languageSelect = document.getElementById("languageSelect");
const startGameBtn = document.getElementById("startGameBtn");
const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");
const bestScoreDisplay = document.getElementById("bestScore");
const title = document.getElementById("title");
const instructions = document.getElementById("instructions");
const timerDisplay = document.getElementById("timerDisplay");
const durationSelect = document.getElementById("durationSelect");

let score = 0;
let bestScore = 0;
let bestPlayer = "-";
let currentLanguage = "en";
let circleInterval;
let timerRunning = false;
let gameTimer;
let gameDuration = 30000; // Default to 30 seconds

// Texts for Localization
const texts = {
    en: {
        title: "AIM Practice",
        instructions: "Click on the circles as fast as you can.",
        startGame: "Start Game",
        score: "Score: ",
        bestScore: "Best: ",
        timer: "Timer: ",
        duration: "Select Duration"
    },
    es: {
        title: "Práctica de Puntería",
        instructions: "Haz clic en los círculos lo más rápido que puedas.",
        startGame: "Iniciar Juego",
        score: "Puntuación: ",
        bestScore: "Mejor: ",
        timer: "Temporizador: ",
        duration: "Seleccionar Duración"
    }
};

// Event Listeners
startGameBtn.addEventListener("click", startGame);
languageSelect.addEventListener("change", changeLanguage);
durationSelect.addEventListener("change", setGameDuration);

function startGame() {
    const playerName = playerNameInput.value.trim();
    if (!playerName) {
        alert("Please enter your name.");
        return;
    }
    const durationMs = parseInt(durationSelect.value) * 1000;
    if (durationMs > 0 && durationMs <= 90000) {
        gameDuration = durationMs;
    } else {
        alert("Invalid duration. Please enter a value between 1 and 90 seconds.");
        return;
    }
    setupScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    score = 0;
    updateScore();
    updateBestScore();
    gameArea.innerHTML = "";
    createCircle();
    circleInterval = setInterval(createCircle, 800);
    startTimer();
}

function startTimer() {
    if (timerRunning) return;
    timerRunning = true;
    let timeLeft = gameDuration / 1000;
    timerDisplay.textContent = `${texts[currentLanguage].timer} ${timeLeft}`;
    const timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `${texts[currentLanguage].timer} ${timeLeft}`;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            endGame();
        }
    }, 1000);
    gameTimer = setTimeout(endGame, gameDuration);
}

function endGame() {
    clearInterval(circleInterval);
    clearTimeout(gameTimer);
    timerRunning = false;
    if (score > bestScore) {
        bestScore = score;
        bestPlayer = playerNameInput.value.trim();
    }
    alert(`Game over! Your score is ${score}`);
    setupScreen.classList.remove("hidden");
    gameScreen.classList.add("hidden");
}

function createCircle() {
    const circle = document.createElement("div");
    circle.classList.add("circle");
    const size = 50; // Fixed size for all circles
    const x = Math.random() * (gameArea.clientWidth - size);
    const y = Math.random() * (gameArea.clientHeight - size);
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;
    circle.addEventListener("click", () => {
        score++;
        updateScore();
        circle.classList.add("clicked");
        setTimeout(() => circle.remove(), 200);
    });
    gameArea.appendChild(circle);
}

function updateScore() {
    scoreDisplay.textContent = `${texts[currentLanguage].score} ${score}`;
}

function updateBestScore() {
    bestScoreDisplay.textContent = `${texts[currentLanguage].bestScore} ${bestScore} (Player: ${bestPlayer})`;
}

function changeLanguage() {
    currentLanguage = languageSelect.value;
    title.textContent = texts[currentLanguage].title;
    instructions.textContent = texts[currentLanguage].instructions;
    startGameBtn.textContent = texts[currentLanguage].startGame;
    timerDisplay.textContent = `${texts[currentLanguage].timer} 0`;
    updateScore();
    updateBestScore();
}