/*=========================================================
MAGNOEVENTS
MAGNOPVS
=========================================================*/


document.addEventListener(

"DOMContentLoaded",

()=>{


/*=========================================================
ELEMENTS
=========================================================*/


const latency =

document.getElementById(
"latency"
);


const syncValue =

document.getElementById(
"syncValue"
);


const syncBar =

document.getElementById(
"syncBar"
);


const hero =

document.querySelector(
".hero"
);


const cards =

document.querySelectorAll(
".event-card"
);


const buttons =

document.querySelectorAll(
"button"
);




/*=========================================================
LATENCY
=========================================================*/


function updateLatency(){


const value =

(0.03 + Math.random()*0.03)
.toFixed(2);


if(latency){

latency.textContent =
value+" ms";

}


}


setInterval(

updateLatency,

3000

);




/*=========================================================
SYNC PANEL
=========================================================*/


function updateSync(){


const value =

Math.floor(

92 + Math.random()*7

);


if(syncValue){

syncValue.textContent =
value+"%";

}


if(syncBar){

syncBar.style.width =
value+"%";

}


}


setInterval(

updateSync,

5000

);




/*=========================================================
HERO PARALLAX
=========================================================*/


window.addEventListener(

"scroll",

()=>{


if(!hero)return;


const y =

window.scrollY*0.25;


hero.style.backgroundPosition=

"center calc(50% + "+y+"px)";


}

);




/*=========================================================
CARD ENTRANCE
=========================================================*/


const observer =

new IntersectionObserver(

(entries)=>{


entries.forEach(entry=>{


if(entry.isIntersecting){


entry.target.style.opacity="1";

entry.target.style.transform=

"translateY(0)";


}


});


},

{

threshold:0.15

}

);



cards.forEach(card=>{


card.style.opacity="0";

card.style.transform=

"translateY(40px)";

card.style.transition=

"all .8s ease";


observer.observe(card);


});




/*=========================================================
BUTTON FX
=========================================================*/


buttons.forEach(button=>{


button.addEventListener(

"mouseenter",

()=>{


button.style.filter=

"brightness(1.25)";


}


);


button.addEventListener(

"mouseleave",

()=>{


button.style.filter=

"brightness(1)";


}


);


});




/*=========================================================
LIVE STATUS
=========================================================*/


const live =

document.querySelector(
".live"
);


if(live){


setInterval(()=>{


live.style.opacity="0.4";


setTimeout(()=>{


live.style.opacity="1";


},300);


},1000);


}




/*=========================================================
SYSTEM BOOT
=========================================================*/


updateLatency();

updateSync();


console.log(

"%cMAGNOEVENTS ONLINE",

"color:#a7c8ff;font-size:18px;font-family:Orbitron;"

);


console.log(

"Synchronization Stable"

);


});