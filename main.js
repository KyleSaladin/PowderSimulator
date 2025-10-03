const canvas = document.getElementById("mainCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gridSize = 11;
let grid = createGrid();
const cellSize = Math.min(canvas.width, canvas.height) / gridSize;

ctx.lineWidth = cellSize/10;
ctx.strokeStyle = 'blue';


grid[4][0] = 1;
/*
grid[5][0] = 1;
grid[6][0] = 1;
grid[4][1] = 1;
grid[5][1] = 1;
grid[6][1] = 1;
grid[5][2] = 1;
grid[4][2] = 1;
grid[6][2] = 1;*/


let lastTime = Date.now();;
let timeSincePreviousFrame = 0;
let timeBetweenFrames = 0.25;

animate();

function animate() {
    let now = Date.now();
    const dt = (now - lastTime) / 1000;
    lastTime = now; 
    timeSincePreviousFrame += dt;
    if (timeSincePreviousFrame >= timeBetweenFrames) {
        timeSincePreviousFrame = 0;
        updateGrid();
    }

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    drawGrid();
    drawGridElements();
    requestAnimationFrame(animate);
}

function updateGrid() {
    let randomOrder = Math.round(Math.random() * 3);
    let fromX;
    let toX;
    let fromY;
    let toY;
    let stepX;
    let stepY;

    switch (randomOrder) {
        case 0:
            fromX = 0;
            toX = gridSize - 1;
            stepX = 1;
            fromY = 0;
            toY = gridSize - 1;
            stepY = 1;
            break;
        case 1:
            fromX = gridSize - 1;
            toX = -1;
            stepX = -1;
            fromY = 0;
            toY = gridSize - 1;
            stepY = 1;
            break;
        case 2:
            fromX = 0;
            toX = gridSize - 1;
            stepX = 1;
            fromY = gridSize - 1;
            toY = -1;
            stepY = -1;
            break;
        case 3:
            fromX = gridSize - 1;
            toX = -1;
            stepX = -1;
            fromY = gridSize - 1;
            toY = -1;
            stepY = -1;
            break;

    }
    fromX = 0;
    toX = gridSize - 1;
    stepX = 1;
    fromY = 0;
    toY = gridSize - 1;
    stepY = 1;

    let nextGrid = createGrid();
    for (let x = fromX; x != toX; x += stepX) {
        for (let y = fromY; y != toY; y += stepY) {
            switch (grid[x][y]) {
                case 1: //Sand
                    sandLogic(x, y, nextGrid);
                    continue;
                default:
                    continue;
            }
        }
    }
    grid = nextGrid;
}

function createGrid() {
    let newGrid = [];

    for (let i = 0; i < gridSize; i++) {
        newGrid.push([]);
        for (let j = 0; j < gridSize; j++) {
            newGrid[i].push(0);
        }
    }

    return newGrid;
}

function sandLogic(x, y, nextGrid) {
    let cellDown = -1;
    let cell2Down = -1;
    let cellDownRight = -1;
    let cellDownLeft = -1;
    let cellLeft = -1;
    let cellRight = -1;
    console.log(nextGrid);

    if (x < gridSize - 1 && y < gridSize - 1) {
        cellDownRight = grid[x + 1][y + 1]
    }
    if (x > 0 && y < gridSize - 1) {
        cellDownLeft = grid[x - 1][y + 1]
    }
    if (x > 0) {
        cellLeft = grid[x - 1][y];
    }
    if (x < gridSize - 1) {
        cellRight = grid[x + 1][y];
    }
    if (y < gridSize - 1) {
        cellDown = grid[x][y + 1];
    }
    if (y < gridSize - 2) {
        cell2Down = grid[x][y + 2];
    }
    console.log(cellDown);

    if (cellDown == -1) {
        console.log("stay");
        nextGrid[x][y] = 1;
        return;
    }

    if (cellDown == 0 || cell2Down == 0) {
        if (grid[x][y - 1] == 1) {
            console.log("Already sand");
        }
        nextGrid[x][y + 1] = 1;
        console.log(nextGrid);
        return;
    }

    randomOrder = Math.round(Math.random());
    if (randomOrder == 1) {
        if (cellDownLeft == 0 && cellLeft == 0) {
            nextGrid[x - 1][y + 1] = 1;
            console.log(nextGrid);
            return;
        }
        if (cellDownRight == 0 && cellRight == 0) {
            nextGrid[x + 1][y + 1] = 1;
            console.log(nextGrid);
            return;
        }
        nextGrid[x][y] = 1;
        return;
    } else {
        if (cellDownRight == 0 && cellRight == 0) {
            nextGrid[x + 1][y + 1] = 1;
            console.log(nextGrid);
            return;
        }
        if (cellDownLeft == 0 && cellLeft == 0) {
            nextGrid[x - 1][y + 1] = 1;
            console.log(nextGrid);
            return;
        }
        nextGrid[x][y] = 1;
        console.log(nextGrid);
        return;
    }
    console.log("End");
}

function drawGridElements() {
    for (let x = gridSize - 1; x >= 0; x--) {
        for (let y = gridSize-1; y >= 0; y--) {
            switch (grid[x][y]) {
                case 1: //Sand
                    ctx.fillStyle = "rgb(200, 200, 165)";
                    ctx.fillRect(x * cellSize + 5, y * cellSize + 5, cellSize - 10, cellSize - 10);
                    ctx.stroke();
                    continue;
                default:
                    continue;
            }
        }
    }
}

function drawGrid() {
    for (let i = 0; i <= gridSize; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(gridSize * cellSize, i * cellSize);
        ctx.stroke();
    }
    for (let i = 0; i <= gridSize; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, gridSize * cellSize);
        ctx.stroke();
    }
}