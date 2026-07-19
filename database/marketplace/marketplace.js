/*=========================================================
MAGNOPVS QUANTVM MARKETPLACE ENGINE
VERSION 2.0
=========================================================*/


document.addEventListener(
"DOMContentLoaded",
()=>{



/*=========================================================
QUANTVM CLOCK
=========================================================*/


const clock =
document.getElementById(
"marketClock"
);



function updateClock(){


if(!clock) return;


const now =
new Date();



clock.textContent =
now.toLocaleTimeString(
"es-CO",
{
hour12:false
}
);


}



setInterval(
updateClock,
1000
);


updateClock();








/*=========================================================
NETWORK LATENCY SIMULATION
=========================================================*/


const latency =
document.getElementById(
"latencyValue"
);



function updateLatency(){


if(!latency) return;


let ms =
Math.floor(
Math.random()*20
)+8;



latency.textContent =
ms+" ms";



}



setInterval(
updateLatency,
3000
);








/*=========================================================
PRODUCT SEARCH
=========================================================*/


const searchInput =
document.getElementById(
"searchInput"
);



const products =
document.querySelectorAll(
".product-card"
);



if(searchInput){


searchInput.addEventListener(
"input",
()=>{


let value =
searchInput.value
.toLowerCase();



products.forEach(
(product)=>{


let text =
product.textContent
.toLowerCase();



if(
text.includes(value)
){

product.style.display =
"block";


}

else{


product.style.display =
"none";


}


});


});


}









/*=========================================================
CATEGORY FILTERS
=========================================================*/


const filters =
document.querySelectorAll(
".filter"
);



filters.forEach(
(filter)=>{


filter.addEventListener(
"click",
()=>{


filters.forEach(
(btn)=>
btn.classList.remove(
"active"
)
);



filter.classList.add(
"active"
);



let category =
filter.textContent
.trim()
.toLowerCase();





products.forEach(
(product)=>{


let productCategory =
product.dataset.category
?.toLowerCase();





if(
category==="todos"
||
productCategory===category
){


product.style.display =
"block";


}

else{


product.style.display =
"none";


}



});


});


});









/*=========================================================
BUY BUTTON SYSTEM
=========================================================*/


const buyButtons =
document.querySelectorAll(
".buy-btn"
);



buyButtons.forEach(
(button)=>{


button.addEventListener(
"click",
()=>{


button.innerHTML =
"Procesando...";


button.disabled =
true;



setTimeout(
()=>{


button.innerHTML =
"✔ Adquirido";



button.style.background =
"#00ff9d";



},
1200
);



});


});









/*=========================================================
FAVORITES SYSTEM
=========================================================*/


const favoriteButtons =
document.querySelectorAll(
".header-actions button:first-child"
);



let favorites =
[];




favoriteButtons.forEach(
(button)=>{


button.addEventListener(
"click",
()=>{


button.classList.toggle(
"selected"
);



console.log(
"Favoritos:",
favorites
);



});


});








/*=========================================================
CATEGORY SIDEBAR
=========================================================*/


const sidebarItems =
document.querySelectorAll(
".category-item"
);



sidebarItems.forEach(
(item)=>{


item.addEventListener(
"click",
()=>{


sidebarItems.forEach(
(el)=>
el.classList.remove(
"active"
)
);



item.classList.add(
"active"
);



});


});









/*=========================================================
CARD HOLOGRAM EFFECT
=========================================================*/


products.forEach(
(card)=>{


card.addEventListener(
"mousemove",
(e)=>{


const rect =
card.getBoundingClientRect();



const x =
e.clientX -
rect.left;



const y =
e.clientY -
rect.top;



const rotateX =
(y -
rect.height/2)
/20;



const rotateY =
(rect.width/2 -
x)
/20;




card.style.transform =

`
perspective(800px)
rotateX(${rotateX}deg)
rotateY(${rotateY}deg)
translateY(-8px)
`;



});





card.addEventListener(
"mouseleave",
()=>{


card.style.transform =
"";


});



});









/*=========================================================
QUANTVM INITIALIZATION
=========================================================*/


console.log(
`
╔══════════════════════════╗
║  MAGNOPVS QUANTVM CORE   ║
║  MARKETPLACE ONLINE      ║
║  SYSTEM INITIALIZED      ║
╚══════════════════════════╝
`
);



});