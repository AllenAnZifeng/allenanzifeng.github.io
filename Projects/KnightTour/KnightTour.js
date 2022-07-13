'use strict';

const Size = {
    ROW: 6,
    COL: 6,
};


function run() {
    let button = document.getElementById('generate');
    button.disabled = true;
    let p = new Promise((resolve, reject) => {
        main().then(() => {
            resolve()
        });
    });
    // console.log('run');
    p.then(r => {
        button.disabled = false
    });

}


async function main() {
    let container = document.querySelector('.boardContainer');
    container.innerHTML = '';
    let board = new Board(container);
    window.board = board;
    await board.initialize();
    await board.move(board.knight,board.path);
    // console.log('finished');

}

function Board(container) {
    this.ROW = document.getElementById('height').value;
    this.COL = document.getElementById('width').value;
    this.container = container;
    this.cells = [];
    this.visited = [];
    this.knight = [Math.floor(Math.random() * this.ROW),Math.floor(Math.random() * this.COL)];
    this.icon = "<i class=\"fa-solid fa-horse\"></i>"
    this.path = [this.knight.slice()]
    this.futurePath = []


    this.initialize = async () => {
        for (let i = 0; i < this.ROW; i++) {
            let row = document.createElement('div');
            row.classList.add('row');
            row.id = i;
            this.container.appendChild(row);
            let CellTemp = [];
            let visitTemp = [];
            for (let j = 0; j < this.COL; j++) {
                let cell = document.createElement('div');
                cell.classList.add('cell');
                cell.row = i;
                cell.col = j;
                row.appendChild(cell);
                CellTemp.push(cell);
                visitTemp.push(false);
            }
            this.cells.push(CellTemp);
            this.visited.push(visitTemp);
        }

        this.visited[this.knight[0]][this.knight[1]]=true;
        this.cells[this.knight[0]][this.knight[1]].innerHTML = this.icon;

        // this.futurePath = await this.move(this.knight,this.path);
        // console.log(this.futurePath)

    }

    this.validMoves = (location,path) => {
        let x = location[0];
        let y = location[1];
        let possibleMoves = [[x-1,y+2],[x-1,y-2],[x-2,y+1],[x-2,y-1],[x+1,y+2],[x+1,y-2],[x+2,y+1],[x+2,y-1]];
        let res = [];
        for (let i = 0; i <possibleMoves.length; i++) {
            if (0<=possibleMoves[i][0] && possibleMoves[i][0] <this.ROW && 0<=possibleMoves[i][1] && possibleMoves[i][1] <this.COL){
                let alreadyInPath = false;
                for (let j = 0; j < path.length; j++) {
                    if (possibleMoves[i][0]===path[j][0] && possibleMoves[i][1]===path[j][1]){
                        alreadyInPath = true;
                        break;
                    }
                }

                if (!alreadyInPath){
                    res.push(possibleMoves[i]);
                }

            }
        }
        return res;
    }

    this.isAllVisited = (path) => {
        return path.length === this.ROW * this.COL;
    }

    this.move = async (knight,path) =>{ // next all moves [[int,int]]

        for (let i = 0; i < this.ROW; i++) {
            for (let j = 0; j < this.COL; j++){
                this.cells[i][j].classList.remove('visited','knight')
            }
        }

        for (let i = 0; i <path.length ; i++) {
            this.cells[path[i][0]][path[i][1]].classList.add('visited');
        }

        this.cells[knight[0]][knight[1]].classList.add('knight');

        await new Promise(r => {
            setTimeout(r, 500)
        });


        if (this.isAllVisited(path)){
            return [knight]
        }

        let moves = this.validMoves(knight,path);
        if (moves.length ===0){
            return null;
        }

        for (let i = 0; i < moves.length; i++) {
            let futureMoves = this.move(moves[i],path.concat([moves[i]]));
            if ( futureMoves !== null){
                let res = path.concat([moves[i]]).concat(futureMoves);
                if (res.length === this.ROW * this.COL){
                    return moves[i].concat(futureMoves);
                }
            }
        }

    }


}

