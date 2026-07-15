const Dialog = (() => {

    const story = [

        "En el principio no existían héroes.",

        "Solo existía un océano infinito de posibilidades...",

        "Hasta que apareció el primer MagnoEgg.",

        "Pero este huevo no podía abrirse por sí solo.",

        "Necesitaba a un Explorador.",

        "Quizá seas tú..."

    ];

    let index = 0;

    const ui = document.getElementById("dialog-ui");
    const text = document.getElementById("dialog-text");
    const name = document.getElementById("dialog-name");
    const input = document.getElementById("dialog-answer");
    const button = document.getElementById("dialog-send");

    function start(){

        ui.classList.add("show");

        name.innerText="Narrador";

        text.innerText=story[0];

        button.innerText="Continuar";

    }

    function next(){

        index++;

        if(index<story.length){

            text.innerText=story[index];

            return;

        }

        question();

    }

    function question(){

        name.innerText="El Huevo Cósmico";

        text.innerHTML="Escribe la palabra <b>MAGNOEGG</b> para demostrar que descubriste el primer secreto.";

        input.style.display="block";

        input.value="";

        button.innerText="Descubrir";

        button.onclick=check;

    }

    function check(){

        if(input.value.trim().toUpperCase()=="MAGNOEGG"){

            ui.classList.remove("show");

            document.dispatchEvent(

                new Event("eggUnlocked")

            );

        }

        else{

            text.innerHTML="La energía del huevo permanece dormida...";

        }

    }

    button.onclick=next;

    return{

        start

    };

})();
