'use strict';
// Created by Allen An at 2020/5/19

// up, right => positive direction


function randomRange(min,max){
    return Math.random()*(max-min)+min;
}

class Vector{
    constructor(magnitude,angle_min,angle_max=angle_min) {
        let direction = randomRange(angle_min,angle_max);
        this.x = magnitude*Math.cos(direction);
        this.y = magnitude*Math.sin(direction);

    }

    getX=()=>{
        return this.x;
    };

    getY=()=>{
        return this.y;
    };

    getXY=()=>{
        return [this.x,this.y];
    };

    add=(v)=>{
        let newX = this.getX() + v.getX();
        let newY = this.getY() + v.getY();

        this.x = newX;
        this.y = newY;

    };

}




const g = new Vector(0.05,1.5*Math.PI,1.5*Math.PI);
const timePerFrame = 10; //ms
const bitsNumber =800;



class FireBit {
    constructor(magnitude,angle_min,angle_max,x,y,div) { // carrier: Boolean, x,y: left, bottom
        this.div = div;
        this.velocity = new Vector(magnitude,angle_min,angle_max);
        // console.log(this.velocity);

        this.timeToLive = 1500; // ToDo
        this.displacement = new Vector(Math.sqrt(x*x+y*y),Math.acos(x/Math.sqrt(x*x+y*y)),Math.acos(x/Math.sqrt(x*x+y*y)));
        // console.log(this.displacement);
    }

    update = ()=>{
        // change location via velocity
        // reduce velocity
        // reduce time to live
        // check death
        console.log(this);
        this.displacement.add(this.velocity);
        // console.log(this.velocity.getX(),this.velocity.getY());
        this.div.style.bottom = this.displacement.getY()+'px';
        this.div.style.left = this.displacement.getX()+'px';


        // this.velocity.add(g);
        // this.timeToLive -= timePerFrame; // second
        // if (this.timeToLive<=0){
        //     this.death();
        // }


    };


    death = ()=>{
        console.log('fire dead');

        this.div.style.display = 'none';
        let parent = document.getElementById('contentContainer');

        // for (let i = 0; i <bitsNumber ; i++) {
        //     let div = document.createElement('div');
        //     div.classList.add('colorbit');
        //     parent.appendChild(div);
        //
        //
        //
        //     let colorBit = new ColorBit(randomRange(1,10),this.displacement.getX(),this.displacement.getY(),div);
        //     colorBit.id = setInterval(colorBit.update,timePerFrame);
        //
        //
        // }

    };

}
//
// class ColorBit extends FireBit{
//     constructor(magnitude,x,y,div) {
//         super(magnitude,0,2*Math.PI,x,y,div);
//         this.timeToLive = 100; // toDo
//         console.log(this.displacement.getXY());
//     }
//
//     death = ()=>{
//         console.log('color bit dead');
//         clearInterval(this.id);
//         // this.div.style.display = 'none';
//
//
//     };
//
//
// }




function main(){

    let parent = document.getElementById('contentContainer');
    let launcher = document.getElementById('launcher');
    let div = document.createElement('div');

    parent.appendChild(div);

    let bottom = launcher.clientHeight;
    let left =  (window.innerWidth/2) - (div.clientWidth/2);


    div.style.bottom = bottom+'px';
    div.style.left = left+'px';
    div.classList.add('firebit');
    let firebit = new FireBit(400,0.35*Math.PI,0.65*Math.PI,left,bottom,div);


    setTimeout(()=>{
        firebit.update();},0);




    window.div = div;
    window.firebit = firebit;
}


document.addEventListener('DOMContentLoaded', (event) => {
    main();
});