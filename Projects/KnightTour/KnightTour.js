'use strict';

const Size = {
    ROW: 8,
    COL: 8,
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
        console.log(1);




    }
}

