'use strict';
// Created by Allen An at 2020/5/15

const Cell = {
    White: '<i class="far fa-circle"></i>',
    Black: '<i class="fas fa-circle"></i>',
    Empty: '',
};

const Size = {
    ROW: 8,
    COL: 8,
};


function main() {


    // initialize board
    let board = new Board();
    board.initializeBoard();


}


function Board() {
    this.value = [];
    this.cellArray = [];
    this.color = Cell.Black; // default black move first
    this.whiteCount = 2;
    this.blackCount =2;

    this.initializeBoard = () => {
        // initialize value array
        for (let i = 0; i < Size.ROW; i++) {
            this.value.push([]);
            for (let j = 0; j < Size.COL; j++) {

                if (((i === 3) && (j === 3)) || ((i === 4) && (j === 4))) {
                    this.value[i].push(Cell.Black);
                } else if (((i === 3) && (j === 4)) || ((i === 4) && (j === 3))) {
                    this.value[i].push(Cell.White);
                } else {
                    this.value[i].push(Cell.Empty);
                }
            }
        }

        // create game div
        let contentBody = document.getElementById('contentBody');
        let game = document.createElement('div');
        game.id = 'game';
        contentBody.appendChild(game);

        // initialize cell array
        for (let i = 0; i < Size.COL; i++) {
            let row = document.createElement('div');
            row.className = 'row';
            game.appendChild(row);
            this.cellArray.push([]);
            for (let j = 0; j < Size.ROW; j++) {
                let cell = document.createElement('div');
                cell.className = 'cell';
                cell.row = i;
                cell.col = j;
                row.appendChild(cell);
                this.cellArray[i].push(cell);
                cell.addEventListener('click', () => {
                    this.clickListener(cell.row, cell.col)
                })
            }
        }

        // info
        let player = document.createElement('div');
        player.innerHTML = this.color + ' Move';
        player.id = 'player';
        game.appendChild(player);

        let blackCount = document.createElement('div');
        blackCount.id = 'blackCount';
        blackCount.innerHTML = Cell.Black + ' count: ' + 2;
        game.appendChild(blackCount);

        let whiteCount = document.createElement('div');
        whiteCount.id = 'whiteCount';
        whiteCount.innerHTML = Cell.White + ' count: ' + 2;
        game.appendChild(whiteCount);

        // display
        this.display(this.value, this.cellArray);
    };

    this.display = (boardArr, divArr) => {
        for (let i = 0; i < Size.ROW; i++) {
            for (let j = 0; j < Size.COL; j++) {
                divArr[i][j].innerHTML = boardArr[i][j];
            }
        }
    };

    this.clickListener = (row, col) => {
        if (this.value[row][col] === Cell.Empty) {
            this.gameUpdate(row, col);
        } else {
            alert('cannot put onto existing piece!')
        }
        this.infoUpdate();
    };

    this.infoUpdate = () => {
        let player = document.getElementById('player');
        player.innerHTML = this.color + ' Move';

        let whiteCount = document.getElementById('whiteCount');
        whiteCount.innerHTML =  Cell.White + ' count: ' + this.whiteCount;

        let blackCount = document.getElementById('blackCount');
        blackCount.innerHTML =  Cell.Black + ' count: ' + this.blackCount;

    };


    this.gameUpdate = (row, col) => { // color: current move player color
        let paths = [];
        let steps = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]];
        for (let step of steps) {
            let r = row;
            let c = col;
            let temp = [];
            for (let i = 1; i <= Size.ROW; i++) {
                r += step[0];
                c += step[1];
                if (r <= Size.ROW - 1 && c <= Size.COL - 1 && r >= 0 && c >= 0) {
                    if (this.value[r][c] === this.color) { // same color
                        break
                    } else if (this.value[r][c] === Cell.Empty) { // empty
                        temp = [];
                        break
                    } else { // opposite color
                        temp.push([r, c]);
                    }
                } else { // opposite color out of bounds
                    temp = [];
                    break
                }
            }

            for (let path of temp) {
                paths.push(path);
            }
        }

        if (paths.length === 0) {
            alert('Did not flip anything!');
            return;
        }

        // updating value array and display
        for (let path of paths) {
            this.flipValue(path[0], path[1])
        }
        this.value[row][col] = this.color;
        this.color = this.flipColor(this.color);

        // update piece count
        let blackCount =0;
        let whiteCount = 0;
        for (let i = 0; i < Size.ROW; i++) {
            for (let j = 0; j <Size.COL ; j++) {
                if (this.value[i][j]===Cell.White){
                    whiteCount+=1;
                }
                else if (this.value[i][j]===Cell.Black){
                    blackCount+=1;
                }
            }
        }
        this.whiteCount = whiteCount;
        this.blackCount = blackCount;


        this.display(this.value, this.cellArray);

    };

    this.flipValue = (row, col) => {
        if (this.value[row][col] === Cell.Black) {
            this.value[row][col] = Cell.White;
        } else if (this.value[row][col] === Cell.White) {
            this.value[row][col] = Cell.Black
        }
    };

    this.flipColor = (color) => {
        if (color === Cell.Black) {
            return Cell.White;
        } else if (color === Cell.White) {
            return Cell.Black
        }
    };


}


function uuid() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}


document.addEventListener('DOMContentLoaded', (event) => {
    main();
});

// b.update(2,4,'black')
// b.update(4,5,'white')