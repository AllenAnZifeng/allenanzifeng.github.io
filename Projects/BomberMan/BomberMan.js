'use strict';

// Created by Allen An at 2020/6/29

const PLAYER = {
    'dog': '<i class="fas fa-dog"></i>',
    'cat': '<i class="fas fa-cat"></i>'
};

const directionDict = {
    'up': [-1, 0],
    'down': [1, 0],
    'left': [0, -1],
    'right': [0, 1],
};

const Size = {
    'ROW': 15,
    'COL': 15,
};

const Prop = {
    'Health': '<i class="fas fa-briefcase-medical"></i>',
    'Speed': '<i class="fas fa-bolt"></i>',
    'Bombs': '<i class="fas fa-skull-crossbones"></i>',
    'Range': '<i class="fas fa-flask"></i>',
};


function main() {
    let board = new Board();
    board.initialize();
    window.board = board;

    document.onkeydown = function (event) {
        keyDownListener('KeyA', 65, 'left', board.dog);
        keyDownListener('KeyW', 87, 'up', board.dog);
        keyDownListener('KeyS', 83, 'down', board.dog);
        keyDownListener('KeyD', 68, 'right', board.dog);
        keyDownListener('Space', 32, 'bomb', board.dog);

        keyDownListener('ArrowLeft', 37, 'left', board.cat);
        keyDownListener('ArrowUp', 38, 'up', board.cat);
        keyDownListener('ArrowDown', 40, 'down', board.cat);
        keyDownListener('ArrowRight', 39, 'right', board.cat);
        keyDownListener('Enter', 13, 'bomb', board.cat);
    };

    document.onkeyup = function (event) {

        keyUpListener('KeyA', 65, 'left', board.dog);
        keyUpListener('KeyW', 87, 'up', board.dog);
        keyUpListener('KeyS', 83, 'down', board.dog);
        keyUpListener('KeyD', 68, 'right', board.dog);
        keyUpListener('Space', 32, 'bomb', board.dog);

        keyUpListener('ArrowLeft', 37, 'left', board.cat);
        keyUpListener('ArrowUp', 38, 'up', board.cat);
        keyUpListener('ArrowDown', 40, 'down', board.cat);
        keyUpListener('ArrowRight', 39, 'right', board.cat);
        keyUpListener('Enter', 13, 'bomb', board.cat);


    };


}

function Board() {
    this.container = document.querySelector('#battleground');
    this.ROW = Size.ROW;
    this.COL = Size.COL;
    this.cells = [];
    this.dog = new Player(this, 4, 4, 'dog');
    this.cat = new Player(this, 10, 10, 'cat');

    this.initialize = () => {
        for (let i = 0; i < this.ROW; i++) {
            let temp = [];
            let row = document.createElement('div');
            row.classList.add('row');
            this.container.appendChild(row);
            for (let j = 0; j < this.COL; j++) {
                let cell = document.createElement('div');
                cell.classList.add('cell');
                cell.bomb = null;
                cell.loot = null;
                row.appendChild(cell);
                temp.push(cell);
            }
            this.cells.push(temp);
        }
        this.dog.initialize();
        this.cat.initialize();

        this.makeTree();
        this.makeLoot();

    };

    this.makeTree = () => {
        for (let i = 0; i < this.ROW; i++) {
            for (let j = 0; j < this.COL; j++) {
                if (i % 2 === 1 && j % 2 === 1) {
                    this.cells[i][j].classList.add('block');
                    this.cells[i][j].innerHTML = '<i style="color: darkgreen" class="fas fa-tree"></i>';
                }
            }
        }
    };

    this.makeLoot = () => {
        for (let i = 0; i < this.ROW; i++) {
            for (let j = 0; j < this.COL; j++) {
                if (!this.cells[i][j].classList.contains('block')
                    && !(i === this.dog.x && j === this.dog.y)
                    && !(i === this.cat.x && j === this.cat.y)
                    && !(i === this.dog.x - 1 || i === this.cat.x + 1)
                    && !(j === this.dog.y - 1 || j === this.cat.y + 1)
                    && Math.random() * 10 > 6.5
                ) {
                    this.cells[i][j].classList.add('block', 'loot');
                    this.cells[i][j].innerHTML = '<i class="fas fa-cubes"></i>';
                    this.cells[i][j].loot = new Loot(i, j);

                }
            }
        }
    };


}

function Loot(x, y) {
    this.x = x;
    this.y = y;

    this.destroyed = () => {

    };
}

function Player(board, x, y, icon) {
    this.x = x;
    this.y = y;
    this.walkInterval = 200;
    this.fuseTime = 1400;
    this.bombRange = 2;
    this.bombs = 2;
    this.control = {
        'up': false,
        'down': false,
        'left': false,
        'right': false,
        'bomb': false,
    };
    this.lives = 2;
    this.div = document.querySelector('#' + icon);

    this.relativeDistance = (x) => {
        return (x + 1) * 2 + 0.2 + 'em'
    };

    this.div.style.left = this.relativeDistance(this.x);
    this.div.style.top = this.relativeDistance(this.y);

    this.initialize = async () => {
        // this.speedBoost();

        while (this.lives !== 0) {
            let p = new Promise((resolve, reject) => {
                let interval = setInterval(() => {
                    for (let dir in this.control) {
                        if (this.control[dir] === true) {
                            if (dir !== 'bomb') {
                                this.move(...directionDict[dir]);
                                clearInterval(interval);
                                resolve();
                                // break;
                            } else {
                                clearInterval(interval);
                                this.placeBomb();
                                reject();
                            }


                        }
                    }
                }, 0);


            });
            await p.then(
                async (r) => {
                    await new Promise(r => {
                        setTimeout(r, this.walkInterval)
                    });

                },
                () => {
                    console.log('bomb');
                }
            )
        }
    };

    this.speedBoost = () => {
        this.walkInterval -= 100;
        this.div.style.transition = 'top linear ' + this.walkInterval + 'ms ,left linear ' + this.walkInterval + 'ms';

    };

    this.placeBomb = () => {

        let tempX = this.x;
        let tempY = this.y;
        if (!board.cells[tempX][tempY].classList.contains('bomb') && this.bombs > 0) {
            this.bombs -= 1;
            board.cells[tempX][tempY].classList.add('block', 'bomb');
            board.cells[tempX][tempY].innerHTML = '<i style="color: darkorange" class="fas fa-bomb"></i>';
            board.cells[tempX][tempY].bomb = new Bomb(tempX, tempY, this);

        }

    };


    this.move = (dx, dy) => {
        let tempX = this.x + dx;
        let tempY = this.y + dy;

        if (tempX >= 0 && tempX <= Size.COL - 1 && tempY >= 0 && tempY <= Size.ROW - 1 &&
            !board.cells[tempX][tempY].classList.contains('block')) {
            this.div.style.left = this.relativeDistance(tempY);
            this.div.style.top = this.relativeDistance(tempX);
            setTimeout(() => {
                this.x = tempX;
                this.y = tempY;
            }, this.walkInterval - 50)
        }
        // console.log(this.x, this.y);
    };

    // this.move = (dx, dy) => {
    //     this.x += dx;
    //     this.y += dy;
    //
    //     if (this.x >= 0 && this.x <= Size.COL - 1 && this.y >= 0 && this.y <= Size.ROW - 1 &&
    //         !board.cells[this.x][this.y].classList.contains('block')) {
    //         this.div.style.left = this.relativeDistance(this.y);
    //         this.div.style.top = this.relativeDistance(this.x);
    //     } else {
    //         this.x -= dx;
    //         this.y -= dy;
    //     }
    //     console.log(this.x, this.y);
    // };

}


function Bomb(x, y, player) {
    this.x = x;
    this.y = y;
    this.bombRange = player.bombRange;
    this.fuseTime = player.fuseTime;

    this.interval = setTimeout(() => {
        this.explode()
    }, this.fuseTime);

    this.explode = () => {
        clearTimeout(this.interval);
        player.bombs += 1;
        board.cells[this.x][this.y].bomb = null;
        board.cells[this.x][this.y].classList.remove('block', 'bomb');
        board.cells[this.x][this.y].innerHTML = '';

        let directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        for (let dir of directions) {
            let tempX = this.x;
            let tempY = this.y;

            board.cells[this.x][this.y].style.backgroundColor = 'lightcoral';
            setTimeout(() => {
                board.cells[this.x][this.y].style.backgroundColor = 'white';
            }, 200);

            for (let i = 0; i < this.bombRange; i++) {
                tempX += dir[0];
                tempY += dir[1];
                if (tempX >= Size.ROW || tempX < 0 || tempY >= Size.COL || tempY < 0) {
                    break
                } else {
                    if (board.cells[tempX][tempY].classList.contains('bomb')) {
                        board.cells[tempX][tempY].bomb.explode();
                        break;
                    }

                    if (board.cells[tempX][tempY].classList.contains('block')) {
                        break;
                    }

                    let blockX = tempX;
                    let blockY = tempY;
                    board.cells[blockX][blockY].style.backgroundColor = 'lightcoral';
                    setTimeout(() => {
                        board.cells[blockX][blockY].style.backgroundColor = 'white';
                    }, 200)
                }
            }
        }
    };

}

function keyDownListener(eventCode, eventWhich, direction, player) {
    // if (direction==='bomb'){
    //
    // }
    if (event.code === eventCode || event.which === eventWhich) { // browser compatibility
        player.control[direction] = true;
    }

    if (event.code === 'ArrowUp' || event.which === 38 || event.code === 'ArrowDown' || event.which === 40) {
        event.preventDefault();
    }
}

function keyUpListener(eventCode, eventWhich, direction, player) {

    if (event.code === eventCode || event.which === eventWhich) { // browser compatibility
        player.control[direction] = false;
        // console.log('keyup');
    }

    if (event.code === 'ArrowUp' || event.which === 38 || event.code === 'ArrowDown' || event.which === 40) {
        event.preventDefault();
    }
}

window.addEventListener('DOMContentLoaded', (event) => {
    main();
});