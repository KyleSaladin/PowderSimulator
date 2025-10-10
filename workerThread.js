
self.onmessage = function (e) {
    const data = e.data;

    const { startRow, endRow, startColumn, endColumn, grid, gridSize} = data;

    let randomOrder = Math.round(Math.random() * 3);
    let fromX;
    let toX;
    let fromY;
    let toY;
    let stepX;
    let stepY;
    switch (randomOrder) {
        case 0:
            fromX = startRow;
            toX = endRow;
            stepX = 1;
            fromY = startRow;
            toY = endRow;
            stepY = 1;
            break;
        case 1:
            fromX = endRow - 1;
            toX = startRow -1;
            stepX = -1;
            fromY = startColumn;
            toY = endColumn;
            stepY = 1;
            break;
        case 2:
            fromX = startRow;
            toX = endRow;
            stepX = 1;
            fromY = endColumn - 1;
            toY = startColumn -1;
            stepY = -1;
            break;
        case 3:
            fromX = endRow - 1;
            toX = startRow -1;
            stepX = -1;
            fromY = endColumn - 1;
            toY = startColumn -1;
            stepY = -1;
            break;

    }

    let nextGrid = createGrid(grid.length);
    let waterAmount = 0;
    for (let x = fromX; x != toX; x += stepX) {
        for (let y = fromY; y != toY; y += stepY) {
            switch (grid[x][y]) {
                case 1: //Sand
                    sandLogic(x, y, grid, nextGrid, gridSize);
                    continue;
                case 2:
                    solidLogic(x, y, grid, nextGrid);
                    continue;
                case 3: //Water 
                    waterAmount++;
                    if (nextGrid[x][y] == 1) {
                        continue;
                    }
                    waterLogic(x, y, grid, nextGrid, gridSize);
                    continue;
                default:
                    continue;
            }
        }
    }
    self.postMessage(nextGrid);
}

function createGrid(gridSize) {
    let newGrid = [];

    for (let i = 0; i < gridSize; i++) {
        newGrid.push([]);
        for (let j = 0; j < gridSize; j++) {
            newGrid[i].push(0);
        }
    }

    return newGrid;
}

function solidLogic(x, y, grid, nextGrid) {
    nextGrid[x][y] = 2;
}

function waterLogic(x, y, grid, nextGrid, gridSize) {
    let cellDown = -1;
    let cellDownRight = -1;
    let cellDownLeft = -1;
    let cellLeft = -1;
    let cellRight = -1;
    let cellUpRight = -1;
    let cellUpLeft = -1;
    let cellUp = -1;

    if (y > 0) {
        cellUp = grid[x][y - 1];
    }
    if (cellUp == 1) {
        return;
    }

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

    if (cellDown == 0 && nextGrid[x][y + 1] == 0) {
        randomOrder = Math.round(Math.random() * 3);
        if (randomOrder != 0) {
            nextGrid[x][y + 1] = 3;
            return;
        }
    }

    randomOrder = Math.round(Math.random());
    if (randomOrder == 1) {
        if (cellDownLeft == 0 && cellLeft == 0 && nextGrid[x - 1][y + 1] == 0) {
            if (nextGrid[x - 1][y + 1] == 0) {
                nextGrid[x - 1][y + 1] = 3;
                return;
            }
        }
        if (cellDownRight == 0 && cellRight == 0 && nextGrid[x + 1][y + 1] == 0) {
            if (nextGrid[x + 1][y + 1] == 0) {
                nextGrid[x + 1][y + 1] = 3;
                return;
            }
        }
    } else {
        if (cellDownRight == 0 && cellRight == 0 && nextGrid[x + 1][y + 1] == 0) {
            if (nextGrid[x + 1][y + 1] == 0) {
                nextGrid[x + 1][y + 1] = 3;
                return;
            }
        }
        if (cellDownLeft == 0 && cellLeft == 0 && nextGrid[x - 1][y + 1] == 0) {
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

function sandLogic(x, y, grid, nextGrid, gridSize) {
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

    if (cellDown == 0 || cellDown == 3) {
        if (cellDown == 3) {
            nextGrid[x][y] = 3;
            nextGrid[x][y + 1] = 1;
            return;
        }
        randomOrder = Math.round(Math.random() * 8);
        if (randomOrder != 0 && nextGrid[x][y + 1] == 0) {
            nextGrid[x][y + 1] = 1;
            return;
        }
    }


    randomOrder = Math.round(Math.random());
    if (randomOrder == 1) {
        if ((cellDownLeft == 0 || cellDownLeft == 3) && cellLeft == 0 && nextGrid[x - 1][y + 1] == 0) {
            if (cellDownLeft == 3) {
                nextGrid[x][y] = 3;
                nextGrid[x - 1][y + 1] = 1;
            }
            nextGrid[x - 1][y + 1] = 1;
            return;
        }
        if ((cellDownRight == 0 || cellDownRight == 3) && cellRight == 0 && nextGrid[x + 1][y + 1] == 0) {
            if (cellDownRight == 3) {
                nextGrid[x][y] = 3;
                nextGrid[x + 1][y + 1] = 1;
            }
            nextGrid[x + 1][y + 1] = 1;
            return;
        }
        nextGrid[x][y] = 1;
        return;
    } else {
        if ((cellDownRight == 0 || cellDownRight == 3) && cellRight == 0 && nextGrid[x + 1][y + 1] == 0) {
            if (cellDownRight == 3) {
                nextGrid[x][y] = 3;
                nextGrid[x + 1][y + 1] = 1;
            }
            nextGrid[x + 1][y + 1] = 1;
            return;
        }
        if ((cellDownLeft == 0 || cellDownLeft == 3) && cellLeft == 0 && nextGrid[x - 1][y + 1] == 0) {
            if (cellDownLeft == 3) {
                nextGrid[x][y] = 3;
                nextGrid[x - 1][y + 1] = 1;
            }
            nextGrid[x - 1][y + 1] = 1;
            return;
        }
        nextGrid[x][y] = 1;
        return;
    }
}
