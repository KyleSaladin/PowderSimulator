const canvas = document.getElementById("mainCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let gridSize = 3;
let grid = [];
const cellSize = Math.min(canvas.width, canvas.height) / gridSize;

ctx.lineWidth = cellSize/10;
ctx.strokeStyle = 'blue';

for (let i = 0; i < gridSize; i++) {
    grid.push([]);
    for (let j = 0; j < gridSize; j++) {
        grid[i].push(0);
    }
}

grid[1][0] = 1;
grid[1][2] = 1;
grid[2][2] = 1;
grid[0][0] = 1;


let lastTime = Date.now();;
let timeSincePreviousFrame = 0;
let timeBetweenFrames = 1;

animate();

function animate() {
    let now = Date.now();
    const dt = (now - lastTime) / 1000;
    lastTime = now; 
    timeSincePreviousFrame += dt;
    if (timeSincePreviousFrame >= timeBetweenFrames) {
        console.log("Update");
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
    for (let x = gridSize - 1; x >= 0; x--) {
        for (let y = gridSize - 1; y >= 0; y--) {
            switch (grid[x][y]) {
                case 1: //Sand
                    console.log(x + ", " + y)
                    sandLogic(x, y);
                    continue;
                default:
                    continue;
            }
        }
    }
}

function sandLogic(x, y) {
    let cellDown = -1;
    let cellDownRight = -1;
    let cellDownLeft = -1;
    let cellLeft = -1;

    if (x < gridSize - 1 && y < gridSize - 1) {
        cellDownRight = grid[x + 1][y + 1]
    }
    if (x > 0) {
        cellLeft = grid[x - 1][y];
    }
    if (y < gridSize - 1) {
        cellDown = grid[x][y + 1];
    }
    if (y < gridSize - 1) {
        cellDown = grid[x][y + 1];
    }

    if (cellDown == 0) {
        grid[x][y + 1] = 1;
        grid[x][y] = 0;
        return;
    }
    if (cellDownLeft == 0 && cellLeft == 0) {
        console.log("DownLeft");
        grid[x - 1][y + 1] = 1;
        grid[x][y] = 0;
        return;
    }
    if (cellDownRight == 0) {
        grid[x + 1][y + 1] = 1;
        grid[x][y] = 0;
        return;
    }
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