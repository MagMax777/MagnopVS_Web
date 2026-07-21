/*=========================================================
MAGNOPVS
PLAYER DASHBOARD
dashboard.js
PARTE 1/3
=========================================================*/

"use strict";

/*=========================================================
IMPORTS
=========================================================*/

import ProfileService from "../../js/services/profile/profile.service.js";

/*=========================================================
DASHBOARD
=========================================================*/

const Dashboard={

/*=========================================================
STATE
=========================================================*/

profile:null,

initialized:false,

/*=========================================================
INIT
=========================================================*/

async init(){

    if(this.initialized){

        return;

    }

    console.log(

        "%cInicializando Dashboard...",

        "color:#00FFD5;font-weight:bold;"

    );

    await this.loadProfile();

    this.cacheElements();

    this.bindEvents();

    this.startAnimations();

    this.initialized=true;

},

/*=========================================================
LOAD PROFILE
=========================================================*/

async loadProfile(){

    try{

        this.profile=

            await ProfileService.load();

        if(!this.profile){

            window.location.href=

            "../../auth/login/login.html";

            return;

        }

        console.log(

            "Perfil cargado:",

            this.profile

        );

    }

    catch(error){

        console.error(error);

    }

},

/*=========================================================
CACHE DOM
=========================================================*/

cacheElements(){

    this.$={

        editProfile:

            document.getElementById(

                "editProfile"

            ),

        continueAdventure:

            document.getElementById(

                "continueAdventure"

            ),

        shareProfile:

            document.getElementById(

                "shareProfile"

            ),

        talkSofia:

            document.getElementById(

                "talkSofia"

            ),

        dailyMission:

            document.getElementById(

                "dailyMission"

            ),

        btnAtlas:

            document.getElementById(

                "btnAtlas"

            ),

        btnMarketplace:

            document.getElementById(

                "btnMarketplace"

            ),

        btnInventory:

            document.getElementById(

                "btnInventory"

            ),

        btnCommunity:

            document.getElementById(

                "btnCommunity"

            ),

        btnSkills:

            document.getElementById(

                "btnSkills"

            ),

        btnEvents:

            document.getElementById(

                "btnEvents"

            )

    };

},

/*=========================================================
EVENTS
=========================================================*/

bindEvents(){

    if(

        this.$.continueAdventure

    ){

        this.$.continueAdventure

        .addEventListener(

            "click",

            ()=>this.openAdventure()

        );

    }

    if(

        this.$.editProfile

    ){

        this.$.editProfile

        .addEventListener(

            "click",

            ()=>this.openEditor()

        );

    }

    if(

        this.$.shareProfile

    ){

        this.$.shareProfile

        .addEventListener(

            "click",

            ()=>this.share()

        );

    }

},

/*=========================================================
CONTINUE ADVENTURE
=========================================================*/

openAdventure(){

    console.log("▶ Continuar aventura");

    window.location.href=

    "../quantvm-matrix/quantvm-matrix.html";

},

/*=========================================================
PROFILE EDITOR
=========================================================*/

openEditor(){

    console.log("✏ Editor de Perfil");

    document.dispatchEvent(

        new CustomEvent(

            "magnopvs:open-profile-editor"

        )

    );

},

/*=========================================================
SHARE PROFILE
=========================================================*/

async share(){

    const url=

        window.location.origin+

        "/player/"+

        ProfileService.username;

    if(

        navigator.share

    ){

        try{

            await navigator.share({

                title:

                "Mi Perfil MagnopVS",

                text:

                "Mira mi perfil en MagnopVS",

                url

            });

        }

        catch(error){

            console.error(error);

        }

        return;

    }

    await navigator.clipboard.writeText(

        url

    );

    console.log(

        "Perfil copiado"

    );

},

/*=========================================================
SOF.IA
=========================================================*/

talkSofia(){

    console.log(

        "Sof.IA"

    );

    document.dispatchEvent(

        new CustomEvent(

            "magnopvs:open-sofia"

        )

    );

},

/*=========================================================
OPEN MODULE
=========================================================*/

openModule(module){

    console.log(

        "Abrir:",

        module

    );

    switch(module){

        case "atlas":

            window.location.href=

            "../atlas/atlas.html";

        break;

        case "inventory":

            window.location.href=

            "../inventory/inventory.html";

        break;

        case "skills":

            window.location.href=

            "../skills/skills.html";

        break;

        case "community":

            window.location.href=

            "../community/community.html";

        break;

        case "marketplace":

            window.location.href=

            "../marketplace/marketplace.html";

        break;

        case "events":

            window.location.href=

            "../events/events.html";

        break;

    }

},

/*=========================================================
QUICK BUTTONS
=========================================================*/

enableQuickButtons(){

    const buttons=[

        [

            this.$.btnAtlas,

            "atlas"

        ],

        [

            this.$.btnInventory,

            "inventory"

        ],

        [

            this.$.btnMarketplace,

            "marketplace"

        ],

        [

            this.$.btnCommunity,

            "community"

        ],

        [

            this.$.btnSkills,

            "skills"

        ],

        [

            this.$.btnEvents,

            "events"

        ]

    ];

    buttons.forEach(

        ([button,module])=>{

            if(!button){

                return;

            }

            button.addEventListener(

                "click",

                ()=>this.openModule(module)

            );

        }

    );

},

/*=========================================================
PLAYER STATUS
=========================================================*/

updateStatus(message){

    const status=

        document.getElementById(

            "playerStatus"

        );

    if(status){

        status.textContent=

            message;

    }

},

/*=========================================================
WELCOME
=========================================================*/

showWelcome(){

    console.log(

        "Bienvenido",

        ProfileService.displayName

    );

},

/*=========================================================
ANIMATIONS
=========================================================*/

startAnimations(){

    this.animateCards();

    this.animateCounters();

    this.startClock();

},

/*=========================================================
CARDS
=========================================================*/

animateCards(){

    document

    .querySelectorAll(

        ".panel,.resource-card,.stat-card,.hero-badge"

    )

    .forEach((card,index)=>{

        card.animate(

        [

            {

                opacity:0,

                transform:

                "translateY(30px)"

            },

            {

                opacity:1,

                transform:

                "translateY(0px)"

            }

        ],

        {

            duration:600,

            delay:index*70,

            easing:"ease-out",

            fill:"forwards"

        });

    });

},

/*=========================================================
COUNTERS
=========================================================*/

animateCounters(){

    document

    .querySelectorAll(

        "[data-counter]"

    )

    .forEach(counter=>{

        const target=

            Number(

                counter.dataset.counter

            );

        let current=0;

        const step=

            Math.max(

                1,

                Math.ceil(target/50)

            );

        const timer=

        setInterval(()=>{

            current+=step;

            if(current>=target){

                current=target;

                clearInterval(timer);

            }

            counter.textContent=

                current.toLocaleString();

        },20);

    });

},

/*=========================================================
CLOCK
=========================================================*/

startClock(){

    const clock=

        document.getElementById(

            "dashboardClock"

        );

    if(!clock){

        return;

    }

    const update=()=>{

        const now=

            new Date();

        clock.textContent=

            now.toLocaleTimeString(

                [],

                {

                    hour:"2-digit",

                    minute:"2-digit"

                }

            );

    };

    update();

    setInterval(

        update,

        1000

    );

},

/*=========================================================
NOTIFICATION
=========================================================*/

notify(message){

    console.log(

        "[Dashboard]",

        message

    );

},

/*=========================================================
REFRESH
=========================================================*/

async refresh(){

    this.profile=

        await ProfileService.refresh();

    ProfileService.renderProfile();

},

/*=========================================================
LISTENERS
=========================================================*/

listen(){

    document.addEventListener(

        "magnopvs:profile-updated",

        ()=>{

            this.refresh();

        }

    );

    document.addEventListener(

        "magnopvs:logout",

        ()=>{

            ProfileService.logout();

        }

    );

},

/*=========================================================
START
=========================================================*/

async start(){

    await this.init();

    this.enableQuickButtons();

    this.showWelcome();

    this.listen();

},

/*=========================================================
BOOT
=========================================================*/

window.addEventListener(

    "DOMContentLoaded",

    async()=>{

        await Dashboard.start();

    }

);

/*=========================================================
EXPORT
=========================================================*/

export default Dashboard;

/*=========================================================
END
=========================================================*/

console.log(

    "%c✓ Dashboard Ready",

    "color:#00FFD5;font-size:15px;font-weight:bold;"

);