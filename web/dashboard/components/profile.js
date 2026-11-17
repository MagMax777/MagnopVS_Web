/*=========================================================
PROFILE.JS
MagnopVS Dashboard
=========================================================*/

window.Profile = {

    /*=====================================================
    DATOS DEL JUGADOR
    =====================================================*/

    data:{

        uid:null,

        username:"",

        displayName:"",

        title:"",

        bio:"",

        avatar:"",

        banner:"",

        cover:"",

        level:1,

        xp:0,

        xpNext:100,

        rank:"Novato",

        alignment:"Neutral",

        house:"",

        faction:"",

        online:false,

        verified:false,

        premium:false,

        country:"",

        city:"",

        birthday:"",

        joinDate:"",

        lastLogin:"",

        followers:0,

        following:0,

        friends:0,

        reputation:0,

        victories:0,

        defeats:0,

        missionsCompleted:0,

        achievements:0,

        magnoPoints:0,

        microCoins:0,

        energy:100,

        vitality:100,

        power:100,

        mana:100

    },

    /*=====================================================
    ELEMENTOS HTML
    =====================================================*/

    ui:{},

    cache(){

        this.ui.avatar=document.querySelector("#profileAvatar");

        this.ui.banner=document.querySelector("#profileBanner");

        this.ui.cover=document.querySelector("#profileCover");

        this.ui.username=document.querySelector("#profileUsername");

        this.ui.displayName=document.querySelector("#profileDisplayName");

        this.ui.title=document.querySelector("#profileTitle");

        this.ui.bio=document.querySelector("#profileBio");

        this.ui.level=document.querySelector("#profileLevel");

        this.ui.rank=document.querySelector("#profileRank");

        this.ui.xp=document.querySelector("#profileXP");

        this.ui.xpBar=document.querySelector("#profileXPBar");

        this.ui.energy=document.querySelector("#profileEnergy");

        this.ui.vitality=document.querySelector("#profileVitality");

        this.ui.power=document.querySelector("#profilePower");

        this.ui.mana=document.querySelector("#profileMana");

        this.ui.followers=document.querySelector("#profileFollowers");

        this.ui.following=document.querySelector("#profileFollowing");

        this.ui.friends=document.querySelector("#profileFriends");

    },

    /*=====================================================
    INIT
    =====================================================*/

    init(){

        this.cache();

        this.render();

        console.log("PROFILE READY");

    },

        /*=====================================================
    RENDER
    =====================================================*/

    render(){

        const p=this.data;

        if(this.ui.avatar)
            this.ui.avatar.src=p.avatar;

        if(this.ui.banner)
            this.ui.banner.src=p.banner;

        if(this.ui.cover)
            this.ui.cover.src=p.cover;

        if(this.ui.username)
            this.ui.username.textContent="@"+p.username;

        if(this.ui.displayName)
            this.ui.displayName.textContent=p.displayName;

        if(this.ui.title)
            this.ui.title.textContent=p.title;

        if(this.ui.bio)
            this.ui.bio.textContent=p.bio;

        if(this.ui.level)
            this.ui.level.textContent="Lv "+p.level;

        if(this.ui.rank)
            this.ui.rank.textContent=p.rank;

        if(this.ui.followers)
            this.ui.followers.textContent=this.formatNumber(p.followers);

        if(this.ui.following)
            this.ui.following.textContent=this.formatNumber(p.following);

        if(this.ui.friends)
            this.ui.friends.textContent=this.formatNumber(p.friends);

        this.updateXP();

        this.updateBars();

    },

    /*=====================================================
    XP
    =====================================================*/

    updateXP(){

        if(!this.ui.xpBar) return;

        const percent=Math.min(
            100,
            (this.data.xp/this.data.xpNext)*100
        );

        this.ui.xpBar.style.width=percent+"%";

        if(this.ui.xp){

            this.ui.xp.textContent=
            this.data.xp+
            " / "+
            this.data.xpNext+
            " XP";

        }

    },

    /*=====================================================
    BARRAS
    =====================================================*/

    updateBars(){

        this.setBar(this.ui.energy,this.data.energy);

        this.setBar(this.ui.vitality,this.data.vitality);

        this.setBar(this.ui.power,this.data.power);

        this.setBar(this.ui.mana,this.data.mana);

    },

    setBar(element,value){

        if(!element) return;

        value=Math.max(
            0,
            Math.min(100,value)
        );

        element.style.width=value+"%";

        element.dataset.value=value;

    },

    /*=====================================================
    ACTUALIZAR PERFIL
    =====================================================*/

    update(data={}){

        Object.assign(this.data,data);

        this.render();

    },

    /*=====================================================
    SUMAR XP
    =====================================================*/

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

        this.showLevelAnimation();

    },

        /*=====================================================
    ANIMACIÓN LEVEL UP
    =====================================================*/

    showLevelAnimation(){

        document.body.classList.add("level-up");

        setTimeout(()=>{

            document.body.classList.remove("level-up");

        },1800);

        console.log("LEVEL UP!");

    },

    /*=====================================================
    ESTADO ONLINE
    =====================================================*/

    setOnline(status=true){

        this.data.online=status;

        document.body.classList.toggle(
            "user-online",
            status
        );

    },

    /*=====================================================
    FORMATO NUMÉRICO
    =====================================================*/

    formatNumber(value){

        return new Intl.NumberFormat("es-CO").format(value);

    },

    /*=====================================================
    CARGAR DESDE JSON / SUPABASE
    =====================================================*/

    load(profileData){

        if(!profileData) return;

        Object.assign(
            this.data,
            profileData
        );

        this.render();

    },

    /*=====================================================
    GUARDAR (PLACEHOLDER)
    =====================================================*/

    async save(){

        console.log(
            "Guardar perfil...",
            this.data
        );

        /*
        await supabase
            .from("profiles")
            .update(this.data)
            .eq("uid",this.data.uid);
        */

    },

    /*=====================================================
    CAMBIAR AVATAR
    =====================================================*/

    setAvatar(url){

        this.data.avatar=url;

        this.render();

    },

    /*=====================================================
    CAMBIAR BANNER
    =====================================================*/

    setBanner(url){

        this.data.banner=url;

        this.render();

    },

    /*=====================================================
    CAMBIAR BIO
    =====================================================*/

    setBio(text){

        this.data.bio=text;

        this.render();

    },

    /*=====================================================
    CAMBIAR TÍTULO
    =====================================================*/

    setTitle(title){

        this.data.title=title;

        this.render();

    },

    /*=====================================================
    REFRESCAR
    =====================================================*/

    refresh(){

        this.render();

    }

};

/*=========================================================
AUTO INIT
=========================================================*/

document.addEventListener(
    "DOMContentLoaded",
    ()=>{

        Profile.init();

    }
);