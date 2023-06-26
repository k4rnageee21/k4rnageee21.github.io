"use strict";

// клас клітинки
class Cell {
    constructor() {
        this.status = "free";
    }
}

// клас гравця
class Player {
    constructor() {
        this.battleground = [];
        for (let i = 0; i < 10; i++) {
            this.battleground[i] = [];

            for (let j = 0; j < 10; j++) {
                this.battleground[i][j] = new Cell();
            }
        }

        this.ships = [];
        this.stackPlayerShips = [];
        this.sunkCount = 0;
    }
}

// клас противника
class Enemy {
    constructor() {
        this.battleground = [];
        for (let i = 0; i < 10; i++) {
            this.battleground[i] = [];

            for (let j = 0; j < 10; j++) {
                this.battleground[i][j] = new Cell();
            }
        }

        this.ships = [];
        this.stackEnemyShips = [];
        this.sunkCount = 0;
    }
}

const SHIP_COLOR = "rgba(20, 120, 183, 0.5)";
const MS_DELAY = 1000;
// ініціалізація гравця та суперника
const player = new Player();
const enemy = new Enemy();

// поля гравця та противника з HTML
const playerBattleground = document.querySelector(".player-battleground");
const enemyBattleground = document.querySelector(".enemy-battleground");
// клітинки полей гравця та противника з HTML
const playerBattlegroundCells = document.getElementsByClassName("player-battleground__battleground")[0].getElementsByTagName("td");
const enemyBattlegroundCells = document.getElementsByClassName("enemy-battleground__battleground")[0].getElementsByTagName("td");

enemyBattleground.style.cursor = "auto";

let cellBgColor;

for (let i = 0; i < playerBattlegroundCells.length; i++) {
    // клік на клітинку
    playerBattlegroundCells[i].addEventListener("click", placeShip);
    // наведення на клітинку
    playerBattlegroundCells[i].addEventListener("mouseover", cellHover);
    // відведення від клітинки
    playerBattlegroundCells[i].addEventListener("mouseout", cellUnhover);
}

function cellHover(e) {
    cellBgColor = this.style.backgroundColor;
    this.style.backgroundColor = SHIP_COLOR;
}

function cellUnhover(e) {
    this.style.backgroundColor = cellBgColor;
}

// отримання кораблів зі списку
const ship4 = document.getElementsByClassName("ships__ship_4")[0];
const ship3 = document.getElementsByClassName("ships__ship_3")[0];
const ship2 = document.getElementsByClassName("ships__ship_2")[0];
const ship1 = document.getElementsByClassName("ships__ship_1")[0];
let currentShip = 0;

// збереження в змінній корабля на розміщення
ship4.addEventListener("click", (e) => {
    if (ship4.innerHTML != "x0") {
        currentShip = 4;
    }
});

ship3.addEventListener("click", (e) => {
    if (ship3.innerHTML != "x0") {
        currentShip = 3;
    }
});

ship2.addEventListener("click", (e) => {
    if (ship2.innerHTML != "x0") {
        currentShip = 2;
    }
});

ship1.addEventListener("click", (e) => {
    if (ship1.innerHTML != "x0") {
        currentShip = 1;
    }
});


// чекбокс для вертикального розміщення
const verticalCheckbox = document.querySelector("#verticalCheck");

// розміщення корабля
function placeShip() {
    if (currentShip != 0) {
        const cellAddress = this.dataset.cell;
        const cellIndex = transformCell(cellAddress);
        let status = false;
        let shipBuff = [];
        
        // логіка при вертикальному розміщенні
        if (verticalCheckbox.checked && isPlacingPossiblePlayer(cellIndex[0], cellIndex[1], "v")) { 
            for (let i = 0; i < currentShip; i++) {
                shipBuff.push([cellIndex[0] + i, cellIndex[1]]);
                player.battleground[cellIndex[0] + i][cellIndex[1]].status = "ship";
                let tmpCell;
                if (cellAddress.length === 2) {
                    tmpCell = playerBattleground.querySelector(`[data-cell=${cellAddress[0] + (+(cellAddress[1]) + i)}]`);
                } else {
                    tmpCell = playerBattleground.querySelector(`[data-cell=${cellAddress[0] + (+(cellAddress[1] + cellAddress[2]) + i)}]`);
                }
                
                tmpCell.classList.add("_ship");
                status = true;
            }
            player.ships.push(shipBuff);
        }
        // логіка при горизонтальному розміщенні
        if (!verticalCheckbox.checked && isPlacingPossiblePlayer(cellIndex[0], cellIndex[1], "h")) {
            for (let i = 0; i < currentShip; i++) {
                shipBuff.push([cellIndex[0], cellIndex[1] + i]); 
                player.battleground[cellIndex[0]][cellIndex[1] + i].status = "ship";
                let tmpCell;
                if (cellAddress.length === 2) {
                    tmpCell = playerBattleground.querySelector(`[data-cell=${String.fromCharCode(("" + cellAddress[0]).charCodeAt(0) + i) + Number(cellAddress[1])}]`);  
                } else {
                    tmpCell = playerBattleground.querySelector(`[data-cell=${String.fromCharCode(("" + cellAddress[0]).charCodeAt(0) + i) + Number(cellAddress[1] + cellAddress[2])}]`);  
                }
                tmpCell.classList.add("_ship");
                status = true;
            }
            player.ships.push(shipBuff);
        }

        // віднімання розміщеного корабля від доступних для розміщення
        if (status) {
            if (currentShip == 4) {
                subShip(ship4);
            }
            if (currentShip == 3) {
                subShip(ship3);
            }
            if (currentShip == 2) {
                subShip(ship2);
            }
            if (currentShip == 1) {
                subShip(ship1);
            }
        }
    }
}

// функція віднімання корабля після розміщення з балансу кораблів для розміщення
function subShip(ship) {
    ship.innerHTML = "x" + (+ship.innerHTML[1] - 1);
    if (ship.innerHTML === "x0") {
        ship.classList.add("ships__ship_null");
        ship.disabled = true;
        ship.style.cursor = "auto";
    }
    if (ship.innerHTML == "x0") {
        currentShip = 0;
    }
}

// функція перетворення символьної адреси клітинки в індекси матриці
function transformCell(cell) {
    let result = [];
    if (cell.length === 2) {
        result[0] = +cell[1] - 1;
    } else {
        result[0] = 9;
    }
    result[1] = (("" + cell[0]).toUpperCase()).charCodeAt(0) - "A".charCodeAt(0);
    return result;
}

function isPlacingPossiblePlayer(x, y, placing) {
    // перевірка ситуації, коли корабель не поміщається на полі
    if (placing === "v") {
        if (x + currentShip > 10) {
            return false;
        }
    } else if (placing === "h") {
        if (y + currentShip > 10) {
            return false;
        }
    }

    // перевірка ситуації, коли корабель наїзжає на інші кораблі
    if (placing === "v") {
        for (let i = x; i < x + currentShip; i++) {
            if (player.battleground[i][y].status !== "free") {
                return false;
            }
        }
    } else if (placing === "h") {
        for (let i = y; i < y + currentShip; i++) {
            if (player.battleground[x][i].status !== "free") {
                return false;
            }
        }
    }

    // перевірка ситуації, коли корабель суміжний з іншими кораблями
    if (placing === "v") {
        if (x - 1 >= 0) {
            if (y - 1 >= 0) {
                if (player.battleground[x - 1][y - 1].status === "ship") {
                    return false;
                }
            }
            if (y + 1 < 10) {
                if (player.battleground[x - 1][y + 1].status === "ship") {
                    return false;
                }
            }
            if (player.battleground[x - 1][y].status === "ship") {
                return false;
            }
        }

        for (let i = x; i < x + currentShip; i++) {
            if (y - 1 >= 0) {
                if (player.battleground[i][y - 1].status === "ship") {
                    return false;
                }
            }
            if (y + 1 < 10) {
                if (player.battleground[i][y + 1].status === "ship") {
                    return false;
                }
            }
        }

        if (x + currentShip < 10) {
            if (y - 1 >= 0) {
                if (player.battleground[x + currentShip][y - 1].status === "ship") {
                    return false;
                }
            }
            if (y + 1 < 10) {
                if (player.battleground[x + currentShip][y + 1].status === "ship") {
                    return false;
                }
            }
            if (player.battleground[x + currentShip][y].status === "ship") {
                return false;
            }
        }
    }
    else if (placing === "h") {
        if (y - 1 >= 0) {
            if (x - 1 >= 0) {
                if (player.battleground[x - 1][y - 1].status === "ship") {
                    return false;
                }
            }
            if (x + 1 < 10) {
                if (player.battleground[x + 1][y - 1].status === "ship") {
                    return false;
                }
            }
            if (player.battleground[x][y - 1].status === "ship") {
                return false;
            }
        }

        for (let i = y; i < y + currentShip; i++) {
            if (x - 1 >= 0) {
                if (player.battleground[x - 1][i].status === "ship") {
                    return false;
                }
            }
            if (x + 1 < 10) {
                if (player.battleground[x + 1][i].status === "ship") {
                    return false;
                }
            }
        }

        if (y + currentShip < 10) {
            if (x - 1 >= 0) {
                if (player.battleground[x - 1][y + currentShip].status === "ship") {
                    return false;
                }
            }
            if (x + 1 < 10) {
                if (player.battleground[x + 1][y + currentShip].status === "ship") {
                    return false;
                }
            }
            if (player.battleground[x][y + currentShip].status === "ship") {
                return false;
            }
        }
    }

    return true; // якщо всі умови false пройдені, то повертаємо true
}

// обробка запуску гри
const startBtn = document.querySelector(".battle__btn");

startBtn.addEventListener("click", startGame);

function startGame() {
    // початок гри, якщо гравець розставив усі кораблі
    if (ship1.innerHTML === "x0" && ship2.innerHTML === "x0" && ship3.innerHTML === "x0" && ship4.innerHTML === "x0") {
        alert("Game started!");
        startBtn.disabled = true;
        for (let i = 0; i < playerBattlegroundCells.length; i++) {
            // прибираємо візуальні ефекти для розміщення на своєму полі
            playerBattlegroundCells[i].removeEventListener("mouseover", cellHover);
            playerBattlegroundCells[i].removeEventListener("mouseout", cellUnhover);  
            playerBattlegroundCells[i].disabled = true;
        }
        playerBattleground.style.cursor = "auto";

        enemyBattleground.style.cursor = "pointer";
        fillEnemyBattleground();

        // додаємо візуальні ефекти для ударів по ворожому полю
        for (let i = 0; i < enemyBattlegroundCells.length; i++) {
            // відведення від клітинки
            enemyBattlegroundCells[i].addEventListener("click", playerShot);
            // наведення на клітинку
            enemyBattlegroundCells[i].addEventListener("mouseover", cellHover);
            // відведення від клітинки
            enemyBattlegroundCells[i].addEventListener("mouseout", cellUnhover);
        }


    } else {
        alert("Place all ships!");
    }
}

function checkWinner(side) {
    if (side === enemy && side.sunkCount === 10) {
        alert("You won");
        document.body.classList.add("overlay");
        return true;
    }
    if (side === player && side.sunkCount === 10) {
        alert("Enemy won");
        document.body.classList.add("overlay");
        return true;
    }
    
    return false;
}

// функція вистрілу гравцем
function playerShot() {
    this.disabled = true;
    this.removeEventListener("click", playerShot);
    this.removeEventListener("mouseover", cellHover);
    this.removeEventListener("mouseout", cellUnhover);

    const cellAddress = this.dataset.cell;
    let [x, y] = transformCell(cellAddress);
    if (enemy.battleground[x][y].status === "ship") {
        enemy.battleground[x][y].status = "damaged";
        this.classList.add("_damaged");
        this.style.backgroundColor = SHIP_COLOR;

        // аналіз після кожного попадання

        // спочатку перевіряємо, чи є корабель в стеку пошкоджених кораблів
        let flag = false;
        for (let i = 0; i < enemy.stackEnemyShips.length; i++) {
            if (flag) break;
            for (let j = 0; j < enemy.stackEnemyShips[i].length; j++) {
                if (enemy.stackEnemyShips[i][j][0] === x && enemy.stackEnemyShips[i][j][1] === y) {
                    let lastSpliceCoordinates = enemy.stackEnemyShips[i].splice(j, 1);
                    flag = true;
                    // якщо після влучення, довжина стала рівна нулю, то корабель потонув
                    if (enemy.stackEnemyShips[i].length === 0) {
                        processSunk(lastSpliceCoordinates, enemy);
                        if (checkWinner(enemy)) {
                            for (let i = 0; i < enemyBattlegroundCells.length; i++) {
                                enemyBattlegroundCells[i].removeEventListener("click", playerShot);
                                enemyBattlegroundCells[i].removeEventListener("mouseover", cellHover);
                                enemyBattlegroundCells[i].removeEventListener("mouseout", cellUnhover);  
                                enemyBattlegroundCells[i].disabled = true;
                            }
                        }
                    }
                    break;
                }
            }
        }

        // у випадку, якщо корабля немає в стеку пошкоджених, то шукаємо даний корабель в даних про об'єкт ворога
        let flag2 = false;
        if (flag === false) {
            for (let i = 0; i < enemy.ships.length; i++) {
                if (flag2) break;
                for (let j = 0; j < enemy.ships[i].length; j++) {
                    if (enemy.ships[i][j][0] === x && enemy.ships[i][j][1] === y) {
                        enemy.stackEnemyShips.push(enemy.ships[i].slice());
                        flag2 = true;
                        break;
                    }
                }
            }

            // після того, як знайшли і записали корабель в стек, віднімемо координати, по яким влучили
            let buff = enemy.stackEnemyShips.length - 1;
            for (let j = 0; j < enemy.stackEnemyShips[buff].length; j++) {
                if (enemy.stackEnemyShips[enemy.stackEnemyShips.length - 1][j][0] === x && enemy.stackEnemyShips[buff][j][1] === y) {
                    let lastSpliceCoordinates = enemy.stackEnemyShips[buff].splice(j, 1);
                    if (enemy.stackEnemyShips[buff].length === 0) {
                        processSunk(lastSpliceCoordinates, enemy);
                        if (checkWinner(enemy)) {
                            for (let i = 0; i < enemyBattlegroundCells.length; i++) {
                                enemyBattlegroundCells[i].removeEventListener("click", playerShot);
                                enemyBattlegroundCells[i].removeEventListener("mouseover", cellHover);
                                enemyBattlegroundCells[i].removeEventListener("mouseout", cellUnhover);  
                                enemyBattlegroundCells[i].disabled = true;
                            }
                        }
                    }
                    break;
                }
            }
        }
    } else {
        enemy.battleground[x][y].status = "crossed";
        this.classList.add("_crossed");
        this.style.backgroundColor = "white";
        enemyShot();
    }
}


// технічна функція затримки виконання коду
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let startX;
let startY;
let currentDiffX;
let currentDiffY;
let adjacentCells = [];
let enemyShotStatus = false;

// функція вистрілу бота
async function enemyShot() {
    // вимикаємо взаємодію з ворожим полем, поки бот виконує свої алгоритми
    enemyBattleground.querySelector("table").classList.add("enemy-battleground_overlay");

    let tmpCell;
    // логіка, якщо поки не влучено в жоден корабель (всі кораблі цілі, або потоплені)
    if (!enemyShotStatus) {
        let [x, y] = getRandomCoordinates();
        while (player.battleground[x][y].status === "damaged" || player.battleground[x][y].status === "crossed") {
            [x, y] = getRandomCoordinates();
        }

        if (player.battleground[x][y].status === "ship") {
            await delay(MS_DELAY);
            [startX, startY] = [x, y];
            player.battleground[x][y].status = "damaged";
            tmpCell = document.querySelector(`[data-cell=${String.fromCharCode("a".codePointAt(0) + y) + String(x + 1)}]`);
            tmpCell.classList.add("_damaged");
            enemyShotStatus = true;
            if (!isPlayerShipSunk(x, y)) {
                if (x - 1 >= 0 && player.battleground[x - 1][y].status != "crossed") {
                    adjacentCells.push([x - 1, y]);
                }
                if (x + 1 < 10 && player.battleground[x + 1][y].status != "crossed") {
                    adjacentCells.push([x + 1, y]);
                }
                if (y - 1 >= 0 && player.battleground[x][y - 1].status != "crossed") {
                    adjacentCells.push([x, y - 1]);
                }
                if (y + 1 < 10 && player.battleground[x][y + 1].status != "crossed") {
                    adjacentCells.push([x, y + 1]);
                }

                let random = Math.floor(Math.random() * adjacentCells.length);
                let [newX, newY] = adjacentCells[random];
                
                if (player.battleground[newX][newY].status === "ship") {
                    // якщо вгадали з сусідньою стороною, то чистимо стек, він нам не потрібен вже
                    adjacentCells = [];
                    let diffX = newX - x;
                    let diffY = newY - y;
                    currentDiffX = diffX;
                    currentDiffY = diffY;
                    // йдемо по циклу в одну сторону, поки зустрічаються клітинки з кораблем або не виходимо за рамки
                    while (newX >= 0 && newX < 10 && newY >= 0 && newY < 10 && player.battleground[newX][newY].status === "ship") {
                        await delay(MS_DELAY);
                        player.battleground[newX][newY].status = "damaged";
                        tmpCell = document.querySelector(`[data-cell=${String.fromCharCode("a".codePointAt(0) + newY) + String(newX + 1)}]`);
                        tmpCell.classList.add("_damaged");
                        if (!isPlayerShipSunk(newX, newY)) {
                            newX += diffX;
                            newY += diffY;
                        } else {
                            // якщо потонув
                            processSunk([[newX, newY]], player);
                            startX = -1, startY = -1;
                            currentDiffX = -1;
                            currentDiffY = -1;
                            adjacentCells = [];
                            enemyShotStatus = false;
                            if (!checkWinner(player)) {
                                enemyShot();
                            }
                        }
                    }
                    if (newX < 0 || newX >= 10 || newY < 0 || newY >= 10 || player.battleground[newX][newY].status === "crossed") {
                        enemyShot();
                    }
                    else if (player.battleground[newX][newY].status === "free") {
                        await delay(MS_DELAY);
                        player.battleground[newX][newY].status = "crossed";
                        tmpCell = document.querySelector(`[data-cell=${String.fromCharCode("a".codePointAt(0) + newY) + String(newX + 1)}]`);
                        tmpCell.classList.add("_crossed");
                        // вмикаємо взаємодію з ворожим полем
                        enemyBattleground.querySelector("table").classList.remove("enemy-battleground_overlay");
                    }      
                } else {
                    await delay(MS_DELAY);
                    // якщо не вгадали з сусідньою стороною, то вирізаємо зі стеку та даємо відповідний статус клітинці
                    adjacentCells.splice(random, 1);
                    player.battleground[newX][newY].status = "crossed";
                    tmpCell = document.querySelector(`[data-cell=${String.fromCharCode("a".codePointAt(0) + newY) + String(newX + 1)}]`);
                    tmpCell.classList.add("_crossed");
                    // вмикаємо взаємодію з ворожим полем
                    enemyBattleground.querySelector("table").classList.remove("enemy-battleground_overlay");
                }
            } else {
                // якщо потонув
                processSunk([[x, y]], player);
                startX = -1, startY = -1;
                currentDiffX = -1;
                currentDiffY = -1;
                adjacentCells = [];
                enemyShotStatus = false;
                if (!checkWinner(player)) {
                    enemyShot();
                }
            }
        } else {
            await delay(MS_DELAY);
            player.battleground[x][y].status = "crossed";
            tmpCell = document.querySelector(`[data-cell=${String.fromCharCode("a".codePointAt(0) + y) + String(x + 1)}]`);
            tmpCell.classList.add("_crossed");
            // вмикаємо взаємодію з ворожим полем
            enemyBattleground.querySelector("table").classList.remove("enemy-battleground_overlay");
        }
    } else { // логіка, якщо потраплено в корабель, але не вдалося потопити за один захід
        // дійшли до краю з однієї сторони, але не потопили корабель
        if (adjacentCells.length === 0) {
            let newX = startX - currentDiffX;
            let newY = startY - currentDiffY;
            // йдемо по циклу в одну сторону, поки зустрічаються клітинки з кораблем
            while (player.battleground[newX][newY].status === "ship") {
                await delay(MS_DELAY);
                player.battleground[newX][newY].status = "damaged";
                tmpCell = document.querySelector(`[data-cell=${String.fromCharCode("a".codePointAt(0) + newY) + String(newX + 1)}]`);
                tmpCell.classList.add("_damaged");
                if (!isPlayerShipSunk(newX, newY)) {
                    newX -= currentDiffX;
                    newY -= currentDiffY;
                } else {
                    // якщо потонув
                    processSunk([[newX, newY]], player);
                    startX = -1, startY = -1;
                    currentDiffX = -1;
                    currentDiffY = -1;
                    adjacentCells = [];
                    enemyShotStatus = false;
                    if (!checkWinner(player)) {
                        enemyShot();
                    }
                }
            }
        }
        // ще досі не вгадали напрям з суміжною стороною
        else {
            let random = Math.floor(Math.random() * adjacentCells.length);
            let [newX, newY] = adjacentCells[random];
            if (player.battleground[newX][newY].status === "ship") {
                // якщо вгадали з сусідньою стороною, то чистимо стек, він нам не потрібен вже
                adjacentCells = [];
                let diffX = newX - startX;
                let diffY = newY - startY;
                currentDiffX = diffX;
                currentDiffY = diffY;
                // йдемо по циклу в одну сторону, поки зустрічаються клітинки з кораблем або не вийдемо за рамки
                while (newX >= 0 && newX < 10 && newY >= 0 && newY < 10 && player.battleground[newX][newY].status === "ship") {
                    await delay(MS_DELAY);
                    player.battleground[newX][newY].status = "damaged";
                    tmpCell = document.querySelector(`[data-cell=${String.fromCharCode("a".codePointAt(0) + newY) + String(newX + 1)}]`);
                    tmpCell.classList.add("_damaged");
                    if (!isPlayerShipSunk(newX, newY)) {
                        newX += diffX;
                        newY += diffY;
                    } else {
                        // якщо потонув
                        processSunk([[newX, newY]], player);
                        startX = -1, startY = -1;
                        currentDiffX = -1;
                        currentDiffY = -1;
                        adjacentCells = [];
                        enemyShotStatus = false;
                        if (!checkWinner(player)) {
                            enemyShot();
                        }
                    }
                }
                if (newX < 0 || newX >= 10 || newY < 0 || newY >= 10 || player.battleground[newX][newY].status === "crossed") {
                    enemyShot();
                }
                else if (player.battleground[newX][newY].status === "free") {
                    await delay(MS_DELAY);
                    player.battleground[newX][newY].status = "crossed";
                    tmpCell = document.querySelector(`[data-cell=${String.fromCharCode("a".codePointAt(0) + newY) + String(newX + 1)}]`);
                    tmpCell.classList.add("_crossed");
                    // вмикаємо взаємодію з ворожим полем
                    enemyBattleground.querySelector("table").classList.remove("enemy-battleground_overlay");
                }
            } else {
                await delay(MS_DELAY);
                // якщо не вгадали з сусідньою стороною, то вирізаємо зі стеку та даємо відповідний статус клітинці
                adjacentCells.splice(random, 1);
                player.battleground[newX][newY].status = "crossed";
                tmpCell = document.querySelector(`[data-cell=${String.fromCharCode("a".codePointAt(0) + newY) + String(newX + 1)}]`);
                tmpCell.classList.add("_crossed");
                // вмикаємо взаємодію з ворожим полем
                enemyBattleground.querySelector("table").classList.remove("enemy-battleground_overlay");
            }
        }
    }
}

// функція перевірки, чи потоплено корабель гравця
function isPlayerShipSunk(x, y) {
    let flag = false;
    let tmpShip;
    
    // шукаємо корабель в списку кораблів
    for (let i = 0; i < player.ships.length; i++) {
        if (flag) break;
        for (let j = 0; j < player.ships[i].length; j++) {
            if (x === player.ships[i][j][0] && y === player.ships[i][j][1]) {   
                tmpShip = player.ships[i];
                break;
            }
        }
    }

    // перевіряємо статус клітинок за координатами знайденого корабля
    for (let i = 0; i < tmpShip.length; i++) {
        // якщо знайдено хоча б одну "живу" клітинку, то повертаємо false
        if (player.battleground[tmpShip[i][0]][tmpShip[i][1]].status === "ship") {
            return false;
        }
    }

    return true;
}

// функція обробки потонулого корабля
function processSunk(lastSunkCoordinates, side) {
    side.sunkCount++;
    let x = lastSunkCoordinates[0][0], y = lastSunkCoordinates[0][1];
    let flag = false;
    let tmpShip;
    let tmpCell;

    let sideIndex;
    if (side === player) {
        sideIndex = 0;
    } else {
        sideIndex = 1;
    }
    
    // отримання всіх координат потонутого корабля
    for (let i = 0; i < side.ships.length; i++) {
        if (flag) break;
        for (let j = 0; j < side.ships[i].length; j++) {
            if (x === side.ships[i][j][0] && y === side.ships[i][j][1]) {   
                tmpShip = side.ships[i].slice();
                break;
            }
        }
    }

    // обхід корабля по лініям з усіх боків (міні-спіраль)
    // верхня лінія
    for (let j = tmpShip[0][1] - 1; j <= tmpShip[tmpShip.length - 1][1] + 1; j++) {
        if (j >= 0 && j < 10 && (tmpShip[0][0] - 1 >= 0) && (tmpShip[0][0] - 1 < 10)) {
            if (side.battleground[tmpShip[0][0] - 1][j].status === "free") {
                side.battleground[tmpShip[0][0] - 1][j].status = "crossed";
                tmpCell = document.querySelectorAll(`[data-cell=${String.fromCharCode("a".codePointAt(0) + j) + String(tmpShip[0][0])}]`)[sideIndex];
                if (tmpCell.classList.length === 0) {
                    tmpCell.classList.add("_crossed");
                    if (side === enemy) {
                        tmpCell.removeEventListener("click", playerShot);
                        tmpCell.removeEventListener("mouseover", cellHover);
                        tmpCell.removeEventListener("mouseout", cellUnhover);
                    }
                }
            }
        }
    }

    // права лінія
    for (let i = tmpShip[tmpShip.length - 1][0] + 1; i >= tmpShip[0][0] - 1; i--) {
        if (i >= 0 && i < 10 && (tmpShip[tmpShip.length - 1][1] + 1 >= 0) && (tmpShip[tmpShip.length - 1][1] + 1 < 10)) {
            if (side.battleground[i][tmpShip[tmpShip.length - 1][1] + 1].status === "free") {
                side.battleground[i][tmpShip[tmpShip.length - 1][1] + 1].status = "crossed";
                tmpCell = document.querySelectorAll(`[data-cell=${String.fromCharCode("a".codePointAt(0) + tmpShip[tmpShip.length - 1][1] + 1) + String(i + 1)}]`)[sideIndex];
                if (tmpCell.classList.length === 0) {
                    tmpCell.classList.add("_crossed");
                    if (side === enemy) {
                        tmpCell.removeEventListener("click", playerShot);
                        tmpCell.removeEventListener("mouseover", cellHover);
                        tmpCell.removeEventListener("mouseout", cellUnhover);
                    }
                }
            }
            
        }
    }

    // нижня лінія
    for (let j = tmpShip[0][1] - 1; j <= tmpShip[tmpShip.length - 1][1] + 1; j++) {
        if (j >= 0 && j < 10 && (tmpShip[tmpShip.length - 1][0] + 1 >= 0) && (tmpShip[tmpShip.length - 1][0] + 1 < 10)) {
            if (side.battleground[tmpShip[tmpShip.length - 1][0] + 1][j].status === "free") {
                side.battleground[tmpShip[tmpShip.length - 1][0] + 1][j].status = "crossed";
                tmpCell = document.querySelectorAll(`[data-cell=${String.fromCharCode("a".codePointAt(0) + j) + String(tmpShip[tmpShip.length - 1][0] + 2)}]`)[sideIndex];
                if (tmpCell.classList.length === 0) {
                    tmpCell.classList.add("_crossed");
                    if (side === enemy) {
                        tmpCell.removeEventListener("click", playerShot);
                        tmpCell.removeEventListener("mouseover", cellHover);
                        tmpCell.removeEventListener("mouseout", cellUnhover);
                    }
                }
            }
        }
    }

    // ліва лінія
    for (let i = tmpShip[tmpShip.length - 1][0] + 1; i >= tmpShip[0][0] - 1; i--) {
        if (i >= 0 && i < 10 && (tmpShip[0][1] - 1 >= 0) && (tmpShip[0][1] - 1 < 10)) {
            if (side.battleground[i][tmpShip[0][1] - 1].status === "free") {
                side.battleground[i][tmpShip[0][1] - 1].status = "crossed";
                tmpCell = document.querySelectorAll(`[data-cell=${String.fromCharCode("a".codePointAt(0) + tmpShip[0][1] - 1) + String(i + 1)}]`)[sideIndex];
                if (tmpCell.classList.length === 0) {
                    tmpCell.classList.add("_crossed");
                    if (side === enemy) {
                        tmpCell.removeEventListener("click", playerShot);
                        tmpCell.removeEventListener("mouseover", cellHover);
                        tmpCell.removeEventListener("mouseout", cellUnhover);
                    }
                }
            }
        }
    }
}

// функція рандомного заповнення поля бою суперника
function fillEnemyBattleground() {
    const shipsArray = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];
    shipsArray.forEach(ship => {
        let coordinates;
        let placing;
        do {
            coordinates = getRandomCoordinates();
            placing = horizontalOrVertical();
        } while (!isPlacingPossibleEnemy(coordinates[0], coordinates[1], placing, ship));
    
        placeEnemyShip(coordinates[0], coordinates[1], placing, ship);
    });
}

// перевірка можливості розміщення корабля на полі противника
function isPlacingPossibleEnemy(x, y, placing, shipSize) {
    // перевірка ситуації, коли корабель не поміщається на полі
    if (placing === "v") {
        if (x + shipSize > 10) {
            return false;
        }
    } else if (placing === "h") {
        if (y + shipSize > 10) {
            return false;
        }
    }

    // перевірка ситуації, коли корабель наїзжає на інші кораблі
    if (placing === "v") {
        for (let i = x; i < x + shipSize; i++) {
            if (enemy.battleground[i][y].status !== "free") {
                return false;
            }
        }
    } else if (placing === "h") {
        for (let i = y; i < y + shipSize; i++) {
            if (enemy.battleground[x][i].status !== "free") {
                return false;
            }
        }
    }

    // перевірка ситуації, коли корабель суміжний з іншими кораблями
    if (placing === "v") {
        if (x - 1 >= 0) {
            if (y - 1 >= 0) {
                if (enemy.battleground[x - 1][y - 1].status === "ship") {
                    return false;
                }
            }
            if (y + 1 < 10) {
                if (enemy.battleground[x - 1][y + 1].status === "ship") {
                    return false;
                }
            }
            if (enemy.battleground[x - 1][y].status === "ship") {
                return false;
            }
        }

        for (let i = x; i < x + shipSize; i++) {
            if (y - 1 >= 0) {
                if (enemy.battleground[i][y - 1].status === "ship") {
                    return false;
                }
            }
            if (y + 1 < 10) {
                if (enemy.battleground[i][y + 1].status === "ship") {
                    return false;
                }
            }
        }

        if (x + shipSize < 10) {
            if (y - 1 >= 0) {
                if (enemy.battleground[x + shipSize][y - 1].status === "ship") {
                    return false;
                }
            }
            if (y + 1 < 10) {
                if (enemy.battleground[x + shipSize][y + 1].status === "ship") {
                    return false;
                }
            }
            if (enemy.battleground[x + shipSize][y].status === "ship") {
                return false;
            }
        }
    }
    else if (placing === "h") {
        if (y - 1 >= 0) {
            if (x - 1 >= 0) {
                if (enemy.battleground[x - 1][y - 1].status === "ship") {
                    return false;
                }
            }
            if (x + 1 < 10) {
                if (enemy.battleground[x + 1][y - 1].status === "ship") {
                    return false;
                }
            }
            if (enemy.battleground[x][y - 1].status === "ship") {
                return false;
            }
        }

        for (let i = y; i < y + shipSize; i++) {
            if (x - 1 >= 0) {
                if (enemy.battleground[x - 1][i].status === "ship") {
                    return false;
                }
            }
            if (x + 1 < 10) {
                if (enemy.battleground[x + 1][i].status === "ship") {
                    return false;
                }
            }
        }

        if (y + shipSize < 10) {
            if (x - 1 >= 0) {
                if (enemy.battleground[x - 1][y + shipSize].status === "ship") {
                    return false;
                }
            }
            if (x + 1 < 10) {
                if (enemy.battleground[x + 1][y + shipSize].status === "ship") {
                    return false;
                }
            }
            if (enemy.battleground[x][y + shipSize].status === "ship") {
                return false;
            }
        }
    }

    return true; // якщо всі умови false пройдені, то повертаємо true
}

// функція розміщення корабля на полі суперника
function placeEnemyShip(x, y, placing, shipSize) {
    const cellAddress = String.fromCodePoint(y + "a".charCodeAt(0)) + String(x + 1);
    let shipBuff = [];
    
    // логіка при вертикальному розміщенні
    if (placing === "v") {
        for (let i = 0; i < shipSize; i++) {
            shipBuff.push([x + i, y]);
            enemy.battleground[x + i][y].status = "ship";
        }
        enemy.ships.push(shipBuff);
    }
    // логіка при горизонтальному розміщенні
    if (placing === "h") {
        for (let i = 0; i < shipSize; i++) {
            shipBuff.push([x, y + i]);
            enemy.battleground[x][y + i].status = "ship";
        }
        enemy.ships.push(shipBuff);
    }
}

// функція отримання випадкових координат (від 0 до 9)
function getRandomCoordinates() {
    let result = [];
    result[0] = Math.floor(Math.random() * 10);
    result[1] = Math.floor(Math.random() * 10);
    return result;
}

// функція випадкового визначення вертикалі чи горизонталі
function horizontalOrVertical() {
    let random = Math.floor(Math.random() * 2);
    return (random === 0) ? "v" : "h";
}

