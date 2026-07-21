/*=========================================================
MAGNOPVS
DASHBOARD SYSTEM
dashboard.js
PARTE 1/3
CORE + PROFILE + STATS
=========================================================*/

"use strict";

/*=========================================================
IMPORTS
=========================================================*/

import { auth } from "../../config/firebase/firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import ProfileService from "../../js/services/profile.service.js";

/*=========================================================
CORE
=========================================================*/

const Dashboard = {

    /*=========================================
    STATE
    =========================================*/

    player: {},

    stats: {},

    profile: null,

    ui: {},

/*=========================================================
INIT
=========================================================*/

    async init(){

        console.log("🚀 Dashboard Initializing...");

        this.cache();

        this.loadDefaultStats();

        this.startClock();

        this.startGreeting();

        this.animateBars();

        this.createStars();

        this.listenAuth();

    },

/*=========================================================
CACHE DOM
=========================================================*/

    cache(){

        this.ui = {

            name: document.getElementById("playerName"),

            rank: document.getElementById("playerRank"),

            avatar: document.getElementById("playerAvatar"),

            level: document.getElementById("playerLevel"),

            xp: document.getElementById("xpValue"),

            coins: document.getElementById("coinValue"),

            mana: document.getElementById("manaValue"),

            alignment: document.getElementById("alignmentValue"),

            greeting: document.getElementById("greeting"),

            clock: document.getElementById("clock")

        };

    },

/*=========================================================
AUTH STATE
=========================================================*/

    listenAuth(){

        onAuthStateChanged(auth, async(user)=>{

            if(!user){

                console.warn("Usuario no autenticado.");

                window.location.href =
                "https://magmax777.github.io/MagnopVS_Web/database/register/register.html";

                return;

            }

            console.log("Usuario autenticado:", user.email);

            await this.loadProfile();

        });

    },

/*=========================================================
LOAD PROFILE
=========================================================*/

    async loadProfile(){

        try{

          const profile =
                
            await ProfileService.syncProfile();

            if(!profile){

                console.warn("No existe perfil.");

                return;

            }

            this.profile = profile;

            this.player = {

                uid: profile.uid,

                name: profile.full_name,

                username: profile.username,

                email: profile.email,

                avatar: profile.avatar,

                banner: profile.banner,

                bio: profile.bio,

                level: profile.level,

                rank: profile.rank,

                class: profile.class,

                faction: profile.faction,

                reputation: profile.reputation,

                followers: profile.followers,

                following: profile.following

            };

            this.stats = {

                xp: profile.xp,

                coins: profile.magnopoints,

                mana: profile.microcoins,

                alignment: profile.reputation

            };

            this.renderProfile();

            this.renderStats();

            console.log("✅ Perfil cargado");

        }

        catch(error){

            console.error(error);

        }

    },

/*=========================================================
DEFAULT STATS
=========================================================*/

    loadDefaultStats(){

        this.stats={

            xp:0,

            coins:0,

            mana:0,

            alignment:0

        };

    },

/*=========================================================
PROFILE RENDER
=========================================================*/

    renderProfile(){

        if(this.ui.name){

            this.ui.name.textContent =
            this.player.name ?? "Life Hero";

        }

        if(this.ui.rank){

            this.ui.rank.textContent =
            this.player.rank ?? "Explorer";

        }

        if(this.ui.level){

            this.ui.level.textContent =
            "Lv. " + (this.player.level ?? 1);

        }

        if(

            this.ui.avatar &&

            this.player.avatar

        ){

            this.ui.avatar.src =
            this.player.avatar;

        }

    },

/*=========================================================
STATS
=========================================================*/

    renderStats(){

        this.setValue(

            this.ui.xp,

            this.stats.xp

        );

        this.setValue(

            this.ui.coins,

            this.stats.coins

        );

        this.setValue(

            this.ui.mana,

            this.stats.mana

        );

        this.setValue(

            this.ui.alignment,

            this.stats.alignment + "%"

        );

    },

    setValue(element,value){

        if(!element) return;

        element.textContent = value;

    },

    /*=========================================================
MAGNOPVS
DASHBOARD SYSTEM
dashboard.js
PARTE 2/3
UTILITIES + EFFECTS + LOGOUT
=========================================================*/

/*=========================================================
CLOCK
=========================================================*/

    startClock(){

        const updateClock = () => {

            const now = new Date();

            if(this.ui.clock){

                this.ui.clock.textContent =
                now.toLocaleTimeString(
                    "es-CO",
                    {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit"
                    }
                );

            }

        };

        updateClock();

        setInterval(updateClock,1000);

    },

/*=========================================================
GREETING
=========================================================*/

    startGreeting(){

        const hour = new Date().getHours();

        let greeting = "Bienvenido";

        if(hour >= 5 && hour < 12){

            greeting = "☀️ Buenos días";

        }

        else if(hour >= 12 && hour < 18){

            greeting = "🌤️ Buenas tardes";

        }

        else{

            greeting = "🌙 Buenas noches";

        }

        if(this.ui.greeting){

            this.ui.greeting.textContent = greeting;

        }

    },

/*=========================================================
PROGRESS BARS
=========================================================*/

    animateBars(){

        const bars = document.querySelectorAll(".progress span");

        bars.forEach(bar=>{

            const value = Number(bar.dataset.value || 0);

            bar.style.width = "0%";

            setTimeout(()=>{

                bar.style.width = value + "%";

            },300);

        });

    },

/*=========================================================
UPDATE BARS
=========================================================*/

    updateProgressBar(selector,value){

        const bar = document.querySelector(selector);

        if(!bar) return;

        bar.dataset.value = value;

        bar.style.width = value + "%";

    },

/*=========================================================
TOAST
=========================================================*/

    toast(message,type="success"){

        const toast = document.createElement("div");

        toast.className =

            "dashboard-toast " + type;

        toast.textContent = message;

        document.body.appendChild(toast);

        requestAnimationFrame(()=>{

            toast.classList.add("show");

        });

        setTimeout(()=>{

            toast.classList.remove("show");

            setTimeout(()=>{

                toast.remove();

            },300);

        },3000);

    },

/*=========================================================
REFRESH
=========================================================*/

    async refresh(){

        await this.loadProfile();

        this.renderProfile();

        this.renderStats();

        this.animateBars();

        console.log("Dashboard actualizado.");

    },

/*=========================================================
RESET UI
=========================================================*/

    reset(){

        this.player = {};

        this.profile = null;

        this.loadDefaultStats();

        this.renderProfile();

        this.renderStats();

    },

/*=========================================================
LOGOUT
=========================================================*/

    async logout(){

        try{

            await auth.signOut();

            window.location.href =
            "https://magmax777.github.io/MagnopVS_Web/database/register/register.html";

        }

        catch(error){

            console.error(error);

            this.toast(

                "No fue posible cerrar sesión.",

                "error"

            );

        }

    },

/*=========================================================
SPACE BACKGROUND
=========================================================*/

    createStars(){

        const canvas =

            document.getElementById("spaceBackground");

        if(!canvas) return;

        const ctx = canvas.getContext("2d");

        const stars = [];

        const STAR_COUNT = 180;

        const resize = ()=>{

            canvas.width = window.innerWidth;

            canvas.height = window.innerHeight;

        };

        resize();

        window.addEventListener(

            "resize",

            resize

        );

        for(let i=0;i<STAR_COUNT;i++){

            stars.push({

                x:Math.random()*canvas.width,

                y:Math.random()*canvas.height,

                radius:Math.random()*2,

                speed:0.2+Math.random()*0.5,

                alpha:0.3+Math.random()*0.7

            });

        }

        const draw=()=>{

            ctx.clearRect(

                0,

                0,

                canvas.width,

                canvas.height

            );

            stars.forEach(star=>{

                ctx.beginPath();

                ctx.fillStyle =

                    `rgba(142,239,255,${star.alpha})`;

                ctx.arc(

                    star.x,

                    star.y,

                    star.radius,

                    0,

                    Math.PI*2

                );

                ctx.fill();

                star.y += star.speed;

                if(star.y>canvas.height){

                    star.y = 0;

                    star.x =

                        Math.random()*canvas.width;

                }

            });

            requestAnimationFrame(draw);

        };

        draw();

    },

    /*=========================================================
EVENTS
=========================================================*/

    bindEvents(){

        //--------------------------------------------------
        // Logout Button
        //--------------------------------------------------

        const logoutButton = document.getElementById("logoutButton");

        if(logoutButton){

            logoutButton.addEventListener("click",()=>{

                this.logout();

            });

        }

        //--------------------------------------------------
        // Refresh Button
        //--------------------------------------------------

        const refreshButton = document.getElementById("refreshButton");

        if(refreshButton){

            refreshButton.addEventListener("click",()=>{

                this.refresh();

            });

        }

    },

/*=========================================================
KEYBOARD SHORTCUTS
=========================================================*/

    shortcuts(){

        document.addEventListener("keydown",(event)=>{

            //--------------------------------------------------
            // F5
            //--------------------------------------------------

            if(event.key==="F5"){

                event.preventDefault();

                this.refresh();

            }

            //--------------------------------------------------
            // ESC
            //--------------------------------------------------

            if(event.key==="Escape"){

                console.clear();

                console.log("MagnopVS Dashboard");

            }

        });

    },

/*=========================================================
WINDOW EVENTS
=========================================================*/

    windowEvents(){

        window.addEventListener(

            "focus",

            ()=>{

                this.refresh();

            }

        );

    },

/*=========================================================
SYSTEM READY
=========================================================*/

    ready(){

        console.log(

            "%c✓ MagnopVS Dashboard Ready",

            "color:#00FFD5;font-size:16px;font-weight:bold;"

        );

    }

};

/*=========================================================
BOOT
=========================================================*/

document.addEventListener(

    "DOMContentLoaded",

    async()=>{

        try{

            await Dashboard.init();

            Dashboard.bindEvents();

            Dashboard.shortcuts();

            Dashboard.windowEvents();

            Dashboard.ready();

        }

        catch(error){

            console.error(

                "Dashboard Error:",

                error

            );

        }

    }

);

/*=========================================================
PUBLIC API
=========================================================*/

window.Dashboard = Dashboard;

/*=========================================================
END
=========================================================*/

console.log(

"%cDashboard System Loaded",

"color:#6CB7FF;font-size:14px;font-weight:bold;"

);