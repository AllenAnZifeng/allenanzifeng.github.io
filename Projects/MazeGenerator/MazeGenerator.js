'use strict';
// Created by Allen An at 2020/6/21

const Size = {
    ROW: 41,
    COL: 41,
};


function main() {
    let container = document.querySelector('.mazeContainer');
    container.innerHTML = '';
    let maze = new Maze(container);
    window.maze = maze;


    maze.initialize();

}


function Maze(container) {

    this.ROW = Math.floor(document.getElementById('height').value / 2) * 2 + 1;
    this.COL = Math.floor(document.getElementById('width').value / 2) * 2 + 1;
    this.container = container;
    this.cells = [];
    this.visited = [];
    this.solvedPath = null;
    this.stack = [[1, 1]]; // starting position
    this.speed = document.getElementById('speed').value * (-10) + 100;


    this.initialize = () => {
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

        // border
        for (let i = 0; i < this.ROW; i++) {
            for (let j = 0; j < this.COL; j++) {
                if (i === 0 || j === 0 || i === this.ROW - 1 || j === this.COL - 1) {
                    this.cells[i][j].classList.add('wall');
                    this.visited[i][j] = true;
                }
            }
        }
        this.cells[1][0].classList.remove('wall');
        this.cells[1][0].visited = false;
        this.cells[this.ROW - 2][this.COL - 1].classList.remove('wall');
        this.cells[this.ROW - 2][this.COL - 1].visited = false;

        // console.log(this.cells);
        // console.log(this.visited);
        // console.log(this.nextPath(...this.stack[0]));



        this.move().then(
            r=>this.fillBlankWall()
        ).then(
            r=>setTimeout(this.removePathBorder, 100)
        );
    };




    this.move = async () => {

        while (this.stack.length !== 0){
            let previous = this.stack[this.stack.length - 1];
            this.visited[previous[0]][previous[1]] = true;
            this.cells[previous[0]][previous[1]].classList.add('path');

            let current = this.nextPath(...previous);
            this.visited[current[0]][current[1]] = true;
            this.cells[current[0]][current[1]].classList.add('path');

            let mid = [(previous[0] + current[0]) / 2, (previous[1] + current[1]) / 2];
            this.visited[mid[0]][mid[1]] = true;
            this.cells[mid[0]][mid[1]].classList.remove('wall');
            this.cells[mid[0]][mid[1]].classList.add('path');

            this.stack.push(mid);
            this.stack.push(current);
            this.makeWall(...mid);
            this.makeWall(...previous);

            await new Promise(r => {setTimeout(r, this.speed)});

            if (current[0] === this.ROW - 2 && current[1] === this.COL - 2) {
                this.solvedPath = this.stack.slice();
            }

            while (this.stack.length !== 0 && !this.nextPath(...this.stack[this.stack.length - 1])) {

                let coordinate = this.stack.pop(); // trace back
                await new Promise(r => {setTimeout(r, this.speed)});
                this.cells[coordinate[0]][coordinate[1]].classList.add('traceBack');

            }
        }



    };

    this.removePathBorder = () => {
        let paths = document.querySelectorAll('.path');
        for (let div of paths) {
            div.classList.remove('path');
            div.classList.remove('traceBack');
        }

        let cells = document.querySelectorAll('.cell');
        for (let div of cells) {
            div.style.border = 'none';
        }

    };

    this.showPath = () => {
        this.cells[1][0].classList.add('solvedPath');
        this.cells[this.ROW - 2][this.COL - 1].classList.add('solvedPath');
        for (let coordinate of this.solvedPath) {
            this.cells[coordinate[0]][coordinate[1]].classList.add('solvedPath');
        }

    };


    this.fillBlankWall = () => {
        for (let i = 0; i < this.ROW; i++) {
            for (let j = 0; j < this.COL; j++) {
                if (!this.cells[i][j].classList.contains('wall') && !this.cells[i][j].classList.contains('path')
                    && j !== 0 && j !== this.COL - 1) {
                    this.cells[i][j].classList.add('wall');
                    // console.log('fill');
                }
            }
        }
    };


    this.makeWall = (r, c) => {
        let direction = [[1, 0], [-1, 0], [0, 1], [0, -1]];
        for (let dir of direction) {
            let newr = r + dir[0];
            let newc = c + dir[1];
            // console.log(newr,newc);
            if (this.validPath(newr, newc)) {
                this.cells[newr][newc].classList.add('wall');
                this.visited[newr][newc] = true;

            }
        }

    };


    this.randomNumber = (n) => {
        return Math.floor(Math.random() * parseInt(n));

    };

    this.shuffle = (arr) => {
        for (let i = 0; i < arr.length; i++) {
            let n = this.randomNumber(arr.length);
            let m = this.randomNumber(arr.length);

            let temp = arr[n];
            arr[n] = arr[m];
            arr[m] = temp;
        }

    };


    this.nextPath = (r, c, step = 2) => {
        let direction = [[step, 0], [-step, 0], [0, step], [0, -step]];
        let nextPath = [];
        this.shuffle(direction);
        for (let dir of direction) {
            let newr = r + dir[0];
            let newc = c + dir[1];
            // console.log(newr,newc);
            if (this.validPath(newr, newc)) {
                nextPath.push([newr, newc]);
            }
        }
        // console.log(nextPath[0]);
        return nextPath[0];
    };

    this.validPath = (r, c) => {

        return r > 0 && r < this.ROW && c > 0 && c < this.COL &&
            this.visited[r][c] === false && !this.cells[r][c].classList.contains('walls');
    };


}


window.addEventListener('DOMContentLoaded', (event) => {
    // main();

});