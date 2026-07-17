/*=========================================================
MAGNOPVS DOWNLOAD CENTER
=========================================================*/

document.addEventListener(
"DOMContentLoaded",
()=>{


/*=========================================================
CONFIG
=========================================================*/

const VERSION = "v0.0.1 Alpha";

const STATUS = "COMING SOON";


const LINKS={

ANDROID:"#",

APK:"#",

IOS:"#",

WINDOWS:"#",

LINUX:"#"

};


/*=========================================================
BOOT
=========================================================*/

detectDevice();

setVersion();

activateButtons();

animatePanels();


/*=========================================================
VERSION
=========================================================*/

function setVersion(){

const version=document.querySelector(
".version-card strong"
);

if(version){

version.textContent=VERSION;

}

}


/*=========================================================
DEVICE DETECTION
=========================================================*/

function detectDevice(){

const agent=navigator.userAgent.toLowerCase();

let target=null;

if(agent.includes("android")){

target=document.querySelector(".android");

}

else if(
agent.includes("iphone") ||
agent.includes("ipad") ||
agent.includes("mac")
){

target=document.querySelector(".apple");

}

else if(agent.includes("win")){

target=document.querySelector(".windows");

}

else if(agent.includes("linux")){

target=document.querySelector(".linux");

}

if(target){

target.style.borderColor="#5bc8f5";

target.style.boxShadow=
"0 0 25px rgba(91,200,245,.6)";

target.insertAdjacentHTML(

"beforeend",

`
<span
class="recommended">

RECOMMENDED

</span>

`

);

}

}


/*=========================================================
BUTTON EVENTS
=========================================================*/

function activateButtons(){

const buttons=document.querySelectorAll(
".download-button"
);

buttons.forEach(button=>{

button.addEventListener(
"mouseenter",
()=>{

button.style.transform=
"translateY(-4px) scale(1.02)";

}

);

button.addEventListener(
"mouseleave",
()=>{

button.style.transform=
"translateY(0) scale(1)";

}

);

button.addEventListener(
"click",
()=>{

download(button);

}

);

});

}


/*=========================================================
DOWNLOAD
=========================================================*/

function download(button){

let url="#";

if(button.classList.contains("android")){

url=LINKS.ANDROID;

}

if(button.classList.contains("apk")){

url=LINKS.APK;

}

if(button.classList.contains("apple")){

url=LINKS.IOS;

}

if(button.classList.contains("windows")){

url=LINKS.WINDOWS;

}

if(button.classList.contains("linux")){

url=LINKS.LINUX;

}


/*---------------------------------------------------------
COMING SOON
---------------------------------------------------------*/

if(url=="#"){

showNotification(

"COMING SOON"

);

return;

}

window.location.href=url;

}


/*=========================================================
NOTIFICATION
=========================================================*/

function showNotification(text){

const panel=document.createElement("div");

panel.className="notification";

panel.innerHTML=`

<span class="material-symbols-outlined">

rocket_launch

</span>

${text}

`;

document.body.appendChild(panel);

setTimeout(()=>{

panel.classList.add("show");

},100);

setTimeout(()=>{

panel.classList.remove("show");

setTimeout(()=>{

panel.remove();

},500);

},2500);

}


/*=========================================================
ENTRANCE
=========================================================*/

function animatePanels(){

const panels=document.querySelectorAll(

".info-panel,.phone-panel,.downloads"

);

panels.forEach(

(panel,index)=>{

panel.style.opacity="0";

panel.style.transform=

"translateY(40px)";

setTimeout(()=>{

panel.style.transition=

"all .8s ease";

panel.style.opacity="1";

panel.style.transform=

"translateY(0)";

},index*250);

}

);

}


/*=========================================================
PHONE FLOAT
=========================================================*/

const phone=document.querySelector(".phone");

if(phone){

let t=0;

setInterval(()=>{

t+=0.03;

phone.style.transform=

`translateY(${Math.sin(t)*8}px)`;

},30);

}


/*=========================================================
STATUS FLASH
=========================================================*/

const status=document.querySelector(".status");

if(status){

setInterval(()=>{

status.style.opacity=

status.style.opacity=="0.4"

?"1"

:"0.4";

},700);

}


});