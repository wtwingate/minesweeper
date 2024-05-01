const neighbors = [
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
    this.touch = 0;
  }
}

class Minefield {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.grid = this.createGrid(width, height);
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
        const cellNeighbors = this.getNeighbors(i, j);
        for (const neighbor of cellNeighbors) {
          if (neighbor.bomb) {
            cell.touch += 1;
          }
        }
      }
    }
  }

  getNeighbors(x, y) {
    const cellNeighbors = [];
    for (let [xOffset, yOffset] of neighbors) {
      const nx = x + xOffset;
      const ny = y + yOffset;
      if (nx < 0 || nx >= this.width || ny < 0 || ny >= this.width) {
        continue;
      }
      cellNeighbors.push(this.grid[nx][ny]);
    }
    return cellNeighbors;
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

function createMinefieldDiv(minefield) {
  const divMinefield = document.querySelector("#minefield");

  for (let x = 0; x < minefield.width; x++) {
    const column = document.createElement("div");
    column.setAttribute("class", "cell-column");
    for (let y = 0; y < minefield.height; y++) {
      const cell = document.createElement("div");
      cell.setAttribute("class", "cell");
      cell.setAttribute("id", `${x},${y}`);
      cell.addEventListener("click", () => {
        revealCell(cell, minefield, x, y);
      });
      column.appendChild(cell);
    }
    divMinefield.appendChild(column);
  }
}

function revealCell(cell, minefield, x, y) {
  const target = minefield.grid[x][y];
  if (target.bomb) {
    cell.textContent = "@";
  } else if (target.touch) {
    cell.textContent = `${target.touch}`;
  }
}

const width = 20;
const height = 20;

const minefield = new Minefield(width, height);
minefield.placeBombs();
minefield.countTouches();
minefield.logMinefield();
createMinefieldDiv(minefield);
