/* =========================================================
MAGNOPVS LINKTREE
COSMIC PORTAL ENGINE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const body = document.body;

    const bootScreen = document.getElementById("boot-screen");

    const bootText = document.getElementById("boot-text");

    const progress = document.getElementById("progress");



    /* =========================================================
    BOOT SEQUENCE
    ========================================================= */

    const sequence = [

        {
            text: "INITIALIZING PORTAL...",
            value: 20,
            time: 500
        },

        {
            text: "CONNECTING COSMOS...",
            value: 45,
            time: 600
        },

        {
            text: "LOCATING MAGNOPVS...",
            value: 70,
            time: 700
        },

        {
            text: "PORTAL STABLE...",
            value: 90,
            time: 500
        },

        {
            text: "WELCOME TRAVELER.",
            value: 100,
            time: 800
        }

    ];



    /* =========================================================
    START PORTAL
    ========================================================= */

    async function startPortal() {

        for (let step of sequence) {

            bootText.innerHTML = step.text;

            progress.style.width = step.value + "%";

            await delay(step.time);

        }

        bootScreen.style.opacity = "0";

        await delay(800);

        bootScreen.style.display = "none";

        body.style.opacity = "1";

        animateEntrance();

    }



    /* =========================================================
    UTILITY
    ========================================================= */

    function delay(ms) {

        return new Promise(resolve => setTimeout(resolve, ms));

    }



    /* =========================================================
    ENTRANCE ANIMATION
    ========================================================= */

    function animateEntrance() {

        const elements = document.querySelectorAll(

            ".logo-area, .intro, .portal-btn, footer"

        );

        elements.forEach((element, index) => {

            element.style.opacity = "0";

            element.style.transform = "translateY(30px)";

            setTimeout(() => {

                element.style.transition = "all .8s ease";

                element.style.opacity = "1";

                element.style.transform = "translateY(0)";

            }, index * 120);

        });

    }



    /* =========================================================
    BUTTON EFFECT
    ========================================================= */

    const buttons = document.querySelectorAll(".portal-btn");

    buttons.forEach(button => {

        button.addEventListener("mouseenter", () => {

            button.style.filter = "brightness(1.3)";

        });

        button.addEventListener("mouseleave", () => {

            button.style.filter = "brightness(1)";

        });

    });



    /* =========================================================
    PORTAL NAVIGATION
    ========================================================= */

    buttons.forEach(button => {

        button.addEventListener("click", async (event) => {

            const destination = button.href;

            if (!destination || destination === "#") {
                return;
            }

            event.preventDefault();

            await openPortal(destination);

        });

    });



    /* =========================================================
    PORTAL TRANSITION
    ========================================================= */

    async function openPortal(destination) {

        document.body.style.transition = "all 1.2s ease";

        document.body.style.filter = "brightness(5) blur(20px)";

        document.body.style.opacity = "0";

        await delay(1200);

        window.location.href = destination;

    }



    /* =========================================================
    START
    ========================================================= */

    startPortal();

});