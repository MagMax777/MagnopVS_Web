/*=========================================================
INVENTORY SYSTEM
MagnopVS
=========================================================*/

const Inventory={

    items:[

        {
            id:1,
            name:"MagnoCard Genesis",
            type:"card",
            rarity:"legendary",
            icon:"🃏",
            quantity:1,
            description:"La primera carta del Cosmos."
        },

        {
            id:2,
            name:"MagnoKey",
            type:"key",
            rarity:"rare",
            icon:"🗝️",
            quantity:3,
            description:"Abre portales y contenido oculto."
        },

        {
            id:3,
            name:"MicroCoin",
            type:"currency",
            rarity:"common",
            icon:"🪙",
            quantity:250,
            description:"Moneda básica del universo."
        },

        {
            id:4,
            name:"MagnoEgg",
            type:"egg",
            rarity:"epic",
            icon:"🥚",
            quantity:1,
            description:"Contiene un MagFam desconocido."
        },

        {
            id:5,
            name:"Fragmento Cuántico",
            type:"material",
            rarity:"rare",
            icon:"💠",
            quantity:18,
            description:"Material para fabricar artefactos."
        },

        {
            id:6,
            name:"Cristal AION",
            type:"crystal",
            rarity:"legendary",
            icon:"🔷",
            quantity:2,
            description:"Fuente de energía cósmica."
        }

    ],

    ui:{},

    init(){

        this.ui.grid=document.getElementById("inventoryGrid");

        this.ui.total=document.getElementById("inventoryTotal");

        this.ui.legendary=document.getElementById("inventoryLegendary");

        this.ui.filter=document.getElementById("inventoryFilter");

        this.render();

        this.bindEvents();

    },

/*=========================================================
RENDER
=========================================================*/

    render(list=this.items){

        if(!this.ui.grid)return;

        this.ui.grid.innerHTML="";

        list.forEach(item=>{

            const card=document.createElement("div");

            card.className=`inventory-card ${item.rarity}`;

            card.innerHTML=`

                <div class="inventory-icon">

                    ${item.icon}

                </div>

                <h3>

                    ${item.name}

                </h3>

                <p>

                    ${item.description}

                </p>

                <div class="inventory-footer">

                    <span>

                        x${item.quantity}

                    </span>

                    <span class="rarity">

                        ${item.rarity.toUpperCase()}

                    </span>

                </div>

            `;

            this.ui.grid.appendChild(card);

        });

        this.updateStats();

    },

    /*=========================================================
FILTERS
=========================================================*/

    bindEvents(){

        if(this.ui.filter){

            this.ui.filter.addEventListener(

                "change",

                e=>{

                    this.filter(

                        e.target.value

                    );

                }

            );

        }

        const search=document.getElementById(

            "inventorySearch"

        );

        if(search){

            search.addEventListener(

                "input",

                e=>{

                    this.search(

                        e.target.value

                    );

                }

            );

        }

    },

    filter(type){

        if(type==="all"){

            this.render();

            return;

        }

        const filtered=this.items.filter(

            item=>item.type===type

        );

        this.render(filtered);

    },

    search(text){

        text=text.toLowerCase();

        const filtered=this.items.filter(item=>

            item.name.toLowerCase().includes(text) ||

            item.description.toLowerCase().includes(text)

        );

        this.render(filtered);

    },

/*=========================================================
ITEM MANAGEMENT
=========================================================*/

    addItem(item){

        const existing=this.items.find(

            i=>i.id===item.id

        );

        if(existing){

            existing.quantity+=item.quantity;

        }else{

            this.items.push(item);

        }

        this.save();

        this.render();

        this.toast(

            `+ ${item.quantity} ${item.name}`

        );

    },

    removeItem(id,amount=1){

        const item=this.items.find(

            i=>i.id===id

        );

        if(!item)return;

        item.quantity-=amount;

        if(item.quantity<=0){

            this.items=this.items.filter(

                i=>i.id!==id

            );

        }

        this.save();

        this.render();

    },

    useItem(id){

        const item=this.items.find(

            i=>i.id===id

        );

        if(!item)return;

        if(item.quantity<=0)return;

        item.quantity--;

        this.toast(

            `${item.icon} ${item.name} usado`

        );

        this.save();

        this.render();

    },

/*=========================================================
STATS
=========================================================*/

    updateStats(){

        if(this.ui.total){

            this.ui.total.textContent=

                this.items.reduce(

                    (a,b)=>a+b.quantity,

                    0

                );

        }

        if(this.ui.legendary){

            this.ui.legendary.textContent=

                this.items.filter(

                    i=>i.rarity==="legendary"

                ).length;

        }

    },

    /*=========================================================
LOCAL STORAGE
=========================================================*/

    save(){

        localStorage.setItem(

            "magnopvs_inventory",

            JSON.stringify(this.items)

        );

    },

    load(){

        const save=localStorage.getItem(

            "magnopvs_inventory"

        );

        if(save){

            this.items=JSON.parse(save);

        }

        this.render();

    },

/*=========================================================
IMPORT / EXPORT
=========================================================*/

    export(){

        return JSON.stringify(

            this.items,

            null,

            2

        );

    },

    import(json){

        try{

            this.items=JSON.parse(json);

            this.save();

            this.render();

            this.toast(

                "Inventario importado."

            );

        }catch(e){

            console.error(e);

        }

    },

/*=========================================================
LOOT SYSTEM
=========================================================*/

    randomLoot(){

        const pool=[

            {

                id:100,

                name:"MicroCoin",

                type:"currency",

                rarity:"common",

                icon:"🪙",

                quantity:Math.floor(

                    Math.random()*100

                )+10,

                description:"Moneda básica."

            },

            {

                id:101,

                name:"Fragmento AION",

                type:"material",

                rarity:"rare",

                icon:"💎",

                quantity:1,

                description:"Material energético."

            },

            {

                id:102,

                name:"MagnoKey",

                type:"key",

                rarity:"epic",

                icon:"🗝️",

                quantity:1,

                description:"Llave dimensional."

            },

            {

                id:103,

                name:"MagnoEgg",

                type:"egg",

                rarity:"legendary",

                icon:"🥚",

                quantity:1,

                description:"Contiene un MagFam."

            }

        ];

        const reward=

            pool[

                Math.floor(

                    Math.random()*pool.length

                )

            ];

        this.addItem(

            structuredClone(reward)

        );

    },

/*=========================================================
TOAST
=========================================================*/

    toast(message){

        const toast=document.createElement("div");

        toast.className="inventory-toast";

        toast.textContent=message;

        document.body.appendChild(toast);

        requestAnimationFrame(()=>{

            toast.classList.add(

                "show"

            );

        });

        setTimeout(()=>{

            toast.classList.remove(

                "show"

            );

            setTimeout(()=>{

                toast.remove();

            },300);

        },2200);

    },

/*=========================================================
RESET
=========================================================*/

    reset(){

        localStorage.removeItem(

            "magnopvs_inventory"

        );

        location.reload();

    }

};

/*=========================================================
AUTO START
=========================================================*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        Inventory.init();

        Inventory.load();

        /*---------------------------------------
        DEMO
        ----------------------------------------*/

        // Inventory.randomLoot();

    }

);