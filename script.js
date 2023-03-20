const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const ELEMENT_SIZE = 10;
const GRID_LENGTH = 100;
const GRID_HEIGHT = 50;

const grid = initGrid(GRID_LENGTH, GRID_HEIGHT);
const background = initGrid(GRID_LENGTH, GRID_HEIGHT);

for (let i = 0; i < 50; i++) {
    generatePlatform(grid);
}

for (let i = 0; i < 50; i++) {
    generateBuilding(background);
}

let raf = window.requestAnimationFrame(updateCanvas);

let drawFromX = 0;
let pixelOffsetX = 0;
let drawFromY = 0;
let pixelOffsetY = 0;

const keysPressed = {
    ArrowLeft: false,
    ArrowRight: false,
    ' ': false
}

function getRandom(max) {
    return Math.floor(Math.random() * max);
}

Number.prototype.round = function (places) {
    return +(Math.round(this + "e+" + places) + "e-" + places);
}

function generatePlatform(targetArray) {
    const startY = getRandom(GRID_HEIGHT);
    const startX = getRandom(GRID_LENGTH - 20);
    const length = getRandom(19);

    for (let i = startX; i < startX + length; i++) {
        targetArray[i][startY] = 'X';
    }

}

function generateBuilding(targetArray) {
    const startY = GRID_HEIGHT;
    const startX = getRandom(GRID_LENGTH - 11);
    const width = getRandom(6);
    const height = getRandom(10);

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            targetArray[startX + x][startY - y] = 'B';
        }
    }

}

function initGrid(width, height) {
    const grid = [];
    for (let x = -2; x < width + 1; x++) {
        grid[x] = [];
        for (let y = 0; y < height; y++) {
            grid[x][y] = ' ';
        }
    }
    return grid;
}

const player = {
    x: 160,
    y: (GRID_HEIGHT - 5 )* ELEMENT_SIZE,
    gridX: 0,
    gridY: 0,
    vx: 0,
    vy: 0,
    jumping: false,
    readyToJump: true,
    maxSpeed: 2,
    maxFallSpeed: 6,
    jump: 0,
    maxJump: 18,
    acc(dir) {
        switch (dir) {
            case 'right': if (this.vx < this.maxSpeed) this.vx = (this.vx + 0.2).round(2); break;
            case 'left': if (this.vx > -this.maxSpeed) this.vx = (this.vx - 0.2).round(2); break;
            case 'down': if (this.vy < this.maxFallSpeed) this.vy = (this.vy + 0.4).round(2); break;
        }
    },

    dec() {
        if (this.vx > 0) this.vx = (this.vx - 0.4).round(2);
        else if (this.vx < 0) this.vx = (this.vx + 0.4).round(2);
    },

    draw() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x - ((drawFromX + pixelOffsetX) * ELEMENT_SIZE), this.y - ((drawFromY + pixelOffsetY) * ELEMENT_SIZE), ELEMENT_SIZE, ELEMENT_SIZE);
    },

    checkForSolidGround() {
        return this.vy >= 0 && grid[this.gridX][this.gridY + 1] != ' ';
    },

    checkForObstacleOverhead() {
        return grid[this.gridX][this.gridY] != ' ';
    },

    hasLanded() {
        return this.vy == 0 && this.readyToJump;
    },

    setDrawingOffset() {
        if (this.x < WIDTH / 2) {
            drawFromX = 0;
            pixelOffsetX = 0;
        } else if (this.x > GRID_LENGTH * ELEMENT_SIZE - WIDTH / 2) {
            drawFromX = GRID_LENGTH - (WIDTH / ELEMENT_SIZE);
            pixelOffsetX = 0;
        } else {
            drawFromX = this.gridX - (WIDTH / ELEMENT_SIZE / 2);
            pixelOffsetX = this.x / ELEMENT_SIZE - Math.round((this.x / ELEMENT_SIZE));
        }

        if (this.y < HEIGHT / 2) {
            drawFromY = 0;
            pixelOffsetY = 0;
        } else if (this.y > GRID_HEIGHT * ELEMENT_SIZE - HEIGHT / 2) {
            drawFromY = GRID_HEIGHT - (HEIGHT / ELEMENT_SIZE);
            pixelOffsetY = 0;
        } else {
            drawFromY = this.gridY - (HEIGHT / ELEMENT_SIZE / 2);
            pixelOffsetY = this.y / ELEMENT_SIZE - Math.round((this.y / ELEMENT_SIZE));
        }


    },

    move() {

        this.gridX = Math.round((this.x / ELEMENT_SIZE));
        this.gridY = Math.round((this.y / ELEMENT_SIZE));

        this.setDrawingOffset();

        this.acc('down');
        this.jumping = (keysPressed[' '] && this.jump < this.maxJump && this.readyToJump);
        if (!keysPressed[' ']) this.readyToJump = false;

        if (this.checkForSolidGround()) {
            this.vy = 0;
            this.jump = 0;
            this.readyToJump = true;
        }

        if (this.checkForObstacleOverhead()) {
            this.jump = this.maxJump;
            this.jumping = false;
            this.vy = 0.5;
        }

        if (this.jumping) {
            this.vy = -3;
            this.jump++;
        }

        if (keysPressed.ArrowLeft) this.acc('left')
        else if (keysPressed.ArrowRight) this.acc('right')
        else this.dec();

        this.x += this.vx;
        this.y += this.vy;

        if (this.hasLanded()) this.y = this.gridY * ELEMENT_SIZE;

    }
}

function updateCanvas() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    ctx.fillStyle = 'dimgray';

    for (let x = 0; x < drawFromX + (WIDTH / ELEMENT_SIZE) + 1; x++) {

        for (let y = 0; y < GRID_HEIGHT + 1; y++) {
            if (background[x][y] != ' ') ctx.fillRect((x - (drawFromX / 2) - (pixelOffsetX / 2)) * ELEMENT_SIZE, (y - drawFromY - pixelOffsetY) * ELEMENT_SIZE, ELEMENT_SIZE + 1, ELEMENT_SIZE + 1);
        }
    }

    ctx.fillStyle = 'white';

    for (let x = drawFromX - 1; x < drawFromX + (WIDTH / ELEMENT_SIZE) + 1; x++) {

        for (let y = 0; y < GRID_HEIGHT + 1; y++) {
            if (grid[x][y] != ' ') ctx.fillRect((x - drawFromX - pixelOffsetX) * ELEMENT_SIZE, (y - drawFromY - pixelOffsetY) * ELEMENT_SIZE, ELEMENT_SIZE + 1, ELEMENT_SIZE + 1);
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
