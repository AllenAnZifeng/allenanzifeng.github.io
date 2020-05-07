'use strict';
// positive direction is downwards


const g = 0.2;
let score =0;

function Bird(key, height = 100, speed = 0) {
    this.height = height;
    this.speed = speed;

    this.jump = () => {
        this.speed -= 5;
    };

    this.gravityFall = () => {
        this.speed += g;
        this.height += this.speed;
        this.BirdDiv = document.getElementById('bird');
        this.BirdDiv.style.top = this.height + 'px';

        // head orientation
        let imagedIV = document.getElementById('image');
        if (this.speed>0){
            imagedIV.style.transform='rotate(-45deg)';
        }
        else{
            imagedIV.style.transform='rotate(45deg)';
        }

        //check within bounding box
        let birdHeight = this.BirdDiv.clientHeight;
        let windowHeight = document.getElementById('DropBox').clientHeight;
        if (this.height > windowHeight - birdHeight || this.height < 0) {
            this.death();

        }
    };

    this.death = () =>{
        clearInterval(birdGravityFallID);
        clearInterval(movingPillarID);
        clearInterval(generatePillarID);
        this.speed = 0;
        // document.getElementById('bg').style.background="none";
        // document.getElementById('bg').style.backgroundColor='red';
        document.getElementById('bird').style.backgroundColor = 'red';
        document.getElementById('restart').style.display='block';
    };

}


let birdGravityFallID;
let movingPillarID;
let generatePillarID;

function start() {
    document.getElementById('start').onclick=null;
    birdGravityFallID = setInterval(bird.gravityFall, 20);
    generatePillarID = setInterval(generatePillar, randomRange(1500,2500));
    movingPillarID = setInterval(movingPillar, 20);

    document.getElementById('DropBox').addEventListener('click', bird.jump);
    document.onkeypress = function (event) {
        if (event.code === 'Space' || event.which === 32) { // browser compatibility
            bird.jump();
        }
    };
}

function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function movingPillar() {
    let speed = 10;

    let pillars = document.getElementsByClassName('pillar');
    let birdDiv = document.getElementById('bird');
    let windowHeight = document.getElementById('DropBox').clientHeight;
    let windowWidth = document.getElementById('DropBox').clientWidth;


    for (let i = 0; i < pillars.length; i++) {
        let distanceToRight = parseFloat(pillars[i].style.right);
        distanceToRight += speed;
        pillars[i].style.right = distanceToRight + 'px';

        // check collision

        if (birdDiv.offsetLeft+birdDiv.clientWidth > pillars[i].offsetLeft && birdDiv.offsetLeft < pillars[i].offsetLeft+pillars[i].clientWidth){
            if (pillars[i].id==='top' && birdDiv.offsetTop<pillars[i].clientHeight){
                bird.death();
                console.log(birdDiv.offsetLeft,birdDiv.clientWidth,pillars[i].offsetLeft,pillars[i].clientWidth );
            }
            else if (pillars[i].id==='bottom' && windowHeight-(birdDiv.offsetTop+birdDiv.clientHeight)<pillars[i].clientHeight){
                bird.death();
            }
        }

        // delete pillar, add score

        let scoreDiv = document.getElementById('score');
        if (pillars[i].id==='top' && pillars[i].checked!==true && parseFloat(pillars[i].style.right) > windowWidth - birdDiv.offsetLeft){
            score+=1;
            scoreDiv.innerHTML = 'Score: '+score;
            pillars[i].checked=true;
        }

    }


    // let topPillar = document.getElementById('top');
    // let distanceToRight = parseFloat(topPillar.style.right);
    // distanceToRight+=speed;
    // topPillar.style.right = distanceToRight +'px';
    // let bottomPillar = document.getElementById('bottom');
    // bottomPillar.style.right=distanceToRight+'px';


}

function generatePillar() {
    let windowHeight = document.getElementById('DropBox').clientHeight;
    let gap = randomRange(150, 300);
    let topPillarHeight = randomRange(50, windowHeight - gap - 50);
    let bottomPillarHeight = windowHeight - gap - topPillarHeight;

    let topPillar = document.createElement('div');
    topPillar.id = 'top';
    topPillar.className = 'pillar';
    topPillar.style.height = topPillarHeight + 'px'; // pillar min height 100px
    topPillar.style.top = '0';
    topPillar.style.right = '0';

    let bottomPillar = document.createElement('div');
    bottomPillar.id = 'bottom';
    bottomPillar.className = 'pillar';
    bottomPillar.style.height = bottomPillarHeight + 'px';
    bottomPillar.style.bottom = '0';
    bottomPillar.style.right = '0';

    document.getElementById('DropBox').appendChild(topPillar);
    document.getElementById('DropBox').appendChild(bottomPillar);

}


let bird = new Bird();


