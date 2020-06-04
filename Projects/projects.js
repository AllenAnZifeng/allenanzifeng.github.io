'use strict';
// Created by Allen An at 2020/6/2



function toggleHideMenu() {
    let menu = document.querySelector('#menu');
    menu.classList.toggle('hide');
}

function hideMenu() {
    let menu = document.querySelector('#menu');
    for (let classname of menu.classList){
        if (classname==='hide'){
            return
        }
    }
    menu.classList.toggle('hide');
}


function scrollToTop(){
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}


window.addEventListener('scroll',()=>{
    let button = document.querySelector('#backToTop');
    if (document.documentElement.scrollTop>20 || document.body.scrollTop > 20){
        button.style.display='block';
    }else{
        button.style.display='none';
    }

});


window.addEventListener('DOMContentLoaded', (event) => {


});

