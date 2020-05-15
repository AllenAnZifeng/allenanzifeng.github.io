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

    let contentBody = document.getElementById('contentBody');
    let game = document.createElement('div');
    game.id = 'game';
    contentBody.appendChild(game);

    // initialize board
    let board = new Board();
    board.initializeBoard();


    for (let i = 0; i < Size.COL; i++) {
        let row = document.createElement('div');
        row.className = 'row';
        game.appendChild(row);
        board.cellArray.push([]);
        for (let j = 0; j < Size.ROW; j++) {
            let cell = document.createElement('div');
            cell.className = 'cell';
            cell.row = i;
            cell.col = j;
            row.appendChild(cell);
            board.cellArray[i].push(cell);
            cell.addEventListener('click', function(){ board.update(cell.row, cell.col, board.color)})
        }
    }


    console.log(board.value);
    console.log(board.cellArray);

    board.display(board.value, board.cellArray);


}


function Board() {
    this.value = [];
    this.cellArray = [];
    this.color = Cell.Black; // default black move first

    this.initializeBoard = () => {
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
    };
    this.display = (boardArr, divArr) => {
        for (let i = 0; i < Size.ROW; i++) {
            for (let j = 0; j < Size.COL; j++) {
                divArr[i][j].innerHTML = boardArr[i][j];
            }
        }
    };


    this.update = (row, col) => { // color: current move player color
        console.log(row,col);
        this.value[row][col] = this.color;

        let paths = [];
        let steps = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]];
        for (let step of steps) {
            let r = row;
            let c = col;
            let temp = [];
            for (let i = 1; i <= Size.ROW; i++) {
                r += step[0];
                c += step[1];
                if (r <= Size.ROW - 1 && c <=Size.COL - 1 &&  r >= 0 &&  c >= 0){
                    if ( this.value[r][c] === this.color) { // same color
                        break
                    } else if (this.value[r][c] === Cell.Empty) { // empty
                        temp = [];
                        break
                    } else { // opposite color
                        if (r === Size.ROW - 1 || c === Size.COL - 1 || r === 0 || c === 0) {
                            temp = [];
                            break
                        } else {
                            temp.push([r, c]);
                        }
                    }
                }
                else{
                    break
                }



            }

            for (let path of temp) {
                paths.push(path);
            }
        }

        for (let path of paths) {
            this.flipValue(path[0], path[1])
        }


        this.color = this.flipColor(this.color);
        this.display(this.value,this.cellArray);

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