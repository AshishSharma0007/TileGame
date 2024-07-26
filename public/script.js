const tilesContainer = document.querySelector(".tiles");
const colors = [
  "#FF0000",
  "#FFA500",
  "#FFFF00",
  "#00FF00",
  "#00FFFF",
  "#0000FF",
  "#FF00FF",
  "#FF1493",
];
function menu() {
  window.location.reload()
}
let time = 0;
popup.style.display = "none";
popup2.style.display = "none";
const colorsPickList = [...colors, ...colors];
const tileCount = colorsPickList.length;
function startGame() {
  for (let i = 0; i < tileCount; i++) {
    const randomIndex = Math.floor(Math.random() * colorsPickList.length);
    const color = colorsPickList[randomIndex];
    const tile = buildMyTile(color);
    colorsPickList.splice(randomIndex, 1);
    tilesContainer.appendChild(tile);
  }
  heading.style.display = "none";
  startButton.style.display = "none";
}

let revealedCount = 0;
let activeTile = null;
let awaitingFinish = false;

function buildMyTile(color) {
  const element = document.createElement("div");
  element.classList.add("tile");
  element.setAttribute("data-color", color);
  element.setAttribute("data-revealed", "false");
  element.addEventListener("click", () => {
    const revealed = element.getAttribute("data-revealed");
    if (awaitingFinish || revealed === "true" || element == activeTile) {
      return;
    }
    element.style.backgroundColor = color;

    if (!activeTile) {
      activeTile = element;
      return;
    }
    const colorToMatch = activeTile.getAttribute("data-color");
    if (colorToMatch === color) {
      element.setAttribute("data-revealed", "true");
      activeTile.setAttribute("data-revealed", "true");
      activeTile = null;
      awaitingFinish = false;
      revealedCount += 2;

      if (revealedCount === tileCount) {
        clearInterval(timerInterval);
        popup2.style.display = "block";
        timer.style.display = "none";
        const take = document.getElementById("timeTaken");
        time = 60-time;
        take.textContent = `${time}`;
        localStorage.setItem('highScore',time.toString());
        const highScore = localStorage.getItem('highScore');
        console.log(highScore);

      }
      return;
    }
    awaitingFinish = true;
    setTimeout(() => {
      activeTile.style.backgroundColor = null;
      element.style.backgroundColor = null;
      awaitingFinish = false;
      activeTile = null;
    }, 1000);
  });

  return element;
}
let timerInterval;
let secondsRemaining = 60;
const timerDisplay = document.getElementById("timer");
const startButton = document.getElementById("startButton");
function updateTimerDisplay() {
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const displaySeconds = seconds < 10 ? `0${seconds}` : seconds;
  timerDisplay.textContent = `Remaining Time: ${displayMinutes}:${displaySeconds}`;
}

function startTimer() {
  startButton.disabled = true;
  timerInterval = setInterval(function () {
    if (secondsRemaining > 0) {
      secondsRemaining--;
      time = secondsRemaining;
      updateTimerDisplay();
    } else {
      clearInterval(timerInterval);
      popup.style.display = "block";
      game.style.display = "none";
      timerDisplay.textContent = "00:00";
      startButton.disabled = false;
    }
  }, 1000);
}
startButton.addEventListener("click", startTimer);
