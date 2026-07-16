/*=========================================================
MAGNOPVS
CONVERGENCIA PROTOCOL
=========================================================*/

const launchDate = new Date("2026-07-25T00:00:00").getTime();

/*=========================================================
ELEMENTOS
=========================================================*/

const daysElement = document.getElementById("days");
const hoursElement = document.getElementById("hours");
const minutesElement = document.getElementById("minutes");
const secondsElement = document.getElementById("seconds");

const progressBar = document.getElementById("progressBar");
const progressValue = document.getElementById("progressValue");

const systemMessage = document.getElementById("systemMessage");

const loader = document.getElementById("loader");

/*=========================================================
MENSAJES
=========================================================*/

const messages = [

"Inicializando Portales...",
"Esperando Exploradores...",
"Sincronizando Realidades...",
"Preparando Despertar...",
"Convergencia Detectada...",
"Cargando Atlas Cósmico...",
"Sof.IA está observando...",
"MagFam Primordiales listos...",
"Abriendo Quantvm Matrix...",
"Calculando Destino..."

];

let messageIndex = 0;

setInterval(()=>{

if(!systemMessage) return;

messageIndex++;

if(messageIndex>=messages.length){

messageIndex=0;

}

systemMessage.textContent=messages[messageIndex];

},6000);

/*=========================================================
ANIMACION NUMEROS
=========================================================*/

function updateValue(element,newValue){

if(!element) return;

const current=element.innerText;

if(current===newValue)return;

element.classList.remove("flip");

void element.offsetWidth;

element.innerText=newValue;

element.classList.add("flip");

}

/*=========================================================
PROGRESO
=========================================================*/

const totalDuration=

launchDate-
new Date("2025-07-25T00:00:00").getTime();

/*=========================================================
COUNTDOWN
=========================================================*/

function updateCountdown(){

const now=new Date().getTime();

const distance=launchDate-now;

if(distance<=0){

document.querySelector(".countdown").innerHTML=`

<div class="portal-open">

<h2>

EL UMBRAL HA SIDO ABIERTO

</h2>

<p>

Bienvenido al Quantvm Matrix

</p>

portalOverlay.classList.add("active");

document
.getElementById("enterHome")
.classList.add("show");

document
.getElementById("finalMessage")
.classList.add("show");

<a class="enter-button"

href="../home/index/index.html">

ENTRAR

</a>

</div>

`;

return;

}

const days=Math.floor(distance/(1000*60*60*24));

const hours=Math.floor(

(distance%(1000*60*60*24))

/

(1000*60*60)

);

const minutes=Math.floor(

(distance%(1000*60*60))

/

(1000*60)

);

const seconds=Math.floor(

(distance%(1000*60))

/

1000

);

updateValue(daysElement,String(days).padStart(2,"0"));

updateValue(hoursElement,String(hours).padStart(2,"0"));

updateValue(minutesElement,String(minutes).padStart(2,"0"));

updateValue(secondsElement,String(seconds).padStart(2,"0"));

const progress=

((now-

new Date("2025-07-25T00:00:00").getTime())

/

totalDuration)

*100;

const finalProgress=Math.max(0,Math.min(progress,100));

if(progressBar){

progressBar.style.width=

finalProgress+"%";

}

if(progressValue){

progressValue.innerText=

finalProgress.toFixed(2)+"%";

}

}

/*=========================================================
LOADER
=========================================================*/

window.addEventListener("load",()=>{

setTimeout(()=>{

if(loader){

loader.classList.add("hide");

}

},1500);

});

/*=========================================================
PARTICULAS
=========================================================*/

const particleContainer=document.getElementById("particles");

if(particleContainer){

for(let i=0;i<90;i++){

const p=document.createElement("span");

p.className="particle";

p.style.left=Math.random()*100+"%";

p.style.top=Math.random()*100+"%";

p.style.animationDelay=Math.random()*12+"s";

p.style.animationDuration=

6+

Math.random()*12+

"s";

particleContainer.appendChild(p);

}

}

/*=========================================================
INIT
=========================================================*/

updateCountdown();

setInterval(updateCountdown,1000);