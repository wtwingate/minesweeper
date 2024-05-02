import { Minefield } from "./minefield.js";

let width = 10;
let height = 10;

let minefield = new Minefield(width, height);
minefield.playGame();

const resetBtn = document.getElementById("reset-btn");
resetBtn.addEventListener("click", () => {
  const gameState = document.getElementById("game-state");
  gameState.textContent = "Let's Play!";
  const grid = document.getElementById("grid");
  grid.innerHTML = "";
  minefield = new Minefield(width, height);
  minefield.playGame();
});
