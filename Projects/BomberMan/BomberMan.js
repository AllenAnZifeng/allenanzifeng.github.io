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

const PropIcon = {
    'Health': '<i style="color: firebrick;font-size: 1em" class="fas fa-briefcase-medical"></i>',
    'Speed': '<i style="color: darkkhaki;font-size: 1em" class="fas fa-bolt"></i>',
    'Bombs': '<i style="color: black;font-size: 1em" class="fas fa-skull-crossbones"></i>',
    'Range': '<i style="color: mediumpurple;font-size: 1em" class="fas fa-flask"></i>',
    'Empty': '',
};

function keydown(event) {
    keyDownListener('KeyA', 65, 'left', board.dog);
    keyDownListener('KeyW', 87, 'up', board.dog);
    keyDownListener('KeyS', 83, 'down', board.dog);
    keyDownListener('KeyD', 68, 'right', board.dog);
    keyDownBombListener('Space', 32, 'bomb', board.dog);

    keyDownListener('ArrowLeft', 37, 'left', board.cat);
    keyDownListener('ArrowUp', 38, 'up', board.cat);
    keyDownListener('ArrowDown', 40, 'down', board.cat);
    keyDownListener('ArrowRight', 39, 'right', board.cat);
    keyDownBombListener('Enter', 13, 'bomb', board.cat);
}

function keyup(event) {

    keyUpListener('KeyA', 65, 'left', board.dog);
    keyUpListener('KeyW', 87, 'up', board.dog);
    keyUpListener('KeyS', 83, 'down', board.dog);
    keyUpListener('KeyD', 68, 'right', board.dog);
    keyUpBombListener('Space', 32, 'bomb', board.dog);

    keyUpListener('ArrowLeft', 37, 'left', board.cat);
    keyUpListener('ArrowUp', 38, 'up', board.cat);
    keyUpListener('ArrowDown', 40, 'down', board.cat);
    keyUpListener('ArrowRight', 39, 'right', board.cat);
    keyUpBombListener('Enter', 13, 'bomb', board.cat);


}

function main() {
    let board = new Board();
    board.initialize();
    window.board = board;
    initializeDisplay();

    document.addEventListener('keydown', keydown);
    document.addEventListener('keyup', keyup);

}


function initializeDisplay() {
    document.getElementById('dog_health').innerText = window.board.dog.lives;
    document.getElementById('dog_speed').innerText = window.board.dog.speed;
    document.getElementById('dog_bombNumber').innerText = window.board.dog.bombs;
    document.getElementById('dog_bombRange').innerText = window.board.dog.bombRange;

    document.getElementById('cat_health').innerText = window.board.cat.lives;
    document.getElementById('cat_speed').innerText = window.board.cat.speed;
    document.getElementById('cat_bombNumber').innerText = window.board.cat.bombs;
    document.getElementById('cat_bombRange').innerText = window.board.cat.bombRange;
}


function Board() {
    this.container = document.querySelector('#battleground');
    this.ROW = Size.ROW;
    this.COL = Size.COL;
    this.cells = [];
    this.loots = ['Health', 'Speed', 'Bombs', 'Range', 'Empty'];
    // this.loots = ['Health', 'Speed', 'Bombs'];
    // this.loots = ['Speed'];
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
                cell.player = null;
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
                    this.cells[i][j].loot = new Loot(i, j, this);

                }
            }
        }
    };


}

function Loot(x, y, board) {
    this.x = x;
    this.y = y;
    this.prop = board.loots[Math.floor(Math.random() * board.loots.length)];
    // console.log(this.prop);

    this.destroyed = () => {
        board.cells[x][y].classList.remove('block','loot');
        board.cells[x][y].innerHTML = PropIcon[this.prop];

    };

    this.collected = () => {
        if (this.prop === 'Health') {
            board.cells[x][y].player.lives += 1;
            // console.log(board.cells[x][y].player.lives,board.cells[x][y].player.div);
        } else if (this.prop === 'Speed' && board.cells[x][y].player.walkInterval>50) {
            board.cells[x][y].player.speed += 1;
            board.cells[x][y].player.walkInterval -= 20;
             // console.log('top linear ' + board.cells[x][y].player.walkInterval + 'ms ,left linear ' +board.cells[x][y].player.walkInterval + 'ms,,opacity ease-in-out 1000ms');
            board.cells[x][y].player.div.style.transition = 'top linear ' + board.cells[x][y].player.walkInterval + 'ms ,left linear ' +board.cells[x][y].player.walkInterval + 'ms,opacity ease-in-out 1000ms';


        } else if (this.prop === 'Bombs') {
            board.cells[x][y].player.bombs += 1;

        } else if (this.prop === 'Range') {
            board.cells[x][y].player.bombRange += 1;
        }


        board.cells[x][y].classList.remove('loot');
        board.cells[x][y].innerHTML = '';
        board.cells[x][y].loot = null;
        board.cells[x][y].player.updateDisplay();
    };
}

function Player(board, x, y, icon) {
    this.x = x;
    this.y = y;
    this.walkInterval = 200;
    this.speed = 1;
    this.fuseTime = 1400;
    this.bombRange = 2;
    this.bombs = 2;
    this.invincible = false;
    this.icon = icon;
    this.control = {
        'up': false,
        'down': false,
        'left': false,
        'right': false,
    };
    this.bomb = false;
    this.lives = 2;
    this.div = document.querySelector('#' + icon);
    this.div.style.transition = 'top linear ' + this.walkInterval + 'ms ,left linear ' + this.walkInterval + 'ms,opacity ease-in-out 1000ms';


    this.relativeDistance = (x) => {
        return (x + 1) * 2 + 0.2 + 'em'
    };

    this.div.style.left = this.relativeDistance(this.x);
    this.div.style.top = this.relativeDistance(this.y);

    this.initialize = async () => {
        this.bombInterval = setInterval(() => {
            if (this.bomb === true) {
                this.placeBomb();

            }
        }, 20);

        while (this.lives > 0) {
            let p_move = new Promise((resolve) => {
                let interval = setInterval(() => {
                    for (let dir in this.control) {
                        if (this.control[dir] === true) {
                            this.move(...directionDict[dir]);
                            clearInterval(interval);
                            resolve();
                        }
                    }
                }, 0);


            });
            await p_move.then(
                async (r) => {
                    await new Promise(r => {
                        setTimeout(r, this.walkInterval)
                    });
                }
            );

            // let p_bomb = new Promise((resolve => {
            //     let interval = setInterval(()=>{
            //         if (this.bomb===true){
            //
            //         }
            //
            //     },0)
            // }))


        }
    };

    // this.initialize = async () => {
    //     // this.speedBoost();
    //
    //     while (this.lives > 0) {
    //         let p = new Promise((resolve, reject) => {
    //             let interval = setInterval(() => {
    //                 for (let dir in this.control) {
    //                     if (this.control[dir] === true) {
    //                         if (dir !== 'bomb') {
    //                             this.move(...directionDict[dir]);
    //                             clearInterval(interval);
    //                             resolve();
    //                             // break;
    //                         } else {
    //                             clearInterval(interval);
    //                             this.placeBomb();
    //                             reject();
    //                         }
    //
    //
    //                     }
    //                 }
    //             }, 0);
    //
    //
    //         });
    //         await p.then(
    //             async (r) => {
    //                 await new Promise(r => {
    //                     setTimeout(r, this.walkInterval)
    //                 });
    //
    //             },
    //             () => {
    //                 console.log('bomb');
    //             }
    //         )
    //     }
    // };


    this.placeBomb = () => {

        let tempX = this.x;
        let tempY = this.y;
        if (!board.cells[tempX][tempY].classList.contains('bomb') && this.bombs > 0) {
            this.bombs -= 1;
            board.cells[tempX][tempY].classList.add('block', 'bomb');
            board.cells[tempX][tempY].innerHTML = '<i style="color: darkorange;z-index: 100;" class="fas fa-bomb"></i>';
            board.cells[tempX][tempY].bomb = new Bomb(tempX, tempY, this, board);

        }

    };


    this.move = (dx, dy) => {
        let tempX = this.x + dx;
        let tempY = this.y + dy;

        if (tempX >= 0 && tempX <= Size.COL - 1 && tempY >= 0 && tempY <= Size.ROW - 1 &&
            !board.cells[tempX][tempY].classList.contains('block')) {
            this.div.style.left = this.relativeDistance(tempY);
            this.div.style.top = this.relativeDistance(tempX);
            board.cells[this.x][this.y].player = null;
            setTimeout(() => {

                this.x = tempX;
                this.y = tempY;
                board.cells[this.x][this.y].player = this;

                if (board.cells[this.x][this.y].loot !== null) {
                    board.cells[this.x][this.y].loot.collected();

                }

            }, this.walkInterval - 50)
        }
        // console.log(this.x, this.y);
    };

    this.updateDisplay = () => {
        document.getElementById(this.icon + '_health').innerText = this.lives;
        document.getElementById(this.icon + '_speed').innerText = this.speed;
        document.getElementById(this.icon + '_bombNumber').innerText = this.bombs;
        document.getElementById(this.icon + '_bombRange').innerText = this.bombRange;
    };

    this.injured = () => {
        this.lives -= 1;
        this.invincible = true;
        this.updateDisplay();
        // console.log('injured' + icon + this.lives);

        let red = setInterval(() => {
            this.div.style.backgroundColor = 'red';
        }, 100);

        let white = setInterval(() => {
            this.div.style.backgroundColor = 'white';
        }, 200);

        this.div.classList.add('animate__animated', 'animate__tada');

        setTimeout(() => {
            this.invincible = false;
            clearInterval(white);
            clearInterval(red);
            this.div.classList.remove('animate__animated', 'animate__tada');
        }, 1000);


        if (this.lives <= 0) {
            this.death();
        }
    };

    this.death = () => {
        this.div.style.opacity = '0';
        clearInterval(this.bombInterval);
        document.removeEventListener('keydown', keydown);
        document.removeEventListener('keyup', keyup);


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


function Bomb(x, y, player, board) {
    this.x = x;
    this.y = y;
    this.bombRange = player.bombRange;
    this.fuseTime = player.fuseTime;

    this.interval = setTimeout(() => {
        this.explode()
    }, this.fuseTime);

    this.explosionTrace = (x, y) => {
        board.cells[x][y].style.backgroundColor = 'lightcoral';
        setTimeout(() => {
            board.cells[x][y].style.backgroundColor = 'white';
        }, 200);
        this.checkPlayerBombed(x, y);
    };

    this.checkPlayerBombed = (x, y) => {
        if (board.cat.x === x && board.cat.y === y && board.cat.invincible === false) {
            board.cat.injured();
        }
        if (board.dog.x === x && board.dog.y === y && board.dog.invincible === false) {
            board.dog.injured();
        }
    };

    this.explode = () => {
        clearTimeout(this.interval);
        player.bombs += 1;
        board.cells[this.x][this.y].bomb = null;
        board.cells[this.x][this.y].classList.remove('block', 'bomb');
        board.cells[this.x][this.y].innerHTML = '';

        let directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];

        this.explosionTrace(this.x, this.y);
        for (let dir of directions) {
            let tempX = this.x;
            let tempY = this.y;

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
                    if (board.cells[tempX][tempY].classList.contains('loot')) {
                        board.cells[tempX][tempY].loot.destroyed();
                        this.explosionTrace(tempX, tempY);
                        break;
                    }

                    if (board.cells[tempX][tempY].classList.contains('block')) {
                        break;
                    }

                    this.explosionTrace(tempX, tempY);
                }
            }
        }
    };

}

function keyDownListener(eventCode, eventWhich, direction, player) {
    if (event.code === eventCode || event.which === eventWhich) { // browser compatibility
        event.preventDefault();
        player.control[direction] = true;
    }

}

function keyUpListener(eventCode, eventWhich, direction, player) {

    if (event.code === eventCode || event.which === eventWhich) { // browser compatibility
        event.preventDefault();
        player.control[direction] = false;
        // console.log('keyup');
    }

}

function keyDownBombListener(eventCode, eventWhich, direction, player) {
    if (event.code === eventCode || event.which === eventWhich) { // browser compatibility
        event.preventDefault();
        player.bomb = true;
    }

}

function keyUpBombListener(eventCode, eventWhich, direction, player) {

    if (event.code === eventCode || event.which === eventWhich) { // browser compatibility
        event.preventDefault();
        player.bomb = false;

    }

}

window.addEventListener('DOMContentLoaded', (event) => {
    main();
});
