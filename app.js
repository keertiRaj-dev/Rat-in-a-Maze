let grid = [];
let gridSize = 5;
let paused = false;

document.getElementById('create').addEventListener('click', create);
document.getElementById('start').addEventListener('click', startMaze);
document.getElementById('pause').addEventListener('click', () => paused = true);
document.getElementById('restart').addEventListener('click', restartMaze);

function create() {
    gridSize = parseInt(document.getElementById('size').value, 10);
    grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(0));
    const mazeDiv = document.getElementById('maze');
    mazeDiv.innerHTML = '';
    mazeDiv.style.gridTemplateColumns = `repeat(${gridSize}, 40px)`;
    mazeDiv.style.gridTemplateRows = `repeat(${gridSize}, 40px)`;

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.addEventListener('click', () => toggleWall(i, j));
            mazeDiv.appendChild(cell);
        }
    }

    // Set predefined walls based on the sample image
    const predefinedWalls = [
        [0, 1], [1, 3], [2, 1], [2, 2],
        [3, 1], [3, 2], [3, 4], [4, 1],
        [4, 2]
    ];
    predefinedWalls.forEach(([i, j]) => {
        grid[i][j] = 1;
        const cell = mazeDiv.children[i * gridSize + j];
        cell.classList.add('wall');
    });
}

function toggleWall(i, j) {
    grid[i][j] = grid[i][j] === 0 ? 1 : 0;
    const mazeDiv = document.getElementById('maze');
    const cell = mazeDiv.children[i * gridSize + j];
    cell.classList.toggle('wall');
}

function startMaze() {
    if (paused) {
        paused = false;
        return;
    }
    const start = [0, 0];
    const end = [gridSize - 1, gridSize - 1];
    document.getElementById('maze').children[0].classList.add('rat');
    findPath(start, end);
}

async function findPath(start, end) {
    const stack = [start];
    const visited = new Set();
    const directions = [[1, 0], [0, 1], [-1, 0], [0, -1]];

    const moveRat = async (x, y) => {
        const pos = `${x},${y}`;
        if (visited.has(pos) || grid[x][y] === 1) return false;
        visited.add(pos);
        document.getElementById('maze').children[x * gridSize + y].classList.add('rat');

        const currentCell = document.getElementById('maze').children[x * gridSize + y];
        currentCell.innerHTML = '🐀';

        if (x === end[0] && y === end[1]) {
            document.getElementById('maze').children[x * gridSize + y].classList.add('victory');
            alert('Victory!');
            return true;
        }

        await new Promise(r => setTimeout(r, 2000));

        for (const [dx, dy] of directions) {
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && ny >= 0 && nx < gridSize && ny < gridSize) {
                const moved = await moveRat(nx, ny);
                if (moved) return true;
            }
        }

        // Backtrack
        document.getElementById('maze').children[x * gridSize + y].classList.remove('rat');
        return false;
    };

    await moveRat(start[0], start[1]);
}

function restartMaze() {
    paused = false;
    document.getElementById('maze').innerHTML = '';
    create();
    startMaze();
}
