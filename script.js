const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const ELEMENT_SIZE = 10;

const grid = initGrid();
let raf = window.requestAnimationFrame(updateCanvas);


const keysPressed = {
    ArrowLeft: false,
    ArrowRight: false,
    ' ': false
}

function initGrid() {
    const grid = [];
    for (let x = 0; x < WIDTH / ELEMENT_SIZE; x++) {
        grid[x] = [];
        for (let y = 0; y < HEIGHT / ELEMENT_SIZE; y++) {
            grid[x][y] = ' ';
        }
    }

    grid[14][11] = 'X';
    grid[15][11] = 'X';
    grid[16][11] = 'X';
    grid[17][11] = 'X';
    grid[18][11] = 'X';
    grid[19][11] = 'X';

    return grid;
}

const player = {
    x: 160,
    y: 10,
    gridX: 0,
    gridY: 0,
    vx: 0,
    vy: 0,
    jumping: false,
    maxSpeed: 3,
    jump: 0,
    maxJump: 2,
    acc(dir) {
        switch (dir) {
            case 'right': if (this.vx < this.maxSpeed) this.vx += 0.1; break;
            case 'left': if (this.vx > -this.maxSpeed) this.vx -= 0.1; break;
            case 'down': this.vy += 0.1; break;
        }
    },

    dec(dir) {
        if (this.vx > 0) this.vx -= 0.1
        if (this.vx < 0) this.vx += 0.1
    },

    draw() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x, this.y, ELEMENT_SIZE, ELEMENT_SIZE);
    },

    move() {
        console.log(this.vx);
        this.gridX = Math.round((this.x + 3) / ELEMENT_SIZE);
        this.gridY = Math.round((this.y + 3) / ELEMENT_SIZE);
        this.acc('down');
        this.jumping = keysPressed[' '];
        if (grid[this.gridX][this.gridY + 1] != ' ') this.vy = 0;
        if (this.jumping) {
            this.vy = -1.5;
            this.jump++;
        }

        if (keysPressed.ArrowLeft) this.acc('left')
        else if (keysPressed.ArrowRight) this.acc('right')
        else this.dec();

        this.x += this.vx;
        this.y += this.vy;
    }
}

function updateCanvas() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    for (let x = 0; x < WIDTH / ELEMENT_SIZE; x++) {

        for (let y = 0; y < HEIGHT / ELEMENT_SIZE; y++) {
            ctx.fillText(grid[x][y], x * ELEMENT_SIZE, y * ELEMENT_SIZE);
        }
    }
    player.move();
    player.draw();
    raf = window.requestAnimationFrame(updateCanvas);
}

window.addEventListener('keydown', (e) => {
    if (!e.repeat) {

        switch (e.key) {
            case ' ':
            case 'ArrowLeft':
            case 'ArrowRight': {
                keysPressed[e.key] = true;
                e.preventDefault();
                console.log(keysPressed);
                break;
            }



        }
    }

});

window.addEventListener('keyup', (e) => {

    switch (e.key) {
        case ' ':
        case 'ArrowLeft':
        case 'ArrowRight': {
            keysPressed[e.key] = false;
            e.preventDefault();
            console.log(keysPressed);
            break;
        }

    }

});
