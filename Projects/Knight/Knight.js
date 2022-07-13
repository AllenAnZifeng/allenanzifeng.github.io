'use strict';

const Size = {
    ROW: 8,
    COL: 8,
};



function run() {
    let button = document.getElementById('generate');
    button.disabled = true;
    let p = new Promise((resolve, reject) => {
        main().then(()=>{resolve()});
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

function Board(container){
    this.ROW = document.getElementById('height').value;
    this.COL = document.getElementById('width').value;
    this.container = container;
    this.cells = [];
    this.visited = [];


    this.initialize = async () =>{



    };


}