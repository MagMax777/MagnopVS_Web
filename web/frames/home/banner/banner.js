document.addEventListener("DOMContentLoaded", () => {

    const video = document.getElementById("introVideo");
    const overlay = document.getElementById("videoOverlay");
    const playButton = document.getElementById("playTrailer");

    if (!video || !overlay || !playButton) return;

    //----------------------------------------------------
    // Configuración inicial
    //----------------------------------------------------

    video.pause();

    video.currentTime = 0;

    video.controls = false;

    video.autoplay = false;

    video.loop = false;

    video.muted = true;

    //----------------------------------------------------
    // Reproducir trailer
    //----------------------------------------------------

    playButton.addEventListener("click", async () => {

        overlay.classList.add("hidden");

        video.controls = true;

        video.muted = false;

        video.volume = 1;

        try{

            await video.play();

        }

        catch(err){

            console.error(err);

            alert(
                "Tu navegador bloqueó la reproducción con sonido.\n\nPulsa el botón Play del reproductor para comenzar."
            );

            video.controls = true;

        }

    });

    //----------------------------------------------------
    // Reiniciar al finalizar
    //----------------------------------------------------

    video.addEventListener("ended",()=>{

        overlay.classList.remove("hidden");

        video.controls = false;

        video.currentTime = 0;

        video.muted = true;

    });

});