'use strict';
// Created by Allen An at 2020/5/27


const colors = [
    "#E27D60",
    "#85DCBA",
    "#E8A87C",
    "#C38D9E",
    "#41B3A3",
    "#2185C5",
    "#7ECEFD",
    "#FF7F66",
];

function Vector(x,y){
    this.x=parseFloat(x);
    this.y=parseFloat(y);

    this.getX=()=>{
        return this.x;
    };

    this.getY=()=>{
        return this.y;
    };


}



function main() {
    let canvas = document.querySelector('canvas');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', (event) => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        // console.log(window.innerHeight,window.innerWidth);

        init();
    });

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
        // console.log(mouse);
        // console.log('mouse');
    });

    window.addEventListener('touchmove', (event) => { // safari
        mouse.x = event.changedTouches[0].clientX;
        mouse.y = event.changedTouches[0].clientY;
        // console.log(mouse);

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

    function init() {

        // constant density of circles
        const number_of_particles = Math.floor(window.innerWidth*window.innerHeight/4000);
        // console.log(number_of_particles);
        window.circleArr = [];
        for (let i = 0; i < number_of_particles; i++) {
            let radius = randomAngle(10, 15);
            let x = Math.random() * (innerWidth - 2 * radius) + radius;
            let y = Math.random() * (innerHeight - 2 * radius) + radius;
            let circle = new Circle(c, x, y, radius);
            let counter = 0;
            while (true) {
                let flag = true;
                for (let j = 0; j < window.circleArr.length; j++) {
                    if (distance(circle.x, circle.y, window.circleArr[j].x, window.circleArr[j].y) < circle.radius + window.circleArr[j].radius) {
                        x = Math.random() * (innerWidth - 2 * radius) + radius;
                        y = Math.random() * (innerHeight - 2 * radius) + radius;
                        circle = new Circle(c, x, y, radius);
                        flag = false;
                        counter+=1;
                        break;
                    }
                }
                if (flag || counter>10) {  // max try 10 times
                    break;
                }
            }


            window.circleArr.push(circle);
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        c.clearRect(0, 0, window.innerWidth, window.innerHeight);
        for (let circle of window.circleArr) {

            circle.update();
        }
    }


    init();
    animate();


}


function Circle(c, x, y, r) {

    this.x = x;
    this.y = y;
    this.radius = r;
    this.velocity = new Vector((Math.random() - 0.5) * 5,(Math.random() - 0.5) * 5);
    this.mass =r;
    this.opacity =0.1;

    this.color = randomColor();
    this.maxOpacity = 0.45;
    this.minOpacity = this.opacity;
    this.affectedRange = 160;

    this.c = c;
    this.update = () => {

        this.x += this.velocity.x;
        this.y += this.velocity.y;
        if (this.x + +this.velocity.x + this.radius  > window.innerWidth || this.x +this.velocity.x - this.radius < 0) {
            this.velocity.x = -this.velocity.x;

        }
        if (this.y + this.velocity.y + this.radius > window.innerHeight || this.y + this.velocity.y - this.radius < 0) {
            this.velocity.y = -this.velocity.y;

        }

        // mouse move circle interaction
        let d = distance(mouse.x,mouse.y,this.x,this.y);

        if (d<this.affectedRange && this.opacity<this.maxOpacity ){
           this.opacity+=0.02;

        }
        else if (d>=this.affectedRange && this.opacity>this.minOpacity) {
            this.opacity-=0.02;
        }

        for (let circle of window.circleArr){
            let distance = Math.sqrt(Math.pow(this.x-circle.x,2)+Math.pow(this.y-circle.y,2));
            // console.log(this === circle, distance<this.radius+circle.radius);
            // console.log(this);
            // console.log(circle);
            if (circle !== this && distance<=this.radius+circle.radius){ // collision check
                // console.log('collision');
                this.resolveCollision(circle);
            }
        }


        this.draw();
    };

    this.resolveCollision=(circle)=>{

        const xVelocityDiff = this.velocity.getX() - circle.velocity.getX();
        const yVelocityDiff = this.velocity.getY() - circle.velocity.getY();

        const xDist = circle.x - this.x;
        const yDist = circle.y - this.y;

        if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0){ // check if two circles are approaching

            let angle = Math.atan2(this.y-circle.y,this.x-circle.x);

            let rotatedThisVelocity = rotate(this.velocity,angle);
            let rotatedCircleVelocity = rotate(circle.velocity,angle);

            // u1,u2 initial x velocity

            let u1 = rotatedThisVelocity.getX();
            let u2 = rotatedCircleVelocity.getX();

            let v1 = ((this.mass - circle.mass) / (this.mass + circle.mass)) * u1 + ((2 * circle.mass) / (this.mass + circle.mass)) * u2;
            let v2 = ((2 * this.mass) / (this.mass + circle.mass)) * u1 + ((circle.mass - this.mass) / (this.mass + circle.mass)) * u2;

            rotatedThisVelocity.x = v1;
            rotatedCircleVelocity.x = v2;

            this.velocity = rotate(rotatedThisVelocity,-angle);
            circle.velocity = rotate(rotatedCircleVelocity,-angle);

        }

    };


    this.draw = () => {
        this.c.beginPath();
        this.c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        this.c.strokeStyle = this.color;
        this.c.fillStyle = this.color;
        this.c.save();
        c.globalAlpha =this.opacity;
        this.c.fill();
        this.c.restore();
        this.c.stroke();
    };

}


function rotate(vector,angle){
        let rotatedX = vector.getX()*Math.cos(angle)+vector.getY()*Math.sin(angle);
        let rotatedY = -1 * vector.getX()*Math.sin(angle)+vector.getY()*Math.cos(angle);
        return new Vector(rotatedX,rotatedY);
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

function randomAngle(min, max) {
    return Math.random() * (max - min) + min;
}

function randomColor(){
    return colors[Math.floor(Math.random()*colors.length)];
}


let mouse = {
    x: undefined,
    y: undefined,
};

document.addEventListener('DOMContentLoaded', (event) => {

    main();
});