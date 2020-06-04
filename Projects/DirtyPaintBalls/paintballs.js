'use strict';
// Created by Allen An at 2020/5/27




function main(){
    let canvas = document.querySelector('canvas');

    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;

    window.addEventListener('resize', (event)=>{
        canvas.width=window.innerWidth;
        canvas.height=window.innerHeight;
        // console.log(window.innerHeight,window.innerWidth);

        init();
    });

    window.addEventListener('mousemove', (event)=>{
        mouse.x =event.x;
        mouse.y=event.y;
        // console.log(mouse);
        // console.log('mouse');
    });

    window.addEventListener('touchmove', (event)=>{ // safari
        mouse.x =event.changedTouches[0].clientX;
        mouse.y=event.changedTouches[0].clientY;
        console.log(mouse);

    });

    window.addEventListener('touchstart', (event) => { // safari
        mouse.x = event.changedTouches[0].clientX;
        mouse.y = event.changedTouches[0].clientY;
        // console.log(mouse);

    });

    window.addEventListener('touchend', (event) => { // safari
        mouse.x = event.changedTouches[0].clientX;
        mouse.y = event.changedTouches[0].clientY;
        // console.log(mouse);

    });




    let c = canvas.getContext('2d');

    //
    // // rectangle
    // c.fillStyle = 'rgba(255,0,0,0.8)';
    // c.fillRect(100,100,50,50);
    // c.fillStyle = 'rgba(0,255,0,0.8)';
    // c.fillRect(300,200,50,50);
    //
    // // line
    // c.beginPath();
    // c.moveTo(20,20);
    // c.lineTo(200,200);
    // c.lineTo(600,100);
    // c.strokeStyle = 'red';
    // c.stroke();
    //
    // // random circle
    // for (let i = 0; i <2 ; i++) {
    //     let x = window.innerWidth;
    //     let y = window.innerHeight;
    //     c.beginPath();
    //     c.arc(Math.random()*x,Math.random()*y,30,0,2*Math.PI,false);
    //     c.strokeStyle= 'blue';
    //     c.stroke();
    // }


    // let x =100;
    // let y =200;
    // let dx = 10;
    // let dy =10;
    // let radius = 30;


    function init() {
        window.circleArr=[];
        for (let i = 0; i < 300; i++) {
            window.circleArr.push(new Circles(c));
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        c.clearRect(0,0,window.innerWidth,window.innerHeight);
        for (let circle of window.circleArr){

            circle.update();
        }
    }


    init();
    animate();


}




function Circles(c){
    this.radius = randomAngle(1,5);
    this.x = Math.random()*(innerWidth-2*this.radius)+this.radius;
    this.y =Math.random()*(innerHeight-2*this.radius)+this.radius;
    this.dx = (Math.random()-0.5)*5;
    this.dy = (Math.random()-0.5)*5;
    this.color = randomColor();
    this.maxRadius = 30;
    this.minRadius = this.radius;
    this.affectedRange = 80;


    this.c = c;
    this.update = ()=>{

        this.x += this.dx;
        this.y += this.dy;
        if (this.x + this.radius > window.innerWidth || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.radius > window.innerHeight || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }

        let distance = Math.sqrt(Math.pow(mouse.x-this.x,2)+Math.pow(mouse.y-this.y,2));

        if (distance<this.affectedRange && this.radius <this.maxRadius){
            this.radius += 1;


        }
        else if (this.radius >this.minRadius) {

            this.radius -= 1;
        }

        this.draw();
    };

    this.draw=()=>{
        this.c.beginPath();
        this.c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        this.c.strokeStyle = this.color;
        this.c.fillStyle = this.color;
        this.c.fill();
        this.c.stroke();
    };

}

function randomAngle(min, max){
    return Math.random()*(max-min)+min;
}

function randomColor(){
    let letter = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i <6 ; i++) {
        color+=letter[Math.floor(Math.random()*letter.length)]
    }
    return color;
}

let mouse= {
    x:undefined,
    y:undefined,
};

document.addEventListener('DOMContentLoaded', (event) => {

    main();
});