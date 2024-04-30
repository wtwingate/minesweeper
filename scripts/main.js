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

class Grid {
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

  printGrid() {
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

const grid = new Grid(10, 10);
grid.placeBombs();
grid.countTouches();
grid.printGrid();
