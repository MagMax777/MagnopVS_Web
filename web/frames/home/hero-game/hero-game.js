const dialogUI=document.getElementById("dialog-ui");

const portrait=document.getElementById("portrait-img");
/*=========================================================
MAGNOPVS HERO GAME
VERSIÓN 2.0
=========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    Dialog.start();

    /*=====================================================
    ELEMENTOS
    =====================================================*/

    const egg = document.getElementById("egg");
    const crack = document.getElementById("egg-crack");
    const rabbit = document.getElementById("rabbit");
    const adult = document.getElementById("adult");

    const carrot = document.getElementById("carrot");

    const dialogBox = document.getElementById("dialog-box");
    const dialogName = document.getElementById("dialog-name");
    const dialogText = document.getElementById("dialog-text");

    const characters = [
        egg,
        crack,
        rabbit,
        adult
    ];

    /*=====================================================
    ESTADO DEL JUEGO
    =====================================================*/

    const GAME = {

        stage:0,

        dragging:false,

        evolved:false

    };

    /*=====================================================
    DIALOGOS
    =====================================================*/

    function typeWriter(name,text,next){

        dialogUI.classList.add("show");

        dialogName.textContent=name;

        dialogText.textContent="";

        "???",

        "Algo está despertando dentro del Portal..."
       
        ()=>{

                GAME.stage=0;

            }


    let i=0;

    function write(){

        if(i<text.length){

            dialogText.textContent+=text.charAt(i);

            i++;

            setTimeout(write,25);

        }

        else{

            dialogUI.onclick=()=>{

                dialogUI.onclick=null;

                if(next)next();

            };

        }

    }

    write();

}

    function hideDialog(){

    dialogUI.classList.remove("show");

}
    /*=====================================================
    PERSONAJES
    =====================================================*/

    function hideCharacters(){

        characters.forEach(character=>{

            character.classList.remove("active");

        });

    }

    function show(character){

        hideCharacters();

        character.classList.add("active");

    }

    /*=====================================================
    INICIO
    =====================================================*/

    show(egg);

    carrot.classList.remove("active");

    say(
        "???",
        "Algo está despertando dentro del Portal..."
    );

    /*=====================================================
    ETAPA 1
    =====================================================*/
    
    egg.addEventListener("click",()=>{
        if(GAME.stage!==0)return;

        GAME.stage=1;
        show(crack);
    });

    /*=====================================================
    ETAPA 2
    =====================================================*/

    crack.addEventListener("click",()=>{

        if(GAME.stage!==1)return;

        GAME.stage=2;

        show(rabbit);

        carrot.classList.add("active");

        typeWriter(

            "Conejo Blanco Cósmico",

            "¡Hola! Tengo muchísima hambre... ¿Podrías acercarme esa zanahoria?"

        );

    });

    /*=====================================================
    DRAG
    =====================================================*/

    carrot.addEventListener("mousedown",()=>{

        if(GAME.stage!==2)return;

        GAME.dragging=true;

    });

    document.addEventListener("mouseup",()=>{

        GAME.dragging=false;

    });

    document.addEventListener("mousemove",(event)=>{

        if(!GAME.dragging)return;

        carrot.style.left=

        event.clientX-

        carrot.offsetWidth/2+

        "px";

        carrot.style.top=

        event.clientY-

        carrot.offsetHeight/2+

        "px";

    });

    /*=====================================================
    SOLTAR
    =====================================================*/

    document.addEventListener("mouseup",()=>{

        if(GAME.stage!==2)return;

        const rabbitRect=

        rabbit.getBoundingClientRect();

        const carrotRect=

        carrot.getBoundingClientRect();

        const dx=

        rabbitRect.left+

        rabbitRect.width/2-

        (

        carrotRect.left+

        carrotRect.width/2

        );

        const dy=

        rabbitRect.top+

        rabbitRect.height/2-

        (

        carrotRect.top+

        carrotRect.height/2

        );

        const distance=

        Math.sqrt(

            dx*dx+

            dy*dy

        );

        if(distance<120){

            evolve();

        }

    });

    /*=====================================================
    EVOLUCION
    =====================================================*/
function evolve(){

    if(GAME.evolved)return;

    GAME.evolved=true;

    GAME.stage=3;

    const portal=document.querySelector(".portal");

    portal.classList.add("flash");

    rabbit.classList.add("evolving");

    rabbit.classList.add("glow");

    setTimeout(()=>{

        carrot.classList.remove("active");

        show(adult);

        adult.classList.add("glow");

        typeWriter(

            "CBC",

            "¡¡Gracias!! Ahora mi energía ha despertado. Soy el Conejo Blanco Cósmico."

        );

    },700);

}

});