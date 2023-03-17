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

Number.prototype.round = function (places) {
    return +(Math.round(this + "e+" + places) + "e-" + places);
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
    grid[4][7] = 'X';
    grid[5][7] = 'X';
    grid[6][7] = 'X';
    grid[7][7] = 'X';
    grid[8][7] = 'X';


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
        ctx.fillRect(this.x, this.y, ELEMENT_SIZE, ELEMENT_SIZE);
    },

    move() {
        console.log(this.vx);
        this.gridX = Math.round((this.x / ELEMENT_SIZE) );
        this.gridY = Math.round((this.y / ELEMENT_SIZE));
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
            this.vy = 0.4;
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
        if (this.vy == 0) this.y = this.gridY * ELEMENT_SIZE;
        
    }
}

function updateCanvas() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    for (let x = 0; x < WIDTH / ELEMENT_SIZE; x++) {

        for (let y = 0; y < HEIGHT / ELEMENT_SIZE; y++) {
            if (grid[x][y] != ' ') ctx.fillRect(x * ELEMENT_SIZE, y * ELEMENT_SIZE, ELEMENT_SIZE, ELEMENT_SIZE);
        }
    }
    ctx.fillStyle = 'dimgray';
    //ctx.fillRect(player.gridX * ELEMENT_SIZE, player.gridY * ELEMENT_SIZE, 10, 10);
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
