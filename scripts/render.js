const classNames = {
    flag: "flag",
    mine: "mine",
    opened: "opened",
    visible: "visible",
    stopped: "stopped",
    endGameBlock: ".end-game-block",
    newGameBtn: ".new-game-btn",
};
const numberColors = [
    "#0000FC",
    "#00A000",
    "#FF0000",
    "#00007A",
    "#800000",
    "#30D5C8",
    "#ffffff",
    "#000000",
];

const gameContainer = document.querySelector("#main");
const endGameBlock = document.querySelector(classNames.endGameBlock);
const endGameMsg = endGameBlock.querySelector("p");
const flagsCounterElement = document
    .querySelector("#flags-block")
    .querySelector("span");

function renderGameBoard() {
    if (isGameEnd) {
        return;
    }
    gameContainer.innerHTML = "";
    const gameBoardElement = document.createElement("table");

    gameBoard.forEach((row, i) => {
        const rowElement = document.createElement("tr");
        gameBoardElement.append(rowElement);
        row.forEach((cell, j) => {
            const cellElement = document.createElement("td");
            const cellText = document.createElement("span");

            addCellStyles(cell, cellElement, cellText);
            flagsCounterElement.innerText = minesAmount - countFlags();

            cellElement.append(cellText);
            rowElement.append(cellElement);

            cellElement.addEventListener("click", () => handleLeftClick(i, j));
            cellElement.addEventListener("contextmenu", (e) =>
                handleRightClick(e, i, j)
            );
        });
    });
    gameContainer.append(gameBoardElement);
}

function addCellStyles(cell, cellElement, cellText) {
    cellText.style.fontSize = `calc(var(--table-size)/${N}/1.5)`;

    if (cell.isFlagged && !cell.isOpened) {
        cellElement.classList.add(classNames.flag);
    }

    if (cell.isOpened && !cell.isFlagged) {
        cellElement.classList.add(classNames.opened);
        if (!cell.isMinned) {
            cell.number !== 0
                ? (cellText.innerText = cell.number)
                : (cellText.innerText = "");
            cellText.style.color = numberColors[cell.number];
        } else {
            cellElement.classList.add(classNames.mine);
        }
    }
}

function handleEndGame(isWin) {
    revealMines(minesCoord);
    isGameEnd = true;

    endGameBlock.classList.add(classNames.visible);
    gameContainer.classList.add(classNames.stopped);
    flagsCounterElement.classList.add(classNames.stopped);

    endGameMsg.innerText = isWin ? "Вы выиграли!!!" : "Вы проиграли(";

    const newGameButton = endGameBlock.querySelector(classNames.newGameBtn);

    newGameButton.addEventListener("click", () => initGame());
}

function revealMines(minesCoord) {
    minesCoord.forEach((row) => {
        gameBoard[row[0]][row[1]].isOpened = true;
    });
    renderGameBoard();
}

function initGame() {
    isFirstMove = true;
    isGameEnd = false;
    gameBoard = Array.from({ length: N }, () =>
        Array.from({ length: N }, () => ({
            isMinned: false,
            isOpened: false,
            isFlagged: false,
            number: 0,
        }))
    );
    minesCoord = fillGameBoardWithMines();
    fillGameBoardWithNumbers();
    renderGameBoard();

    endGameBlock.classList.remove(classNames.visible);
    gameContainer.classList.remove(classNames.stopped);
    flagsCounterElement.classList.remove(classNames.stopped);
}
