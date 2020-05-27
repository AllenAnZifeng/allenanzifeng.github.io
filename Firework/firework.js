'use strict';
// Created by Allen An at 2020/5/19

// up, right => positive direction


function randomRange(min,max){
    return Math.random()*(max-min)+min;
}

function randomColor(){
    let letters = '0123456789ABCDEF';
    let color ='#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random()*16)]
    }
    return color;
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
const bitsNumber =100;



class FireBit {
    constructor(magnitude,angle_min,angle_max,x,y,div) { // carrier: Boolean, x,y: left, bottom
        this.div = div;
        this.velocity = new Vector(magnitude,angle_min,angle_max);
        this.parent = document.getElementById('contentContainer');
        this.displacement = new Vector(Math.sqrt(x*x+y*y),Math.acos(x/Math.sqrt(x*x+y*y)),Math.acos(x/Math.sqrt(x*x+y*y)));
        // console.log(this.displacement);
    }

    update = ()=>{
        // change location via velocity
        // reduce velocity
        // reduce time to live
        // check death
        // console.log(this);
        this.displacement.add(this.velocity);
        // console.log(this.velocity.getX(),this.velocity.getY());
        this.div.style.bottom = this.displacement.getY()+'px';
        this.div.style.left = this.displacement.getX()+'px';


       setTimeout(this.death,500); // css value 500ms


    };


    explode=(number, minrange,maxrange)=>{
        for (let i = 0; i <number ; i++) {
            let div = document.createElement('div');
            div.classList.add('colorbit');
            div.style.backgroundColor = this.color;
            this.parent.appendChild(div);
            div.style.bottom = this.displacement.getY()+'px';
            div.style.left = this.displacement.getX()+'px';
            let colorBit = new ColorBit(randomRange(minrange,maxrange),this.displacement.getX(),this.displacement.getY(),div);
            setTimeout(()=>{colorBit.update();},50); // change to 0, bug, no animation

        }

    };

    death = ()=>{
        console.log('fire dead');

        this.div.style.display = 'none';

        this.explode(5,10,20);
        this.explode(25,20,100);
        this.explode(Math.floor(randomRange(25,100)),100,Math.floor(randomRange(150,250)));

        this.parent.removeChild(this.div);
    };

}

class ColorBit extends FireBit{
    constructor(magnitude,x,y,div) {
        super(magnitude,0,2*Math.PI,x,y,div);

    }

    death = ()=>{
        console.log('color bit dead');

        this.div.style.opacity=0;
        setTimeout(()=>{this.parent.removeChild(this.div)},300);



    };


}




function main(){

    let parent = document.getElementById('contentContainer');
    let height = parent.clientHeight;
    let launcher = document.getElementById('launcher');
    let counter = 1;


    for (let k = 0; k < 3; k++) {
        setTimeout(()=>{
            for (let i = 0; i < 3; i++) {
                let div = document.createElement('div');
                div.classList.add('firebit');
                parent.appendChild(div);

                // let bottom = launcher.clientHeight;
                let bottom = 10;
                let left = (window.innerWidth / 2) - (div.clientWidth / 2);


                div.style.bottom = bottom + 'px';
                div.style.left = left + 'px';
                let firebit = new FireBit(height * randomRange(0.4, 0.9), 0.3 * Math.PI, 0.7 * Math.PI, left, bottom, div);
                firebit.color = randomColor();
                setTimeout(() => {
                    firebit.update();
                }, 0);
            }

        },1500*(k));


    }

    }





document.addEventListener('DOMContentLoaded', (event) => {
    main();
});