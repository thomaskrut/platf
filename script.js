const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const ELEMENT_SIZE = 10;

const grid = initGrid();
let raf = window.requestAnimationFrame(updateCanvas);

let drawFromX = 0;
let offsetX = 0;

const keysPressed = {
    ArrowLeft: false,
    ArrowRight: false,
    ' ': false
}

Number.prototype.round = function (places) {
    return +(Math.round(this + "e+" + places) + "e-" + places);
}

function initGrid() {
    const grid = [];
    for (let x = -2; x < 2000; x++) {
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
    grid[4][7] = 'X';
    grid[5][7] = 'X';
    grid[6][7] = 'X';
    grid[7][7] = 'X';
    grid[8][7] = 'X';

    grid[24][11] = 'X';
    grid[25][11] = 'X';
    grid[26][11] = 'X';
    grid[27][11] = 'X';
    grid[28][11] = 'X';
    grid[29][11] = 'X';
    grid[30][11] = 'X';
    grid[31][13] = 'X';
    grid[32][13] = 'X';
    grid[34][13] = 'X';
    grid[35][13] = 'X';
    grid[36][13] = 'X';


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
    readyToJump: true,
    maxSpeed: 3,
    jump: 0,
    maxJump: 15,
    acc(dir) {
        switch (dir) {
            case 'right': if (this.vx < this.maxSpeed) this.vx = (this.vx + 0.2).round(2); break;
            case 'left': if (this.vx > -this.maxSpeed) this.vx = (this.vx - 0.2).round(2); break;
            case 'down': this.vy += 0.25; break;
        }
    },

    dec() {
        if (this.vx > 0) this.vx = (this.vx - 0.4).round(2);
        else if (this.vx < 0) this.vx = (this.vx + 0.4).round(2);
    },

    draw() {
        ctx.fillStyle = "red";
        ctx.fillRect(this.x - ((drawFromX + offsetX) * ELEMENT_SIZE), this.y, ELEMENT_SIZE, ELEMENT_SIZE);
    },

    move() {
        
        this.gridX = Math.round((this.x / ELEMENT_SIZE));
        this.gridY = Math.round((this.y / ELEMENT_SIZE));
        if (this.gridX > WIDTH / ELEMENT_SIZE / 2) {
            drawFromX = this.gridX - (WIDTH / ELEMENT_SIZE / 2);
            offsetX = this.x / ELEMENT_SIZE - Math.round((this.x / ELEMENT_SIZE));
        }
        if (this.gridX < WIDTH / ELEMENT_SIZE / 2) {
            drawFromX = 0;
            offsetX = 0;
        }
        
        
        this.acc('down');
        this.jumping = (keysPressed[' '] && this.jump < this.maxJump && this.readyToJump);
        if (!keysPressed[' ']) this.readyToJump = false;

        if (this.vy >= 0 && grid[this.gridX][this.gridY + 1] != ' ') {
            this.vy = 0;
            this.jump = 0;
            this.readyToJump = true;    
        }

        if (grid[this.gridX][this.gridY] != ' ') {
            this.jump = this.maxJump;
            
        }

        if (this.jumping) {
            this.vy = -2.8;
            this.jump++;
        }

        if (keysPressed.ArrowLeft) this.acc('left')
        else if (keysPressed.ArrowRight) this.acc('right')
        else this.dec();

        this.x += this.vx;

        this.y += this.vy;
        if (this.vy == 0 && this.readyToJump) this.y = this.gridY * ELEMENT_SIZE;
        
    }
}

function updateCanvas() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    for (let x = drawFromX - 1; x < drawFromX + (WIDTH / ELEMENT_SIZE) + 2; x++) {

        for (let y = 0; y < HEIGHT / ELEMENT_SIZE; y++) {
            if (grid[x][y] != ' ') ctx.fillRect((x - drawFromX - offsetX) * ELEMENT_SIZE, y * ELEMENT_SIZE, ELEMENT_SIZE, ELEMENT_SIZE  );
        }
    }
    ctx.fillStyle = 'dimgray';
    // ctx.fillRect(player.gridX * ELEMENT_SIZE, player.gridY * ELEMENT_SIZE, 10, 10);
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
