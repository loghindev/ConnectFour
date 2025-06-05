const gameboard = document.getElementById("gameboard");
const player1Name = document.querySelector("#game #player1 .name");
const player1Trophy = document.querySelector("#game #player1 .winner-icon");
const player1Piece = document.querySelector("#game #playersWrapper #player1 .piece");
const player2Name = document.querySelector("#game #player2 .name");
const player2Trophy = document.querySelector("#game #player2 .winner-icon");
const player2Piece = document.querySelector("#game #playersWrapper #player2 .piece");
const resetBtn = document.querySelector("#restart img");
const settings = document.getElementById("settings");
const resetScoreBtn = document.getElementById("reset-scoreboard");
const resetRound = document.getElementById("reset-current-game");
const player1SettingsColor = document.querySelector("#settings .content .player1-color .pieces-colors .color");
const player2SettingsColor = document.querySelector("#settings .content .player2-color .pieces-colors .color");
const musicUnmutedIcon = document.querySelector("#settings .music .music-unmuted");
const musicMutedIcon = document.querySelector("#settings .music .music-muted");
const effectsUnmutedIcon = document.querySelector("#settings .effects .effects-unmuted");
const effectsMutedIcon = document.querySelector("#settings .effects .effects-muted");
const rows = 6;
const cols = 7;
const players = ["Red", "Yellow"];

let currPlayer = players[Math.floor(Math.random() * players.length)];
let player1ColorIndex =
  localStorage.getItem("player1ColorIndex") !== null ? localStorage.getItem("player1ColorIndex") : 0;
let player2ColorIndex =
  localStorage.getItem("player2ColorIndex") !== null ? localStorage.getItem("player2ColorIndex") : 1;
let matrix = [];
let gameOver = false;
// console.log(localStorage);

document.addEventListener("DOMContentLoaded", () => {
  generateGameboard();
  highlighCurrentPlayer();
  // loadAudioSettings();
  loadPlayersPieces();
  handlePiecesChanger();
});

function generateGameboard() {
  for (let r = 0; r < rows; ++r) {
    let emptyRow = [];
    for (let c = 0; c < cols; ++c) {
      const newCell = document.createElement("div");
      newCell.id = r.toString() + "-" + c.toString();
      newCell.classList = "cell";
      newCell.addEventListener("click", setCell);
      gameboard.appendChild(newCell);
      emptyRow.push(" ");
    }
    matrix.push(emptyRow);
  }
}

function setCell(event) {
  let r = rows - 1;
  let c = event.target.id.split("-")[1];
  if (gameOver || matrix[0][c] !== " ") return;

  // search for available cell
  while (r >= 0) {
    const cell = document.getElementById(`${r}-${c}`);
    if (matrix[r][c] === " " && currPlayer === "Red") {
      matrix[r][c] = players[0];
      cell.classList.add("fade-in");
      const path =
        localStorage.getItem("player1Color") !== null
          ? localStorage.getItem("player1Color")
          : piecesColors[player1ColorIndex];
      cell.style.backgroundImage = `url(${path.replace("IN", "OUT")})`;
      break;
    } else if (matrix[r][c] === " " && currPlayer === "Yellow") {
      matrix[r][c] = players[1];
      cell.classList.add("fade-in");
      const path =
        localStorage.getItem("player2Color") !== null
          ? localStorage.getItem("player2Color")
          : piecesColors[player2ColorIndex];
      cell.style.backgroundImage = `url(${path.replace("IN", "OUT")})`;
      break;
    }
    --r;
  }

  checkWinner(currPlayer);
  if (!gameOver) {
    currPlayer = currPlayer === players[0] ? players[1] : players[0];
    highlighCurrentPlayer();
  }
  runClickEffect();
}

function checkWinner(player) {
  // horizontally
  for (let r = 0; r < rows; ++r) {
    for (let c = 0; c < 4; ++c) {
      if (matrix[r][c] !== " ") {
        if (
          matrix[r][c] === matrix[r][c + 1] &&
          matrix[r][c + 1] === matrix[r][c + 2] &&
          matrix[r][c + 2] === matrix[r][c + 3]
        ) {
          displayWinner(
            player,
            r.toString() + "-" + c.toString(),
            r.toString() + "-" + (c + 1).toString(),
            r.toString() + "-" + (c + 2).toString(),
            r.toString() + "-" + (c + 3).toString()
          );
          return;
        }
      }
    }
  }
  // vertically
  for (let c = 0; c < cols; ++c) {
    for (let r = 0; r < 3; ++r) {
      if (matrix[r][c] !== " ") {
        if (
          matrix[r][c] === matrix[r + 1][c] &&
          matrix[r + 1][c] === matrix[r + 2][c] &&
          matrix[r + 2][c] === matrix[r + 3][c]
        ) {
          displayWinner(
            player,
            r.toString() + "-" + c.toString(),
            (r + 1).toString() + "-" + c.toString(),
            (r + 2).toString() + "-" + c.toString(),
            (r + 3).toString() + "-" + c.toString()
          );
          return;
        }
      }
    }
  }
  // diag (main)
  for (let r = 0; r < 3; ++r) {
    for (let c = 0; c < 4; ++c) {
      if (matrix[r][c] !== " ") {
        if (
          matrix[r][c] === matrix[r + 1][c + 1] &&
          matrix[r + 1][c + 1] === matrix[r + 2][c + 2] &&
          matrix[r + 2][c + 2] === matrix[r + 3][c + 3]
        ) {
          displayWinner(
            player,
            r.toString() + "-" + c.toString(),
            (r + 1).toString() + "-" + (c + 1).toString(),
            (r + 2).toString() + "-" + (c + 2).toString(),
            (r + 3).toString() + "-" + (c + 3).toString()
          );
          return;
        }
      }
    }
  }
  // diag (secondary)
  for (let r = 0; r < 3; ++r) {
    for (let c = 3; c < cols; ++c) {
      if (matrix[r][c] !== " ") {
        if (
          matrix[r][c] === matrix[r + 1][c - 1] &&
          matrix[r + 1][c - 1] === matrix[r + 2][c - 2] &&
          matrix[r + 2][c - 2] === matrix[r + 3][c - 3]
        ) {
          displayWinner(
            player,
            r.toString() + "-" + c.toString(),
            (r + 1).toString() + "-" + (c - 1).toString(),
            (r + 2).toString() + "-" + (c - 2).toString(),
            (r + 3).toString() + "-" + (c - 3).toString()
          );
          return;
        }
      }
    }
  }
  // tie
  const filledCells = document.querySelectorAll("#gameboard .cell.fade-in");
  if (filledCells.length === rows * cols && !gameOver) {
    displayWinner("Tie");
  }
}

function displayWinner(winner, ...cellsId) {
  console.log("Winner pieces: ", cellsId);
  cellsId.forEach((id) => document.getElementById(id).classList.add("winner-cell-blink"));

  gameOver = true;
  if (winner === "Red") {
    runWinnerEffect();
    player1Trophy.classList.replace("hidden", "zoom-in");
  } else if (winner === "Yellow") {
    runWinnerEffect();
    player2Trophy.classList.replace("hidden", "zoom-in");
  } else if (winner === "Tie") {
    runTieEffect();
    document.getElementById("versus-icon").textContent = "TIE";
    document.getElementById("versus-icon").classList = "blink";
  }
  highlighCurrentPlayer(); // gameOver is true
  resetBtn.classList.replace("hidden", "fade-in");
  resetBtn.addEventListener("click", () => {
    resetGame(cellsId);
  });
}

function highlighCurrentPlayer() {
  player1Name.style.transition = "color 0.25s ease";
  player2Name.style.transition = "color 0.25s ease";
  if (gameOver) {
    player1Name.style.color = "black";
    player2Name.style.color = "black";
    return;
  }
  if (currPlayer === players[0]) {
    player1Name.style.color = "white";
    player2Name.style.color = "black";
  } else if (currPlayer === players[1]) {
    player1Name.style.color = "black";
    player2Name.style.color = "white";
  }
}

function loadPlayersPieces() {
  player1Piece.src = piecesColors[player1ColorIndex];
  player2Piece.src = piecesColors[player2ColorIndex];
  player1SettingsColor.src = piecesColors[player1ColorIndex];
  player2SettingsColor.src = piecesColors[player2ColorIndex];
}

function resetGame(cellsId) {
  gameOver = false;
  // !!! TO FIX
  if (cellsId !== null) {
    cellsId.forEach((id) => document.getElementById(id).classList.remove("winner-cell-blink"));
  } else {
    console.log("New Round - called from Settings");
  }
  clearGameboard();
  highlighCurrentPlayer();
  loadPlayersPieces();
  resetBtn.classList.replace("fade-in", "hidden");
  player1Trophy.classList.replace("zoom-in", "hidden");
  player2Trophy.classList.replace("zoom-in", "hidden");
  runClickEffect();
}

function clearGameboard() {
  const cells = Array.from(gameboard.querySelectorAll(".cell")).filter((cell) => cell.classList.contains("fade-in"));
  cells.forEach((cell) => {
    cell.style.backgroundImage = "unset";
    cell.classList.remove("fade-in");
  });
  // clear matrix
  matrix.forEach((array) => {
    for (let i = 0; i < array.length; ++i) {
      array[i] = " ";
    }
  });
}

// ---------- Aside Settings ------------
const musicText = document.querySelector("#settings .music span");
const music = document.getElementById("bgAudio");
music.volume = 0.4;

const clickEffect = new Audio("./assets/effects/click-effect.mp3");
const winnerEffect = new Audio("./assets/effects/winner-effect.mp3");
const tieEffect = new Audio("./assets/effects/tie-effect.mp3");
winnerEffect.volume = 0.6;
tieEffect.volume = 0.6;

musicUnmutedIcon.addEventListener("click", () => {
  musicUnmutedIcon.classList.add("hidden-setting");
  musicMutedIcon.classList.remove("hidden-setting");
  musicText.textContent = "Music no";
  music.pause();
});

musicMutedIcon.addEventListener("click", () => {
  musicMutedIcon.classList.add("hidden-setting");
  musicUnmutedIcon.classList.remove("hidden-setting");
  musicText.textContent = "Music on";
  music.play();
});

effectsUnmutedIcon.addEventListener("click", () => {
  effectsUnmutedIcon.classList.add("hidden-setting");
  effectsMutedIcon.classList.remove("hidden-setting");
  // runClickEffect();
});

effectsMutedIcon.addEventListener("click", () => {
  effectsMutedIcon.classList.add("hidden-setting");
  effectsUnmutedIcon.classList.remove("hidden-setting");
  runClickEffect();
});

resetRound.addEventListener("click", () => {
  resetGame(null);
});

function handlePiecesChanger() {
  const player1ArrLeft = document.querySelector("#settings .player1-color .options .left-arr");
  const player1ArrRight = document.querySelector("#settings .player1-color .options .right-arr");
  const player2ArrLeft = document.querySelector("#settings .player2-color .options .left-arr");
  const player2ArrRight = document.querySelector("#settings .player2-color .options .right-arr");
  const colorsLength = piecesColors.length;

  // handle actions
  player1ArrLeft.addEventListener("click", () => {
    player1ColorIndex > 0 ? --player1ColorIndex : (player1ColorIndex = colorsLength - 1);
    updatePieceColor(player1ColorIndex, 1);

    runClickEffect();
  });
  player1ArrRight.addEventListener("click", () => {
    player1ColorIndex < colorsLength - 1 ? ++player1ColorIndex : (player1ColorIndex = 0);
    updatePieceColor(player1ColorIndex, 1);

    runClickEffect();
  });

  player2ArrLeft.addEventListener("click", () => {
    player2ColorIndex > 0 ? --player2ColorIndex : (player2ColorIndex = colorsLength - 1);
    updatePieceColor(player2ColorIndex, 2);

    runClickEffect();
  });

  player2ArrRight.addEventListener("click", () => {
    player2ColorIndex < colorsLength - 1 ? ++player2ColorIndex : (player2ColorIndex = 0);
    updatePieceColor(player2ColorIndex, 2);

    runClickEffect();
  });
}

function updatePieceColor(index, player) {
  if (player === 1) {
    player1SettingsColor.src = piecesColors[index];
    player1Piece.src = piecesColors[index];
    localStorage.setItem("player1Color", piecesColors[index]);
    localStorage.setItem("player1ColorIndex", index);
  } else if (player === 2) {
    player2SettingsColor.src = piecesColors[index];
    player2Piece.src = piecesColors[index];
    localStorage.setItem("player2Color", piecesColors[index]);
    localStorage.setItem("player2ColorIndex", index);
  }
}

function runClickEffect() {
  if (effectsUnmutedIcon.classList.contains("hidden-setting")) return;
  clickEffect.currentTime = 0.2;
  clickEffect.play();
}

function runWinnerEffect() {
  if (musicUnmutedIcon.classList.contains("hidden-setting")) return;
  winnerEffect.currentTime = 0;
  winnerEffect.play();
}

function runTieEffect() {
  if (musicUnmutedIcon.classList.contains("hidden-setting")) return;
  tieEffect.currentTime = 0;
  tieEffect.play();
}

const piecesColors = [
  "./assets/icons/BTN_RED_CIRCLE_IN.webp",
  "./assets/icons/BTN_LORANGE_CIRCLE_IN.webp",
  "./assets/icons/BTN_GREEN_CIRCLE_IN.webp",
  "./assets/icons/BTN_BLUE_CIRCLE_IN.webp",
  "./assets/icons/BTN_GRAY_CIRCLE_IN.webp",
];
