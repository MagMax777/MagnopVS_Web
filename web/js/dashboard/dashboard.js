/*=========================================================
MAGNOPVS DASHBOARD
dashboard.js
Version 1.0
=========================================================*/

"use strict";

/*=========================================================
DOM
=========================================================*/

const loader =
document.getElementById("loader");

const toast =
document.getElementById("toast");

const sofiaButton =
document.getElementById("sofiaButton");

const profileModal =
document.getElementById("profileModal");

const notificationsModal =
document.getElementById("notificationsModal");

const settingsModal =
document.getElementById("settingsModal");

const closeButtons =
document.querySelectorAll(".close-modal");

const statCards =
document.querySelectorAll(".stat-card");

const actionCards =
document.querySelectorAll(".action-card");

const missionBars =
document.querySelectorAll(".mission progress");

const heroButtons =
document.querySelectorAll(".hero-buttons button");

/*=========================================================
PLAYER DATA
=========================================================*/

const player = {

    username:"Jean Michael",

    level:17,

    xp:69,

    hp:92,

    mana:76,

    mp:1250,

    coins:340,

    streak:7

};

/*=========================================================
INITIALIZE
=========================================================*/

window.addEventListener(

    "DOMContentLoaded",

    ()=>{

        startLoader();

        initializeDashboard();

    }

);

/*=========================================================
INITIALIZE DASHBOARD
=========================================================*/

function initializeDashboard(){

    registerButtons();

    animateStats();

    animateProgressBars();

    registerHoverEffects();

}

/*=========================================================
LOADER
=========================================================*/

function startLoader(){

    const progress =

    document.querySelector(".loader-progress");

    let value = 0;

    const interval = setInterval(()=>{

        value += 2;

        progress.style.width = value + "%";

        if(value >= 100){

            clearInterval(interval);

            setTimeout(()=>{

                loader.style.opacity = "0";

                loader.style.pointerEvents = "none";

                loader.style.transition =
                "0.6s";

                setTimeout(()=>{

                    loader.remove();

                    showToast(
                        "Bienvenido al Quantvm Matrix"
                    );

                },600);

            },300);

        }

    },30);

}

/*=========================================================
TOAST
=========================================================*/

function showToast(message){

    toast.innerHTML = message;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },3500);

}

/*=========================================================
REGISTER BUTTONS
=========================================================*/

function registerButtons(){

    sofiaButton.addEventListener(

        "click",

        ()=>{

            showToast(

                "SOF.IA estará disponible muy pronto."

            );

        }

    );

    heroButtons.forEach(button=>{

        button.addEventListener(

            "click",

            ()=>{

                pulse(button);

            }

        );

    });

    actionCards.forEach(card=>{

        card.addEventListener(

            "click",

            ()=>{

                pulse(card);

            }

        );

    });

}

/*=========================================================
PULSE EFFECT
=========================================================*/

function pulse(element){

    element.animate(

        [

            {

                transform:"scale(1)"

            },

            {

                transform:"scale(.95)"

            },

            {

                transform:"scale(1)"

            }

        ],

        {

            duration:220

        }

    );

}

/*=========================================================
MODALS
=========================================================*/

function openModal(modal){

    if(!modal) return;

    modal.classList.remove("hidden");

    document.body.style.overflow="hidden";

}

function closeModal(modal){

    if(!modal) return;

    modal.classList.add("hidden");

    document.body.style.overflow="auto";

}

/*=========================================================
PROFILE
=========================================================*/

const profileButton=document.querySelector("#profileButton");

if(profileButton){

    profileButton.addEventListener(

        "click",

        ()=>{

            openModal(profileModal);

        }

    );

}

/*=========================================================
NOTIFICATIONS
=========================================================*/

const notificationButton=document.querySelector("#notificationButton");

if(notificationButton){

    notificationButton.addEventListener(

        "click",

        ()=>{

            openModal(notificationsModal);

        }

    );

}

/*=========================================================
SETTINGS
=========================================================*/

const settingsButton=document.querySelector("#settingsButton");

if(settingsButton){

    settingsButton.addEventListener(

        "click",

        ()=>{

            openModal(settingsModal);

        }

    );

}

/*=========================================================
CLOSE MODALS
=========================================================*/

closeButtons.forEach(button=>{

    button.addEventListener(

        "click",

        ()=>{

            closeModal(button.closest(".modal"));

        }

    );

});

document.querySelectorAll(".modal").forEach(modal=>{

    modal.addEventListener(

        "click",

        e=>{

            if(e.target===modal){

                closeModal(modal);

            }

        }

    );

});

/*=========================================================
ESC CLOSE
=========================================================*/

window.addEventListener(

    "keydown",

    e=>{

        if(e.key==="Escape"){

            document.querySelectorAll(".modal")

            .forEach(

                modal=>modal.classList.add("hidden")

            );

            document.body.style.overflow="auto";

        }

    }

);

/*=========================================================
ANIMATE STATS
=========================================================*/

function animateStats(){

    statCards.forEach(card=>{

        const number=

        card.querySelector("strong");

        if(!number) return;

        const target=parseInt(

            number.innerText.replace(/\D/g,"")

        );

        if(isNaN(target)) return;

        let value=0;

        const speed=Math.max(1,Math.floor(target/80));

        const timer=setInterval(()=>{

            value+=speed;

            if(value>=target){

                value=target;

                clearInterval(timer);

            }

            number.innerText=value;

        },15);

    });

}

/*=========================================================
MISSION BARS
=========================================================*/

function animateProgressBars(){

    missionBars.forEach(bar=>{

        const target=bar.value;

        bar.value=0;

        let progress=0;

        const timer=setInterval(()=>{

            progress++;

            bar.value=progress;

            if(progress>=target){

                clearInterval(timer);

            }

        },18);

    });

}

/*=========================================================
HOVER GLOW
=========================================================*/

function registerHoverEffects(){

    statCards.forEach(card=>{

        card.addEventListener(

            "mousemove",

            e=>{

                const rect=

                card.getBoundingClientRect();

                const x=e.clientX-rect.left;

                const y=e.clientY-rect.top;

                card.style.background=

                `radial-gradient(circle at ${x}px ${y}px,
                rgba(101,216,255,.18),
                rgba(17,24,39,1) 70%)`;

            }

        );

        card.addEventListener(

            "mouseleave",

            ()=>{

                card.style.background="";

            }

        );

    });

}

/*=========================================================
LIVE COUNTERS
=========================================================*/

function updateDashboard() {

    const level = document.getElementById("playerLevel");
    const xp = document.getElementById("playerXP");
    const hp = document.getElementById("playerHP");
    const mana = document.getElementById("playerMana");
    const coins = document.getElementById("playerCoins");

    if(level) level.innerText = player.level;
    if(xp) xp.innerText = player.xp + "%";
    if(hp) hp.innerText = player.hp + "%";
    if(mana) mana.innerText = player.mana + "%";
    if(coins) coins.innerText = player.coins;

}

updateDashboard();

/*=========================================================
SAVE SYSTEM
=========================================================*/

function savePlayer(){

    localStorage.setItem(

        "magnopvs_player",

        JSON.stringify(player)

    );

}

function loadPlayer(){

    const data=

    localStorage.getItem(

        "magnopvs_player"

    );

    if(!data) return;

    Object.assign(

        player,

        JSON.parse(data)

    );

}

loadPlayer();

updateDashboard();

/*=========================================================
DAILY MISSIONS
=========================================================*/

const dailyMissions=[

    "Completa una misión.",

    "Gana 500 XP.",

    "Visita el Marketplace.",

    "Habla con SOF.IA.",

    "Obtén una insignia.",

    "Explora una nueva Saga.",

    "Comparte tu perfil."

];

function randomMission(){

    const mission=

    dailyMissions[

        Math.floor(

            Math.random()*

            dailyMissions.length

        )

    ];

    const box=

    document.getElementById(

        "dailyMission"

    );

    if(box){

        box.innerHTML=mission;

    }

}

randomMission();

/*=========================================================
SOF.IA
=========================================================*/

const sofiaMessages=[

"Bienvenido nuevamente, Operador.",

"Tu energía está aumentando.",

"Hay nuevas misiones disponibles.",

"El Marketplace fue actualizado.",

"Una nueva Saga ha sido detectada.",

"Tu avatar evoluciona lentamente.",

"Recomendación: completa tu Perfil.",

"Todo está sincronizado."

];

let sofiaIndex=0;

function rotateSofia(){

    const text=

    document.getElementById(

        "sofiaMessage"

    );

    if(!text) return;

    text.innerHTML=

    sofiaMessages[sofiaIndex];

    sofiaIndex++;

    if(

        sofiaIndex>=

        sofiaMessages.length

    ){

        sofiaIndex=0;

    }

}

rotateSofia();

setInterval(

    rotateSofia,

    7000

);

/*=========================================================
FAKE NOTIFICATIONS
=========================================================*/

const notifications=[

"Nuevo logro desbloqueado.",

"Has recibido MagnoPoints.",

"Nueva temporada disponible.",

"SOF.IA tiene recomendaciones.",

"Marketplace actualizado.",

"Nuevo Hero cercano.",

"Nueva misión diaria."

];

setInterval(()=>{

    const random=

    notifications[

        Math.floor(

            Math.random()*

            notifications.length

        )

    ];

    showToast(random);

},45000);

/*=========================================================
SMOOTH BUTTONS
=========================================================*/

document

.querySelectorAll("button")

.forEach(button=>{

    button.addEventListener(

        "mouseenter",

        ()=>{

            button.animate(

                [

                    {

                        transform:"scale(1)"

                    },

                    {

                        transform:"scale(1.04)"

                    }

                ],

                {

                    duration:180,

                    fill:"forwards"

                }

            );

        }

    );

    button.addEventListener(

        "mouseleave",

        ()=>{

            button.animate(

                [

                    {

                        transform:"scale(1.04)"

                    },

                    {

                        transform:"scale(1)"

                    }

                ],

                {

                    duration:180,

                    fill:"forwards"

                }

            );

        }

    );

});

/*=========================================================
CLICK SOUND (Preparado)
=========================================================*/

const clickSound=new Audio(
    "assets/audio/click.mp3"
);

document

.querySelectorAll("button")

.forEach(button=>{

    button.addEventListener(

        "click",

        ()=>{

            clickSound.currentTime=0;

            clickSound.volume=.35;

            clickSound.play().catch(()=>{});

        }

    );

});

/*=========================================================
AUTO SAVE
=========================================================*/

setInterval(

    savePlayer,

    10000

);

/*=========================================================
PLACEHOLDERS SUPABASE
=========================================================*/

// TODO:
// Obtener usuario autenticado.
//
// Cargar avatar.
//
// Cargar inventario.
//
// Cargar estadísticas.
//
// Cargar MagnoPoints.
//
// Cargar MagnoCoins.
//
// Cargar Amigos.
//
// Cargar Feed.
//
// Cargar Misiones.
//
// Cargar Logros.
//
// Cargar Timeline.
//
// Cargar Mensajes.

/*=========================================================
READY
=========================================================*/

console.log(

"✓ MagnopVS Dashboard Ready"

);

