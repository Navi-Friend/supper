const N = 10;
const MINES_PERCENT = 0.25;
const minesAmount = Math.floor(N ** 2 * MINES_PERCENT);

let gameBoard = Array.from({ length: N }, () =>
    Array.from({ length: N }, () => ({
        isMinned: false,
        isOpened: true,
        isFlagged: false,
        isChecked: false,
        number: 0,
    }))
);

let isFirstMove = true;
let isGameEnd = false;

initGame();

function handleLeftClick(i, j) {
    while (
        isFirstMove &&
        (gameBoard[i][j].isMinned || gameBoard[i][j].number !== 0)
    ) {
        minesCoord = regenGameBoard();
    }
    isFirstMove = false;

    if (!gameBoard[i][j].isFlagged) {
        gameBoard[i][j].isOpened = true;
    }

    if (gameBoard[i][j].number === 0 && !gameBoard[i][j].isMinned) {
        openEmptyCells(i, j);
    }

    renderGameBoard();

    if (gameBoard[i][j].isMinned) {
        setTimeout(() => handleEndGame((isWin = false)), 500);
    }

    let closedCellsNumber = countClosedCells();

    if (closedCellsNumber === minesAmount) {
        setTimeout(() => handleEndGame((isWin = true)), 500);
    }
}

function openEmptyCells(i, j) {
    const directions = [
        { row: -1, col: 0 },
        { row: 1, col: 0 },
        { row: 0, col: -1 },
        { row: 0, col: 1 },
        { row: -1, col: -1 },
        { row: -1, col: 1 },
        { row: 1, col: -1 },
        { row: 1, col: 1 },
    ];

    directions.forEach((direction) => {
        const newRow = i + direction.row;
        const newCol = j + direction.col;

        if (newRow >= 0 && newRow < N && newCol >= 0 && newCol < N) {
            gameBoard[newRow][newCol].isOpened = true;
            gameBoard[i][j].isChecked = true;
            if (
                !gameBoard[newRow][newCol].isChecked &&
                gameBoard[newRow][newCol].number === 0
            ) {
                return openEmptyCells(newRow, newCol);
            }
        }
    });
}

function regenGameBoard() {
    gameBoard = Array.from({ length: N }, () =>
        Array.from({ length: N }, () => ({
            isMinned: false,
            isOpened: false,
            isFlagged: false,
            isChecked: false,
            number: 0,
        }))
    );
    minesCoord = fillGameBoardWithMines();
    fillGameBoardWithNumbers();
    return minesCoord;
}

function countClosedCells() {
    let counter = 0;
    gameBoard.forEach((row) => {
        row.forEach((cell) => {
            if (!cell.isOpened) {
                counter++;
            }
        });
    });
    return counter;
}

function countFlags() {
    let flagged = 0;
    gameBoard.forEach((row) => {
        row.forEach((cell) => {
            if (cell.isFlagged) {
                flagged++;
            }
        });
    });
    return flagged;
}

function handleRightClick(event, i, j) {
    event.preventDefault();
    if (!gameBoard[i][j].isOpened) {
        gameBoard[i][j].isFlagged
            ? (gameBoard[i][j].isFlagged = false)
            : (gameBoard[i][j].isFlagged = true);
    }
    renderGameBoard();
}

function fillGameBoardWithMines() {
    let minesCoord = [genRandPairOfNumbers(N)];

    while (minesCoord.length < minesAmount) {
        let pair = genRandPairOfNumbers(N);
        let isDuplicate = false;

        minesCoord.forEach((el) => {
            if (el[0] === pair[0] && el[1] === pair[1]) {
                isDuplicate = true;
            }
        });

        if (!isDuplicate) {
            minesCoord.push(pair);
        }
    }

    // Здесь написан цикл for тк нужно выполнить присваивание не для каждого элемента массива, а фиксированное
    // количество раз. Использование while по сути тоже создаст имитацию for
    for (let i = 0; i < minesAmount; i++) {
        gameBoard[minesCoord[i][0]][minesCoord[i][1]].isMinned = true;
    }

    return minesCoord;
}

function genRandPairOfNumbers(maxValue) {
    return [
        Math.floor(Math.random() * maxValue),
        Math.floor(Math.random() * maxValue),
    ];
}

function fillGameBoardWithNumbers() {
    extendedMatrix = createExtendedMatrix();

    // Здесь я использовал цикл for тк i, j должны начинаться с 1 и заканчиваться длиной массива - 1
    for (let i = 1; i < extendedMatrix.length - 1; i++) {
        for (let j = 1; j < extendedMatrix.length - 1; j++) {
            if (!extendedMatrix[i][j].isMinned) {
                extendedMatrix[i][j].number +=
                    +extendedMatrix[i + 1][j - 1].isMinned +
                    extendedMatrix[i + 1][j + 1].isMinned +
                    extendedMatrix[i - 1][j - 1].isMinned +
                    extendedMatrix[i - 1][j + 1].isMinned +
                    extendedMatrix[i + 1][j].isMinned +
                    extendedMatrix[i - 1][j].isMinned +
                    extendedMatrix[i][j - 1].isMinned +
                    extendedMatrix[i][j + 1].isMinned;
            }
        }
    }
}

function createExtendedMatrix() {
    let tmp = {
        isMinned: false,
    };
    let extendedMatrix = gameBoard.map((row) => row.slice());
    extendedMatrix.splice(
        0,
        0,
        Array.from({ length: N }, () => tmp)
    );
    extendedMatrix.splice(
        N + 1,
        0,
        Array.from({ length: N }, () => tmp)
    );
    extendedMatrix.forEach((row) => {
        row.push(tmp);
        row.unshift(tmp);
    });
    return extendedMatrix;
}
