let gridSize = 3;
let grid = new Array(gridSize).fill(new Array(gridSize).fill(0));

const canvas = document.getElementById("mainCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const cellSize = Math.min(canvas.width, canvas.height) / gridSize;

ctx.lineWidth = cellSize/10;
ctx.strokeStyle = 'blue';

for (let i = 0; i <= gridSize; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * cellSize);
    ctx.lineTo(gridSize * cellSize, i * cellSize);
    console.log("Width");
    ctx.stroke();
}
for (let i = 0; i <= gridSize; i++) {
    ctx.beginPath();
    ctx.moveTo(i * cellSize, 0);
    ctx.lineTo(i * cellSize, gridSize*cellSize);
    console.log("height");
    ctx.stroke();
}
for (let i = 0; i < gridSize; i++) {
    console.log(grid[i]);
}
grid[1][1] = 1;
for (let i = 0; i < gridSize; i++) {
    console.log(grid[i]);
}


function animate() {
    updateGrid();
    drawGrid();
    requestAnimationFrame(animate);
}

function updateGrid() {

}
function drawGrid() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            switch (grid[j][i]) {
                case 1: //Sand
                    ctx.rect(j * gridSize, i * gridSize, (j + 1) * gridSize, (i + 1) * gridSize);
                    ctx.stroke();
                    return;
                default:
                    return;
            }
        }
    }
}