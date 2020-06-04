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

    let games = document.getElementsByClassName('game');
    for(let game of games){
        createGame(game);
    }


}


function createGame(game){
    // assign unique ID
    game.id = randomNumber();

    // initialize board
    let board = new Board(game.id);
    board.initializeBoard();

    // expose variable to global scope
    window['game'+game.id] = board;
}


function Board(id) {

    this.value = [];
    this.cellArray = [];
    this.color = Cell.Black; // default black move first
    this.whiteCount = 2;
    this.blackCount =2;
    this.id= id;
    this.log = null;
    this.info=null;
    this.reminder = null;
    this.nextAvailableMove = false;

    this.initializeBoard = () => {
        // initialize value array
        for (let i = 0; i < Size.ROW; i++) {
            this.value.push([]);
            for (let j = 0; j < Size.COL; j++) {
                    this.value[i].push(Cell.Empty);
            }
        }

        this.value[3][3] = Cell.Black;
        this.value[3][4] = Cell.White;
        this.value[4][3] = Cell.White;
        this.value[4][4] = Cell.Black;

        // this.value[1][1] = Cell.Black;
        // this.value[1][2] = Cell.White;
        // this.value[2][1] = Cell.White;
        // this.value[2][2] = Cell.Black;


        // get game div
        let game = document.getElementById(this.id);

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

        // log
        this.log = document.createElement('div');
        this.log.id = 'log' + this.id;
        this.log.className = 'log';
        game.appendChild(this.log);

        this.info = document.createElement('div');
        this.info.id='info'+this.id;
        this.info.innerHTML = this.updateInfo();

        this.reminder = document.createElement('div');
        this.reminder.id='reminder'+this.id;
        this.reminder.innerHTML= '<span>Click on the Hint to Flip </span>';

        this.log.appendChild(this.info);
        this.log.appendChild(this.reminder);

        // new game
        let button = document.createElement('div');
        button.className = 'button';
        button.innerText= 'New Game';

        game.appendChild(button);
        button.addEventListener('click',()=>{this.newGame()});

        // display
        this.updateDisplay();

    };

    this.newGame = ()=>{
        // remove old game
        let parent = document.getElementById('contentBody');
        let oldGame = document.getElementById(this.id);
        parent.removeChild(oldGame);

        // create new game
        let newGame = document.createElement('div');
        newGame.className = 'game';
        parent.appendChild(newGame);
        createGame(newGame);

    };


    this.updateInfo = () => {

        return '<strong>Game Log</strong> <br>' +
            this.color + ' Move<br>' +
            Cell.Black + ' Count: ' + this.blackCount + '<br>' +
            Cell.White + ' Count: ' + this.whiteCount + '<br>' ;

    };


    this.updateDisplay = () => {
        this.nextAvailableMove = false;
        for (let i = 0; i < Size.ROW; i++) {
            for (let j = 0; j < Size.COL; j++) {
                this.cellArray[i][j].innerHTML = this.value[i][j];
                this.cellArray[i][j].style.backgroundColor = null;
                // update hint
                if (this.value[i][j]===Cell.Empty && this.pathToBeFlipped(i,j).length>0){
                    this.cellArray[i][j].style.backgroundColor = '#e9e9e9';
                    this.nextAvailableMove = true;
                }
            }
        }
        this.info.innerHTML = this.updateInfo();
        this.reminder.innerHTML= '<span>Click on the Hint to Flip </span>';

    };

    this.clickListener = (row, col) => {
        if (this.value[row][col] === Cell.Empty) {
            this.gameUpdate(row, col);
        } else {
            this.reminder.innerHTML = '<span style="color: red">Cannot Put onto Existing Piece!</span>';
            // alert('cannot put onto existing piece!');

        }

    };


    this.pathToBeFlipped = (row, col)=>{
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
        return paths;
    };

    this.gameUpdate = (row, col) => { // color: current move player color

        let paths = this.pathToBeFlipped(row,col);

        if (paths.length === 0) {
            this.reminder.innerHTML = '<span style="color: red">Did not flip anything!</span>';
            // alert('Did not flip anything!');
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

        this.updateDisplay();
        this.checkResult();

    };


    this.checkResult = ()=>{
        if (this.whiteCount===0){
            this.reminder.innerHTML = Cell.Black +'<span style="color: red"> Win!</span>';
            this.clickListener=()=>{};
            return;
        }
        else if (this.blackCount===0){
            this.reminder.innerHTML = Cell.White +'<span style="color: red"> Win!</span>';
            this.clickListener=()=>{};
            return;
        }
        else if(this.blackCount+this.whiteCount===Size.COL*Size.ROW){
            if (this.whiteCount>this.blackCount){
                this.reminder.innerHTML = Cell.White +'<span style="color: red"> Win!</span>';
            }
            else if(this.whiteCount<this.blackCount){
                this.reminder.innerHTML = Cell.Black +'<span style="color: red"> Win!</span>';
            }
            else{
                this.reminder.innerHTML = '<span style="color: red"> This is a Tie!</span>';
            }
            this.clickListener=()=>{};
            return;
        }

        if (! this.nextAvailableMove){

            this.color= this.flipColor(this.color);
            this.updateDisplay();
            this.reminder.innerHTML = this.flipColor(this.color)+'<span style="color: red"> cannot Move! Turn Skipped! </span>';

        }






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

function randomNumber(){
    return  Math.floor(Math.random()*10**10);

}


document.addEventListener('DOMContentLoaded', (event) => {
    main();
});

