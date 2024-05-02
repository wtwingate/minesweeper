import { Cell } from "./cell.js";
import { DELTAS } from "./constants.js";

class Minefield {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.gameOver = false;
    this.grid = [];
    this.bombCells = [];
    this.safeCells = [];
    this.revealedCells = [];
    this.flaggedCells = [];
  }

  playGame() {
    this.createGrid();
    this.placeBombs();
    this.countTouches();
    this.displayGrid();
  }

  createGrid() {
    for (let x = 0; x < this.width; x++) {
      const column = [];
      for (let y = 0; y < this.height; y++) {
        const cell = new Cell(x, y);
        column.push(cell);
      }
      this.grid.push(column);
    }
  }

  placeBombs() {
    const grid = this.grid;
    for (let i = 0; i < grid.length; i++) {
      const column = this.grid[i];
      for (let j = 0; j < column.length; j++) {
        const cell = column[j];
        if (0.1 > Math.random()) {
          cell.bomb = true;
          this.bombCells.push(cell);
        } else {
          this.safeCells.push(cell);
        }
      }
    }
  }

  countTouches() {
    const grid = this.grid;
    for (let i = 0; i < grid.length; i++) {
      const column = this.grid[i];
      for (let j = 0; j < column.length; j++) {
        const cell = column[j];
        this.getNeighbors(cell);
        for (const neighbor of cell.neighbors) {
          if (neighbor.bomb) {
            cell.touching += 1;
          }
        }
      }
    }
  }

  getNeighbors(cell) {
    for (let [xOffset, yOffset] of DELTAS) {
      const nx = cell.x + xOffset;
      const ny = cell.y + yOffset;
      if (nx < 0 || nx >= this.width || ny < 0 || ny >= this.width) {
        continue;
      }
      cell.neighbors.push(this.grid[nx][ny]);
    }
  }

  displayGrid() {
    const divGrid = document.getElementById("grid");
    for (let x = 0; x < this.width; x++) {
      const divColumn = document.createElement("div");
      divColumn.setAttribute("class", "cell-column");
      for (let y = 0; y < this.height; y++) {
        const cell = this.grid[x][y];
        const divCell = document.createElement("div");
        divCell.setAttribute("class", "hidden");
        divCell.setAttribute("id", `${x},${y}`);
        divCell.addEventListener("click", () => {
          this.revealCell(cell);
          this.checkWinCondition();
        });
        divCell.addEventListener("contextmenu", (e) => {
          e.preventDefault();
          this.flagCell(cell);
        });
        divColumn.appendChild(divCell);
      }
      divGrid.appendChild(divColumn);
    }
  }

  revealCell(cell) {
    if (this.gameOver) {
      return;
    }
    this.revealedCells.push(cell);
    cell.revealed = true;
    const divCell = document.getElementById(`${cell.x},${cell.y}`);
    divCell.setAttribute("class", "revealed");
    if (cell.bomb) {
      divCell.textContent = "💣";
      this.loseGame();
    } else if (cell.touching) {
      divCell.textContent = `${cell.touching}`;
    } else {
      const toVisit = cell.neighbors;
      while (toVisit.length > 0) {
        const nextCell = toVisit.pop();
        if (this.revealedCells.includes(nextCell)) {
          continue;
        }
        this.revealCell(nextCell);
      }
    }
  }

  flagCell(cell) {
    if (this.gameOver) {
      return;
    }
    const divCell = document.getElementById(`${cell.x},${cell.y}`);
    if (cell.revealed) {
      return;
    } else if (cell.flagged) {
      cell.flagged = false;
      this.flaggedCells = this.flaggedCells.filter((e) => e != cell);
      divCell.textContent = "";
    } else {
      cell.flagged = true;
      this.flaggedCells.push(cell);
      divCell.textContent = "⛳️";
    }
  }

  checkWinCondition() {
    for (const safeCell of this.safeCells) {
      if (!this.revealedCells.includes(safeCell)) {
        return;
      }
    }
    this.gameOver = true;
    const gameState = document.getElementById("game-state");
    gameState.textContent = "Winner Winner Chicken Dinner!";
  }

  loseGame() {
    this.gameOver = true;
    const gameState = document.getElementById("game-state");
    gameState.textContent = "BOOM!";
  }

  logMinefield() {
    for (let y = 0; y < this.height; y++) {
      let row = "";
      for (let x = 0; x < this.height; x++) {
        const cell = this.grid[x][y];
        if (cell.bomb) {
          row += " @";
        } else if (cell.touching) {
          row += ` ${cell.touching}`;
        } else {
          row += " .";
        }
      }
      console.log(row);
    }
  }
}

export { Minefield };
