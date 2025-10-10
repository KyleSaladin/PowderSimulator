const canvas = document.getElementById("mainCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;

let mouseX = 0;
let mouseY = 0;
let mouseDown = false;
let brushRadius = 5;

let gridSize = 100;
let grid = createGrid();
const cellSize = Math.min(canvas.width, canvas.height) / gridSize;

let blockToPlace = 1;
let blockTypeAmount = 4;

ctx.lineWidth = cellSize / 10;
ctx.strokeStyle = 'blue';

let timeBetweenFrames = 0.001;

canvas.addEventListener("mousemove", (e) => {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
});

canvas.addEventListener("mousedown", (e) => {
    mouseDown = true;
})

canvas.addEventListener("mouseup", (e) => {
    mouseDown = false;
});

window.addEventListener("keydown", (e) => {
    console.log(e.key)
    if (e.key == "Backspace") {
        blockToPlace = 0;
    }
    if (e.key == "s") {
        blockToPlace = 1;
    }
    if (e.key == "b") {
        blockToPlace = 2;
    }
    if (e.key == "w") {
        blockToPlace = 3;
    }

    if (e.key == "1") {
        brushRadius = 1;
    }
    if (e.key == "2") {
        brushRadius = 2;
    }
    if (e.key == "3") {
        brushRadius = 3;
    }
    if (e.key == "4") {
        brushRadius = 4;
    }
    if (e.key == "5") {
        brushRadius = 5;
    }
    if (e.key == "6") {
        brushRadius = 6;
    }
    if (e.key == "7") {
        brushRadius = 7;
    }
    if (e.key == "8") {
        brushRadius = 8;
    }
    if (e.key == "9") {
        brushRadius = 9;
    }
    if (e.key == "0") {
        brushRadius = 10;
    }

    if (e.key == " ") {
        blockToPlace++;
        blockToPlace %= blockTypeAmount;
    }
});

let workersDone = true;
let worker1Done = true;
let worker2Done = true;
let worker3Done = true;
let worker4Done = true;
const worker1 = new Worker('workerThread.js');
const worker2 = new Worker('workerThread.js');
const worker3 = new Worker('workerThread.js');
const worker4 = new Worker('workerThread.js');
let newGrid = createGrid();

animate();

function animate() {
    if (mouseDown) {
        addElementByMouse();
    }

    worker1.onmessage = function (e) {
        newGrid = copyGrid(newGrid, e.data, worker1.startRow, worker1.endRow);
        worker1Done = true;
    }
    worker2.onmessage = function (e) {
        newGrid = copyGrid(newGrid, e.data, worker2.startRow, worker2.endRow);
        worker2Done = true;
    }
    worker3.onmessage = function (e) {
        newGrid = copyGrid(newGrid, e.data, worker3.startRow, worker3.endRow);
        worker3Done = true;
    }
    worker4.onmessage = function (e) {
        newGrid = copyGrid(newGrid, e.data, worker4.startRow, worker4.endRow);
        worker4Done = true;
    }

    if (worker1Done && worker2Done && worker3Done && worker4Done) {
        console.log("done");
        grid = newGrid;
        workersDone = true;
    }


    if (workersDone) {
        timeSincePreviousFrame = 0;
        if (window.Worker) {
            const chunkData1 = {
                startRow: 0,
                endRow: gridSize / 2,
                startColumn: 0,
                endColumn: gridSize/2,
                grid: grid,
                gridSize: gridSize/2
            }
            const chunkData2 = {
                startRow: 0,
                endRow: gridSize / 2,
                startColumn: gridSize / 2,
                endColumn: gridSize,
                grid: grid,
                gridSize: gridSize / 2
            }
            const chunkData3 = {
                startRow: gridSize / 2,
                endRow: gridSize,
                startColumn: 0,
                endColumn: gridSize / 2,
                grid: grid,
                gridSize: gridSize / 2
            }
            const chunkData4 = {
                startRow: gridSize / 2,
                endRow: gridSize,
                startColumn: gridSize / 2,
                endColumn: gridSize,
                grid: grid,
                gridSize: gridSize / 2
            }
            workersDone = false;
            worker1Done = false;
            worker2Done = false;
            worker3Done = false;
            worker4Done = false;

            worker1.postMessage(chunkData1);
            worker2.postMessage(chunkData2);
            worker3.postMessage(chunkData3);
            worker4.postMessage(chunkData4);
        }
    }


    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    drawGridElements();
    requestAnimationFrame(animate);
}

function copyGrid(oldGrid, nextGrid, startRow, endRow) {
    let newGrid = oldGrid;
    for (let x = startRow; x < endRow; x++) {
        for (let y = startRow; y < endRow; y++) {
            newGrid[x][y] = nextGrid[x][y];
        }
    }
    return newGrid;
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

function addElementByMouse() {
    let gridX = Math.floor(mouseX / cellSize);
    let gridY = Math.floor(mouseY / cellSize);

    for (let x = Math.max(0, gridX - brushRadius); x < Math.min(gridX + brushRadius, gridSize); x++) {
        for (let y = Math.max(0, gridY - brushRadius); y < Math.min(gridY + brushRadius, gridSize); y++) {
            let dx = x - gridX;
            let dy = y - gridY;
            if (dx * dx + dy * dy <= brushRadius * brushRadius) {
                if (grid[x][y] == 0 || blockToPlace == 0) {
                    grid[x][y] = blockToPlace;
                }
            }
        }
    }
}



function drawGridElements() {
    for (let x = gridSize - 1; x >= 0; x--) {
        for (let y = gridSize - 1; y >= 0; y--) {
            switch (grid[x][y]) {
                case 1: //Sand
                    ctx.fillStyle = "rgb(200, 200, 165)";
                    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                    ctx.stroke();
                    continue;
                case 2: //SolidBlock
                    ctx.fillStyle = "rgb(77, 83, 86)";
                    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                    ctx.stroke();
                    continue;
                case 3: //Water
                    ctx.fillStyle = "rgb(105, 185, 231)";
                    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
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