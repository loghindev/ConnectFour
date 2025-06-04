const gameboard = document.getElementById("gameboard");
const rows = 6;
const cols = 7;
const players = ["Red", "Yellow"];
let currPlayer = players[Math.floor(Math.random() * players.length)];
let matrix = [];
let gameOver = false;

document.addEventListener("DOMContentLoaded", () => {
  generateGameboard();
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
  if (gameOver) return;
  let r = rows - 1;
  let c = event.target.id.split("-")[1];

  while (r >= 0) {
    if (matrix[0][c] !== " ") break;

    if (matrix[r][c] === " " && currPlayer === "Red") {
      const cell = document.getElementById(`${r}-${c}`);
      matrix[r][c] = players[0];
      cell.style.backgroundColor = "red";
      break;
    } else if (matrix[r][c] === " " && currPlayer === "Yellow") {
      const cell = document.getElementById(`${r}-${c}`);
      matrix[r][c] = players[1];
      cell.style.backgroundColor = "yellow";
      break;
    }
    --r;
  }
  // after each click, check winner then update current player
  checkWinner(currPlayer);
  currPlayer = currPlayer === players[0] ? players[1] : players[0];
  console.log(...matrix);
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
          displayWinner(player);
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
          displayWinner(player);
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
          displayWinner(player);
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
          displayWinner(player);
          return;
        }
      }
    }
  }
}

function displayWinner(winner) {
  gameOver = true;
  setTimeout(() => {
    alert(`Winner is ${winner}`);
  }, 100);
}
