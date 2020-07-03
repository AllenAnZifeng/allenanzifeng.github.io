'use strict';

// Created by Allen An at 2020/6/29

const PLAYER = {
    'dog': '<i class="fas fa-dog"></i>',
    'cat': '<i class="fas fa-cat"></i>'
};

const directionDict = {
    'up': [0, -1],
    'down': [0, 1],
    'left': [-1, 0],
    'right': [1, 0],
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

        keyDownListener('ArrowLeft', 37, 'left', board.cat);
        keyDownListener('ArrowUp', 38, 'up', board.cat);
        keyDownListener('ArrowDown', 40, 'down', board.cat);
        keyDownListener('ArrowRight', 39, 'right', board.cat);
    };

    document.onkeyup = function (event) {

        keyUpListener('KeyA', 65, 'left', board.dog);
        keyUpListener('KeyW', 87, 'up', board.dog);
        keyUpListener('KeyS', 83, 'down', board.dog);
        keyUpListener('KeyD', 68, 'right', board.dog);

        keyUpListener('ArrowLeft', 37, 'left', board.cat);
        keyUpListener('ArrowUp', 38, 'up', board.cat);
        keyUpListener('ArrowDown', 40, 'down', board.cat);
        keyUpListener('ArrowRight', 39, 'right', board.cat);


    };


}

function Board() {
    this.container = document.querySelector('#battleground');
    this.ROW = 15;
    this.COL = 15;
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
                row.appendChild(cell);
                temp.push(cell);
            }
            this.cells.push(temp);
        }
        this.dog.initialize();
        this.cat.initialize();


    };


}

function Player(board, x, y, icon) {
    this.x = x;
    this.y = y;
    this.control = {
        'up': false,
        'down': false,
        'left': false,
        'right': false,
    };
    this.lives = 2;
    this.div = document.querySelector('#'+icon);

    this.relativeDistance = (x) =>{
        return x*2+0.2 +'em'
    };

    this.div.style.left = this.relativeDistance(this.x);
    this.div.style.top = this.relativeDistance(this.y);

    this.initialize = async () => {

        while (this.lives !== 0) {
            let p = new Promise((resolve) => {
                let interval = setInterval(() => {
                    for (let dir in this.control) {
                        if (this.control[dir] === true) {
                            this.move(...directionDict[dir]);
                            clearInterval(interval);
                            resolve();
                            break;
                        }
                    }
                }, 10);


            });
            await p.then(
                async (r) => {
                    await new Promise(r => {
                        setTimeout(r, 200)
                    });

                }
            )
        }
    };

    this.move = (x, y) => {

        this.x += x;
        this.y += y;
        this.div.style.left = this.relativeDistance(this.x);
        this.div.style.top = this.relativeDistance(this.y);

    };



}

function keyDownListener(eventCode, eventWhich, direction, player) {
    if (event.code === eventCode || event.which === eventWhich) { // browser compatibility
        player.control[direction] = true;
        // console.log('keydown');
    }
}

function keyUpListener(eventCode, eventWhich, direction, player) {
    if (event.code === eventCode || event.which === eventWhich) { // browser compatibility
        player.control[direction] = false;
        // console.log('keyup');
    }
}

window.addEventListener('DOMContentLoaded', (event) => {
    main();


});