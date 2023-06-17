"use strict";

const playerBattlegroundCells = document.getElementsByClassName("player-battleground__battleground")[0].getElementsByTagName("td");
const enemyBattlegroundCells = document.getElementsByClassName("enemy-battleground__battleground")[0].getElementsByTagName("td");

for (let i = 0; i < playerBattlegroundCells.length; i++) {
    playerBattlegroundCells[i].addEventListener("click", testing);
}

function testing() {
    console.log(this.dataset.cell);
}