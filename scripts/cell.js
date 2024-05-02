class Cell {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.bomb = false;
    this.flagged = false;
    this.revealed = false;
    this.neighbors = [];
    this.touching = 0;
  }
}

export { Cell };
