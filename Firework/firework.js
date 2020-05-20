'use strict';
// Created by Allen An at 2020/5/19

// up, right => positive direction

function Vector(magnitude){  // input is initial speed
    this.magnitude = magnitude;
    this.direction = randomRange(0,2*Math.PI);
    this.cartesianValue = [this.magnitude*Math.cos(this.direction),this.magnitude*Math.sin(this.direction)];

    this.add = (v) => {
        return [this.cartesianValue[0]+v[0],this.cartesianValue[1]+v[1]];
    };

    this.minus = (v) => {
        return [this.cartesianValue[0]-v[0],this.cartesianValue[1]-v[1]];
    };
}

let g = new Vector(0);
g.cartesianValue = [0,-0.2];



function FireBit() {
    let velocity = new Vector(10);
    this.velocity = velocity.cartesianValue;

    let capsule = document.createElement('div');
    let parent = document.getElementById('contentContainer');
    capsule.classList.add('capsule');
    capsule.style.bottom = 50 +'px';
    capsule.style.left = window.innerWidth/2 +'px';
    parent.appendChild(capsule);

    this.bottom = parseFloat(capsule.style.bottom);
    this.left = parseFloat(capsule.style.left);

    this.move = ()=>{

        // this.velocity = this.velocity.add(g);
        this.velocity[1] +=g.cartesianValue[1];
        this.left += this.velocity[0];
        this.bottom += this.velocity[1];
        capsule.style.left =this.left +'px';
        capsule.style.bottom = this.bottom +'px';


    };
}

function randomRange(min,max){
    return Math.random()*(max-min)+min;
}


function main(){
    let capsule = new FireBit();
    let fallID = setInterval(capsule.move,20);
    window.capsule = capsule;
}


document.addEventListener('DOMContentLoaded', (event) => {
    main();
});