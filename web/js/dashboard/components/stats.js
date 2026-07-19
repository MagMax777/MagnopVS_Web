/*=========================================================
MAGNOPVS
STATS SYSTEM
=========================================================*/

const Stats={

    data:{

        /*=========================
        NIVEL
        =========================*/

        level:1,

        xp:0,

        xpNext:100,

        prestige:0,

        /*=========================
        RECURSOS
        =========================*/

        hp:100,
        hpMax:100,

        mp:100,
        mpMax:100,

        energy:100,
        energyMax:100,

        stamina:100,
        staminaMax:100,

        shield:0,

        /*=========================
        ATRIBUTOS
        =========================*/

        strength:10,

        intelligence:10,

        charisma:10,

        dexterity:10,

        brilliance:10,

        luck:10,

        wisdom:10,

        constitution:10,

        perception:10,

        discipline:10,

        creativity:10,

        spirituality:10,

        leadership:10,

        /*=========================
        ESTADOS
        =========================*/

        mood:"Neutral",

        alignment:"Balance",

        online:true

    },

    ui:{},

    /*=========================================================
    INIT
    =========================================================*/

    init(){

        this.cache();

        this.render();

    },

    /*=========================================================
    CACHE
    =========================================================*/

    cache(){

        this.ui.level=document.querySelector("#statLevel");

        this.ui.xp=document.querySelector("#statXP");

        this.ui.hp=document.querySelector("#statHP");

        this.ui.mp=document.querySelector("#statMP");

        this.ui.energy=document.querySelector("#statEnergy");

        this.ui.stamina=document.querySelector("#statStamina");

        this.ui.hpBar=document.querySelector("#hpBar");

        this.ui.mpBar=document.querySelector("#mpBar");

        this.ui.energyBar=document.querySelector("#energyBar");

        this.ui.staminaBar=document.querySelector("#staminaBar");

        this.ui.strength=document.querySelector("#strength");

        this.ui.intelligence=document.querySelector("#intelligence");

        this.ui.charisma=document.querySelector("#charisma");

        this.ui.dexterity=document.querySelector("#dexterity");

        this.ui.brilliance=document.querySelector("#brilliance");

        this.ui.luck=document.querySelector("#luck");

        this.ui.wisdom=document.querySelector("#wisdom");

        this.ui.constitution=document.querySelector("#constitution");

        this.ui.perception=document.querySelector("#perception");

        this.ui.discipline=document.querySelector("#discipline");

        this.ui.creativity=document.querySelector("#creativity");

        this.ui.spirituality=document.querySelector("#spirituality");

        this.ui.leadership=document.querySelector("#leadership");

    },

    /*=========================================================
    RENDER
    =========================================================*/

    render(){

        this.updateGeneral();

        this.updateBars();

        this.updateAttributes();

    },
    
        /*=========================================================
    GENERAL
    =========================================================*/

    updateGeneral(){

        if(this.ui.level)
            this.ui.level.textContent=this.data.level;

        if(this.ui.xp)
            this.ui.xp.textContent=
                `${this.data.xp} / ${this.data.xpNext}`;

        if(this.ui.hp)
            this.ui.hp.textContent=
                `${this.data.hp} / ${this.data.hpMax}`;

        if(this.ui.mp)
            this.ui.mp.textContent=
                `${this.data.mp} / ${this.data.mpMax}`;

        if(this.ui.energy)
            this.ui.energy.textContent=
                `${this.data.energy} / ${this.data.energyMax}`;

        if(this.ui.stamina)
            this.ui.stamina.textContent=
                `${this.data.stamina} / ${this.data.staminaMax}`;

    },

    /*=========================================================
    BARS
    =========================================================*/

    updateBars(){

        this.setBar(
            this.ui.hpBar,
            this.data.hp,
            this.data.hpMax
        );

        this.setBar(
            this.ui.mpBar,
            this.data.mp,
            this.data.mpMax
        );

        this.setBar(
            this.ui.energyBar,
            this.data.energy,
            this.data.energyMax
        );

        this.setBar(
            this.ui.staminaBar,
            this.data.stamina,
            this.data.staminaMax
        );

    },

    setBar(bar,current,max){

        if(!bar)return;

        const percent=Math.max(
            0,
            Math.min(
                100,
                (current/max)*100
            )
        );

        bar.style.width=percent+"%";

        if(percent>70){

            bar.className="bar-fill good";

        }else if(percent>35){

            bar.className="bar-fill medium";

        }else{

            bar.className="bar-fill low";

        }

    },

    /*=========================================================
    ATTRIBUTES
    =========================================================*/

    updateAttributes(){

        this.setValue(this.ui.strength,this.data.strength);

        this.setValue(this.ui.intelligence,this.data.intelligence);

        this.setValue(this.ui.charisma,this.data.charisma);

        this.setValue(this.ui.dexterity,this.data.dexterity);

        this.setValue(this.ui.brilliance,this.data.brilliance);

        this.setValue(this.ui.luck,this.data.luck);

        this.setValue(this.ui.wisdom,this.data.wisdom);

        this.setValue(this.ui.constitution,this.data.constitution);

        this.setValue(this.ui.perception,this.data.perception);

        this.setValue(this.ui.discipline,this.data.discipline);

        this.setValue(this.ui.creativity,this.data.creativity);

        this.setValue(this.ui.spirituality,this.data.spirituality);

        this.setValue(this.ui.leadership,this.data.leadership);

    },

    setValue(node,value){

        if(node){

            node.textContent=value;

        }

    },

    /*=========================================================
    EXPERIENCE
    =========================================================*/

    addXP(amount){

        this.data.xp+=amount;

        while(this.data.xp>=this.data.xpNext){

            this.data.xp-=this.data.xpNext;

            this.levelUp();

        }

        this.render();

    },

    levelUp(){

        this.data.level++;

        this.data.xpNext=Math.floor(
            this.data.xpNext*1.25
        );

        this.data.hpMax+=10;

        this.data.mpMax+=8;

        this.data.energyMax+=5;

        this.data.staminaMax+=5;

        this.data.hp=this.data.hpMax;

        this.data.mp=this.data.mpMax;

        this.data.energy=this.data.energyMax;

        this.data.stamina=this.data.staminaMax;

        this.data.strength++;

        this.data.intelligence++;

        this.data.charisma++;

        this.data.dexterity++;

        this.data.brilliance++;

    },

        /*=========================================================
    HEALTH
    =========================================================*/

    damage(amount){

        this.data.hp-=amount;

        if(this.data.hp<0){

            this.data.hp=0;

        }

        this.render();

    },

    heal(amount){

        this.data.hp+=amount;

        if(this.data.hp>this.data.hpMax){

            this.data.hp=this.data.hpMax;

        }

        this.render();

    },

    /*=========================================================
    MANA
    =========================================================*/

    useMana(amount){

        this.data.mp-=amount;

        if(this.data.mp<0){

            this.data.mp=0;

        }

        this.render();

    },

    restoreMana(amount){

        this.data.mp+=amount;

        if(this.data.mp>this.data.mpMax){

            this.data.mp=this.data.mpMax;

        }

        this.render();

    },

    /*=========================================================
    ENERGY
    =========================================================*/

    consumeEnergy(amount){

        this.data.energy-=amount;

        if(this.data.energy<0){

            this.data.energy=0;

        }

        this.render();

    },

    restoreEnergy(amount){

        this.data.energy+=amount;

        if(this.data.energy>this.data.energyMax){

            this.data.energy=this.data.energyMax;

        }

        this.render();

    },

    /*=========================================================
    STAMINA
    =========================================================*/

    consumeStamina(amount){

        this.data.stamina-=amount;

        if(this.data.stamina<0){

            this.data.stamina=0;

        }

        this.render();

    },

    restoreStamina(amount){

        this.data.stamina+=amount;

        if(this.data.stamina>this.data.staminaMax){

            this.data.stamina=this.data.staminaMax;

        }

        this.render();

    },

    /*=========================================================
    SAVE
    =========================================================*/

    save(){

        localStorage.setItem(

            "magnopvs_stats",

            JSON.stringify(this.data)

        );

    },

    load(){

        const save=localStorage.getItem(

            "magnopvs_stats"

        );

        if(save){

            this.data={

                ...this.data,

                ...JSON.parse(save)

            };

        }

        this.render();

    }

};

/*=========================================================
AUTO SAVE
=========================================================*/

window.addEventListener(

    "beforeunload",

    ()=>{

        Stats.save();

    }

);

/*=========================================================
START
=========================================================*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        Stats.init();

        Stats.load();

        /* Demo */

        // Stats.addXP(40);
        // Stats.damage(15);
        // Stats.useMana(10);

    }

);