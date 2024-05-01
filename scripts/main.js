const DELTAS = [
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
  [-1, -1],
  [-1, 0],
  [-1, 1],
];

class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.bomb = false;
    this.flag = false;
    this.reveal = false;
    this.neighbors = [];
    this.touch = 0;
  }
}

class Minefield {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.grid = this.createGrid(width, height);
    this.clicked = [];
  }

  createGrid(width, height) {
    const grid = [];
    for (let x = 0; x < width; x++) {
      const column = [];
      for (let y = 0; y < height; y++) {
        const cell = new Cell(x, y);
        column.push(cell);
      }
      grid.push(column);
    }
    return grid;
  }

  placeBombs() {
    const grid = this.grid;
    for (let i = 0; i < grid.length; i++) {
      const column = this.grid[i];
      for (let j = 0; j < column.length; j++) {
        const cell = column[j];
        if (0.1 > Math.random()) {
          cell.bomb = true;
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
            cell.touch += 1;
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

  displayMinefield() {
    const divMinefield = document.querySelector("#minefield");
    for (let x = 0; x < this.width; x++) {
      const divColumn = document.createElement("div");
      divColumn.setAttribute("class", "cell-column");
      for (let y = 0; y < this.height; y++) {
        const cell = this.grid[x][y];
        const divCell = document.createElement("div");
        divCell.setAttribute("class", "cell");
        divCell.setAttribute("id", `${x},${y}`);
        divCell.addEventListener("click", () => {
          this.revealCell(cell, divCell);
        });
        divColumn.appendChild(divCell);
      }
      divMinefield.appendChild(divColumn);
    }
  }

  revealCell(cell) {
    this.clicked.push(cell);
    cell.reveal = true;
    const divCell = document.getElementById(`${cell.x},${cell.y}`);
    if (cell.bomb) {
      divCell.textContent = "@";
    } else if (cell.touch) {
      divCell.textContent = `${cell.touch}`;
    } else {
      const toVisit = cell.neighbors;
      while (toVisit.length > 0) {
        const nextCell = toVisit.pop();
        if (this.clicked.includes(nextCell)) {
          continue;
        }
        this.revealCell(nextCell);
      }
    }
  }

  logMinefield() {
    for (let y = 0; y < this.height; y++) {
      let row = "";
      for (let x = 0; x < this.height; x++) {
        const cell = this.grid[x][y];
        if (cell.bomb) {
          row += " @";
        } else if (cell.touch) {
          row += ` ${cell.touch}`;
        } else {
          row += " .";
        }
      }
      console.log(row);
    }
  }
}

const width = 20;
const height = 20;

const minefield = new Minefield(width, height);
minefield.placeBombs();
minefield.countTouches();
minefield.logMinefield();
minefield.displayMinefield();
