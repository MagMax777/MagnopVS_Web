/*=========================================================
MISSIONS SYSTEM
MagnopVS Dashboard
=========================================================*/

const Missions={

    data:[

        {
            id:1,
            title:"Despertar",
            description:"Completa tu perfil.",
            xp:100,
            mp:20,
            completed:false,
            progress:0,
            goal:1,
            icon:"🧬"
        },

        {
            id:2,
            title:"Primera Exploración",
            description:"Visita el Atlas Cósmico.",
            xp:150,
            mp:30,
            completed:false,
            progress:0,
            goal:1,
            icon:"🌌"
        },

        {
            id:3,
            title:"Conecta tu Cuenta",
            description:"Sincroniza Supabase.",
            xp:200,
            mp:40,
            completed:false,
            progress:0,
            goal:1,
            icon:"☁️"
        },

        {
            id:4,
            title:"Primer Logro",
            description:"Obtén 500 XP.",
            xp:300,
            mp:60,
            completed:false,
            progress:0,
            goal:500,
            icon:"🏆"
        },

        {
            id:5,
            title:"Maestro del Sistema",
            description:"Completa las demás misiones.",
            xp:1000,
            mp:250,
            completed:false,
            progress:0,
            goal:4,
            icon:"👑"
        }

    ],

    ui:{},

    init(){

        this.ui.list=document.getElementById("missionsList");

        this.ui.completed=document.getElementById("missionCompleted");

        this.ui.total=document.getElementById("missionTotal");

        this.ui.progress=document.getElementById("missionProgress");

        this.render();

    },

/*=========================================================
RENDER
=========================================================*/

    render(){

        if(!this.ui.list)return;

        this.ui.list.innerHTML="";

        this.data.forEach(mission=>{

            const card=document.createElement("div");

            card.className="mission-card";

            card.innerHTML=`

                <div class="mission-header">

                    <div class="mission-icon">

                        ${mission.icon}

                    </div>

                    <div>

                        <h3>${mission.title}</h3>

                        <p>${mission.description}</p>

                    </div>

                </div>

                <div class="mission-bar">

                    <div
                        class="mission-fill"
                        style="width:${(mission.progress/mission.goal)*100}%">
                    </div>

                </div>

                <div class="mission-footer">

                    <span>

                        ${mission.progress}/${mission.goal}

                    </span>

                    <button
                        data-id="${mission.id}"
                        class="mission-btn">

                        ${
                            mission.completed
                            ? "✓ Completada"
                            : "Reclamar"
                        }

                    </button>

                </div>

            `;

            this.ui.list.appendChild(card);

        });

        this.updateSummary();

        this.bindButtons();

    },

    /*=========================================================
MISSION LOGIC
=========================================================*/

    bindButtons(){

        const buttons=document.querySelectorAll(".mission-btn");

        buttons.forEach(button=>{

            button.addEventListener(

                "click",

                ()=>{

                    const id=parseInt(

                        button.dataset.id

                    );

                    this.claim(id);

                }

            );

        });

    },

    claim(id){

        const mission=this.data.find(

            m=>m.id===id

        );

        if(!mission)return;

        if(mission.completed)return;

        if(mission.progress<mission.goal){

            this.notify(

                "⚠️ Misión incompleta"

            );

            return;

        }

        mission.completed=true;

        Stats.addXP(mission.xp);

        Stats.addMP(mission.mp);

        Stats.save();

        this.notify(

            `🏆 +${mission.xp} XP   +${mission.mp} MP`

        );

        this.checkMasterMission();

        this.save();

        this.render();

    },

/*=========================================================
MISSION PROGRESS
=========================================================*/

    progress(id,value=1){

        const mission=this.data.find(

            m=>m.id===id

        );

        if(!mission)return;

        if(mission.completed)return;

        mission.progress+=value;

        if(mission.progress>mission.goal){

            mission.progress=mission.goal;

        }

        this.save();

        this.render();

    },

    setProgress(id,value){

        const mission=this.data.find(

            m=>m.id===id

        );

        if(!mission)return;

        mission.progress=value;

        if(mission.progress>mission.goal){

            mission.progress=mission.goal;

        }

        this.save();

        this.render();

    },

/*=========================================================
AUTO MISSIONS
=========================================================*/

    checkXP(){

        const mission=this.data.find(

            m=>m.id===4

        );

        if(!mission)return;

        mission.progress=Math.min(

            Stats.data.xp,

            mission.goal

        );

    },

    checkMasterMission(){

        const master=this.data.find(

            m=>m.id===5

        );

        if(!master)return;

        const completed=this.data.filter(

            m=>m.id!==5 && m.completed

        ).length;

        master.progress=completed;

    },

/*=========================================================
SUMMARY
=========================================================*/

    updateSummary(){

        this.checkXP();

        this.checkMasterMission();

        const completed=this.data.filter(

            m=>m.completed

        ).length;

        if(this.ui.completed){

            this.ui.completed.textContent=completed;

        }

        if(this.ui.total){

            this.ui.total.textContent=this.data.length;

        }

        if(this.ui.progress){

            this.ui.progress.style.width=

                `${completed/this.data.length*100}%`;

        }

    },

    /*=========================================================
LOCAL STORAGE
=========================================================*/

    save(){

        localStorage.setItem(

            "magnopvs_missions",

            JSON.stringify(this.data)

        );

    },

    load(){

        const save=localStorage.getItem(

            "magnopvs_missions"

        );

        if(save){

            const stored=JSON.parse(save);

            this.data=this.data.map(defaultMission=>{

                const savedMission=stored.find(

                    m=>m.id===defaultMission.id

                );

                return savedMission
                    ? {...defaultMission,...savedMission}
                    : defaultMission;

            });

        }

        this.render();

    },

/*=========================================================
NOTIFICATIONS
=========================================================*/

    notify(message){

        const toast=document.createElement("div");

        toast.className="mission-toast";

        toast.textContent=message;

        document.body.appendChild(toast);

        requestAnimationFrame(()=>{

            toast.classList.add("show");

        });

        setTimeout(()=>{

            toast.classList.remove("show");

            setTimeout(()=>{

                toast.remove();

            },400);

        },2500);

    },

/*=========================================================
RESET
=========================================================*/

    reset(){

        this.data.forEach(mission=>{

            mission.completed=false;

            mission.progress=0;

        });

        this.save();

        this.render();

    },

/*=========================================================
HELPERS
=========================================================*/

    getCompleted(){

        return this.data.filter(

            mission=>mission.completed

        ).length;

    },

    getPending(){

        return this.data.filter(

            mission=>!mission.completed

        );

    },

    getMission(id){

        return this.data.find(

            mission=>mission.id===id

        );

    }

};

/*=========================================================
AUTO START
=========================================================*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        Missions.init();

        Missions.load();

        /*-------------------------------------
        DEMO
        Descomenta para pruebas
        --------------------------------------*/

        // Missions.progress(1);
        // Missions.progress(2);
        // Missions.progress(3);
        // Missions.progress(4,500);

    }

);