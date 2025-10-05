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



let lastTime = Date.now();;
let timeSincePreviousFrame = 0;
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

    if (mouseDown) {
        addElementByMouse();
    }

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    drawGridElements();
    requestAnimationFrame(animate);
}

function addElementByMouse() {
    let gridX = Math.floor(mouseX / cellSize);
    let gridY = Math.floor(mouseY / cellSize);

    for (let x = Math.max(0, gridX - brushRadius); x < Math.min(gridX + brushRadius, gridSize); x++) {
        for (let y = Math.max(0, gridY - brushRadius); y < Math.min(gridY + brushRadius, gridSize); y++) {
            let dx = x - gridX;
            let dy = y - gridY;
            console.log("Lets Play")
            if (dx * dx + dy * dy <= brushRadius * brushRadius) {
                console.log("place?");
                if (grid[x][y] == 0 || blockToPlace == 0) {
                    console.log("Placed");
                    grid[x][y] = blockToPlace;
                }
            }
        }
    }
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
            toX = gridSize;
            stepX = 1;
            fromY = 0;
            toY = gridSize;
            stepY = 1;
            break;
        case 1:
            fromX = gridSize - 1;
            toX = -1;
            stepX = -1;
            fromY = 0;
            toY = gridSize;
            stepY = 1;
            break;
        case 2:
            fromX = 0;
            toX = gridSize;
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

    let nextGrid = createGrid();

    for (let x = fromX; x != toX; x += stepX) {
        for (let y = fromY; y != toY; y += stepY) {
            switch (grid[x][y]) {
                case 1: //Sand
                    sandLogic(x, y, nextGrid);
                    continue;
                case 2:
                    solidLogic(x, y, nextGrid);
                    continue;
                case 3: //Water 
                    waterLogic(x, y, nextGrid);
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

function solidLogic(x, y, nextGrid) {
    nextGrid[x][y] = 2;
}

function waterLogic(x, y, nextGrid) {
    let cellDown = -1;
    let cell2Down = -1;
    let cellDownRight = -1;
    let cellDownLeft = -1;
    let cellLeft = -1;
    let cellRight = -1;
    let cellUpRight = -1;
    let cellUpLeft = -1;

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
    if (x > 0 && y > 0) {
        cellUpLeft = grid[x - 1][y - 1];
    }
    if (x < gridSize - 1 && y > 0) {
        cellUpRight = grid[x + 1][y - 1];
    }

    if (cellDown == 0 || (cellDown != 2 && cell2Down == 0)) {
        randomOrder = Math.round(Math.random() * 3);
        if (randomOrder != 0) {
            nextGrid[x][y + 1] = 3;
            return;
        }
    }

    randomOrder = Math.round(Math.random());
    if (randomOrder == 1) {
        if (cellDownLeft == 0 && cellLeft == 0) {
            if (nextGrid[x - 1][y + 1] == 0) {
                nextGrid[x - 1][y + 1] = 3;
                return;
            }
        }
        if (cellDownRight == 0 && cellRight == 0) {
            if (nextGrid[x + 1][y + 1] == 0) {
                nextGrid[x + 1][y + 1] = 3;
                return;
            }
        }
    } else {
        if (cellDownRight == 0 && cellRight == 0) {
            if (nextGrid[x + 1][y + 1] == 0) {
                nextGrid[x + 1][y + 1] = 3;
                return;
            }
        }
        if (cellDownLeft == 0 && cellLeft == 0) {
            if (nextGrid[x - 1][y + 1] == 0) {
                nextGrid[x - 1][y + 1] = 3;
                return;
            }
        }
    }

    randomOrder = Math.round(Math.random());
    if (randomOrder == 1) {
        if (cellLeft == 0 && (cellUpLeft == 0 || cellUpLeft == 2)) {
            if (nextGrid[x - 1][y] == 0) {
                nextGrid[x - 1][y] = 3;
                return;
            }
        }
        if (cellRight == 0 && (cellUpRight == 0 || cellUpRight == 2)) {
            if (nextGrid[x + 1][y] == 0) {
                nextGrid[x + 1][y] = 3;
                return;
            }
        }
    } else {
        if (cellRight == 0 && (cellUpRight == 0 || cellUpRight == 2)) {
            if (nextGrid[x + 1][y] == 0) {
                nextGrid[x + 1][y] = 3;
                return;
            }
        }
        if (cellLeft == 0 && (cellUpLeft == 0 || cellUpLeft == 2)) {
            if (nextGrid[x - 1][y] == 0) {
                nextGrid[x - 1][y] = 3;
                return;
            }
        }
    }
    nextGrid[x][y] = 3;
    return;
}

function sandLogic(x, y, nextGrid) {
    let cellDown = -1;
    let cell2Down = -1;
    let cellDownRight = -1;
    let cellDownLeft = -1;
    let cellLeft = -1;
    let cellRight = -1;

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
    
    if (cellDown == 0 || (cellDown != 2 && cell2Down == 0)) {
        randomOrder = Math.round(Math.random() * 8);
        if (randomOrder != 0 && nextGrid[x][y + 1] == 0) {
            nextGrid[x][y + 1] = 1;
            return;
        }
    }


    randomOrder = Math.round(Math.random());
    if (randomOrder == 1) {
        if (cellDownLeft == 0 && cellLeft == 0 && nextGrid[x-1][y+1] == 0) {
            nextGrid[x - 1][y + 1] = 1;
            return;
        }
        if (cellDownRight == 0 && cellRight == 0 && nextGrid[x + 1][y + 1] == 0) {
            nextGrid[x + 1][y + 1] = 1;
            return;
        }
        nextGrid[x][y] = 1;
        return;
    } else {
        if (cellDownRight == 0 && cellRight == 0 && nextGrid[x + 1][y + 1] == 0) {
            nextGrid[x + 1][y + 1] = 1;
            return;
        }
        if (cellDownLeft == 0 && cellLeft == 0 && nextGrid[x - 1][y + 1] == 0) {
            nextGrid[x - 1][y + 1] = 1;
            return;
        }
        nextGrid[x][y] = 1;
        return;
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