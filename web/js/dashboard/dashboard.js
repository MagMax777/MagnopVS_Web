import ProfileService from "../../js/services/profile.service.js";

/*=========================================================
MAGNOPVS
DASHBOARD SYSTEM
dashboard.js
PARTE 1/3
=========================================================*/

"use strict";

/*=========================================================
CORE
=========================================================*/

const Dashboard={

    player:{},

    stats:{},

    ui:{},

/*=========================================================
INIT
=========================================================*/

    init(){

        this.cache();

        this.loadPlayer();

        this.loadStats();

        this.renderProfile();

        this.renderStats();

        this.startClock();

        this.startGreeting();

        this.animateBars();

        this.createStars();

        console.log("Dashboard Loaded");

        await this.loadProfile();

    },

/*=========================================================
CACHE
=========================================================*/

    cache(){

        this.ui.name=document.getElementById(

            "playerName"

        );

        this.ui.rank=document.getElementById(

            "playerRank"

        );

        this.ui.avatar=document.getElementById(

            "playerAvatar"

        );

        this.ui.level=document.getElementById(

            "playerLevel"

        );

        this.ui.clock=document.getElementById(

            "clock"

        );

        this.ui.greeting=document.getElementById(

            "greeting"

        );

    },

/*=========================================================
LOAD PLAYER
=========================================================*/

    loadPlayer(){

        const save=

            localStorage.getItem(

                "mlh_player"

            );

        if(save){

            this.player=

                JSON.parse(save);

        }

        else{

            this.player={

                name:"Life Hero",

                rank:"Explorer",

                level:1,

                avatar:

                "assets/images/avatar/default.webp"

            };

        }

    },

/*=========================================================
LOAD STATS
=========================================================*/

    loadStats(){

        this.stats={

            vitality:92,

            power:68,

            wisdom:74,

            charisma:80,

            xp:1240,

            coins:560,

            mana:310,

            alignment:77

        };

    },

/*=========================================================
PROFILE
=========================================================*/

    renderProfile(){

        if(this.ui.name)

            this.ui.name.textContent=

                this.player.name;

        if(this.ui.rank)

            this.ui.rank.textContent=

                this.player.rank;

        if(this.ui.level)

            this.ui.level.textContent=

                "Lv."+this.player.level;

        if(

            this.ui.avatar &&

            this.player.avatar

        ){

            this.ui.avatar.src=

                this.player.avatar;

        }

    },

/*=========================================================
STATS
=========================================================*/

    renderStats(){

        this.setValue(

            "xpValue",

            this.stats.xp

        );

        this.setValue(

            "coinValue",

            this.stats.coins

        );

        this.setValue(

            "manaValue",

            this.stats.mana

        );

        this.setValue(

            "alignmentValue",

            this.stats.alignment+"%"

        );

    },

    setValue(id,value){

        const el=

            document.getElementById(id);

        if(el){

            el.textContent=value;

        }

    },

/*=========================================================
CLOCK
=========================================================*/

    startClock(){

        const update=()=>{

            const now=new Date();

            const time=

                now.toLocaleTimeString(

                    "es-CO",

                    {

                        hour:"2-digit",

                        minute:"2-digit",

                        second:"2-digit"

                    }

                );

            if(this.ui.clock){

                this.ui.clock.textContent=time;

            }

        };

        update();

        setInterval(update,1000);

    },

/*=========================================================
GREETING
=========================================================*/

    startGreeting(){

        const hour=new Date().getHours();

        let text="Bienvenido";

        if(hour>=5 && hour<12){

            text="☀️ Buenos días";

        }

        else if(hour>=12 && hour<18){

            text="🌤️ Buenas tardes";

        }

        else{

            text="🌙 Buenas noches";

        }

        if(this.ui.greeting){

            this.ui.greeting.textContent=text;

        }

    },

/*=========================================================
ANIMATE PROGRESS
=========================================================*/

    animateBars(){

        const bars=document.querySelectorAll(

            ".progress span"

        );

        bars.forEach(bar=>{

            const value=

                bar.dataset.value || "0";

            bar.style.width="0%";

            setTimeout(()=>{

                bar.style.width=

                    value+"%";

            },300);

        });

    },

/*=========================================================
SAVE PLAYER
=========================================================*/

    savePlayer(){

        localStorage.setItem(

            "mlh_player",

            JSON.stringify(

                this.player

            )

        );

    },

/*=========================================================
UPDATE PLAYER
=========================================================*/

    updatePlayer(data){

        this.player={

            ...this.player,

            ...data

        };

        this.savePlayer();

        this.renderProfile();

    },

/*=========================================================
TOAST
=========================================================*/

    toast(message){

        const toast=

            document.createElement("div");

        toast.className="dashboard-toast";

        toast.textContent=message;

        document.body.appendChild(toast);

        requestAnimationFrame(()=>{

            toast.classList.add("show");

        });

        setTimeout(()=>{

            toast.classList.remove("show");

            setTimeout(()=>{

                toast.remove();

            },300);

        },2500);

    },

/*=========================================================
SPACE PARTICLES
=========================================================*/

createStars(){

    const canvas=

        document.getElementById(

            "spaceBackground"

        );

    if(!canvas) return;

    const ctx=

        canvas.getContext("2d");

    const stars=[];

    function resize(){

        canvas.width=

            window.innerWidth;

        canvas.height=

            window.innerHeight;

    }

    resize();

    window.addEventListener(

        "resize",

        resize

    );

    for(

        let i=0;

        i<180;

        i++

    ){

        stars.push({

            x:Math.random()*canvas.width,

            y:Math.random()*canvas.height,

            r:Math.random()*2,

            s:0.15+Math.random()*0.4

        });

    }

    function draw(){

        ctx.clearRect(

            0,

            0,

            canvas.width,

            canvas.height

        );

        ctx.fillStyle="#8eefff";

        stars.forEach(star=>{

            ctx.beginPath();

            ctx.arc(

                star.x,

                star.y,

                star.r,

                0,

                Math.PI*2

            );

            ctx.fill();

            star.y+=star.s;

            if(

                star.y>

                canvas.height

            ){

                star.y=0;

                star.x=

                    Math.random()

                    *canvas.width;

            }

        });

        requestAnimationFrame(draw);

    }

    draw();

},

/*=========================================================
REFRESH
=========================================================*/

    refresh(){

        this.loadPlayer();

        this.loadStats();

        this.renderProfile();

        this.renderStats();

        this.animateBars();

    },

/*=========================================================
RESET
=========================================================*/

    reset(){

        localStorage.removeItem(

            "mlh_player"

        );

        this.player={

            name:"Life Hero",

            rank:"Explorer",

            level:1,

            avatar:

            "assets/images/avatar/default.webp"

        };

        this.loadStats();

        this.renderProfile();

        this.renderStats();

        this.toast(

            "Perfil reiniciado."

        );

    }

};

/*=========================================================
START
=========================================================*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        Dashboard.init();

    }

);    

/*=========================================================
LOAD PROFILE
=========================================================*/

async loadProfile(){

    const profile=

        await ProfileService

        .getCurrentProfile();

    if(!profile){

        console.warn(

            "No se encontró el perfil."

        );

        return;

    }

    this.profile=profile;

    this.renderProfile();

}