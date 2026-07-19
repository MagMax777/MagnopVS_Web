/*=========================================================
MagnopVS
FIREBASE AUTH
=========================================================*/

import {
    auth
} from "../../config/firebase/firebase-config.js";

import {
    supabase
} from "../../config/supabase/supabase-config.js";
import {

    createUserWithEmailAndPassword,

    signInWithEmailAndPassword,

    updateProfile,

    GoogleAuthProvider,

    signInWithPopup,

    sendPasswordResetEmail

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

console.log("🔥 Firebase Auth cargado correctamente");

/*=========================================================
REGISTER
=========================================================*/

document.addEventListener(
    "magnopvs:register",
    async (event)=>{

        const ui = window.RegisterUI;

        ui.showLoading();

        try{

            const {

                name,

                username,

                email,

                password,

                newsletter

            } = event.detail;

            //-------------------------------------------------
            // FIREBASE
            //-------------------------------------------------

            const credential =
                await createUserWithEmailAndPassword(

                    auth,

                    email,

                    password

                );

            const user = credential.user;

            //-------------------------------------------------
            // DISPLAY NAME
            //-------------------------------------------------

            await updateProfile(

                user,

                {

                    displayName:name

                }

            );

            //-------------------------------------------------
            // SUPABASE PROFILE
            //-------------------------------------------------

            const { error } = await supabase

                .from("profiles")

             .insert({

                uid: user.uid,

                full_name: name,

                username: username,

                email: email,

                newsletter: newsletter

            });

         if (error) {

             throw error;

         }

            ui.hideLoading();

            ui.showToast(

                "¡Bienvenido a MagnopVS!"

            );

            ui.clearRegisterForm();

            setTimeout(()=>{

                window.location.href = "../../../frames/profile/dashboard.html";

            },1500);

        }

        catch(error){

            ui.hideLoading();

            console.error(error);

            ui.showToast(

                error.message,

                "error"

            );

        }

    }

);


/*=========================================================
LOGIN
=========================================================*/

document.addEventListener(

    "magnopvs:login",

    async(event)=>{

        const ui=window.RegisterUI;

        ui.showLoading();

        try{

            const{

                email,

                password

            }=event.detail;

            await signInWithEmailAndPassword(

                auth,

                email,

                password

            );

            ui.hideLoading();

            ui.showToast(

                "Bienvenido nuevamente"

            );

            setTimeout(()=>{

                window.location.href = "../../../frames/profile/dashboard.html";

            },1000);

        }

        catch(error){

            ui.hideLoading();

            ui.showToast(

                error.message,

                "error"

            );

        }

    }

);


/*=========================================================
GOOGLE
=========================================================*/

document.addEventListener(

    "magnopvs:google",

    async()=>{

        const ui=window.RegisterUI;

        ui.showLoading();

        try{

            const provider=

                new GoogleAuthProvider();

            await signInWithPopup(

                auth,

                provider

            );

            ui.hideLoading();

            window.location.href = "../../../frames/profile/dashboard.html";

        }

        catch(error){

            ui.hideLoading();

            ui.showToast(

                error.message,

                "error"

            );

        }

    }

);


/*=========================================================
RESET PASSWORD
=========================================================*/

document.addEventListener(

    "magnopvs:forgot-password",

    async(event)=>{

        const ui=window.RegisterUI;

        ui.showLoading();

        try{

            await sendPasswordResetEmail(

                auth,

                event.detail.email

            );

            ui.hideLoading();

            ui.showToast(

                "Correo enviado"

            );

        }

        catch(error){

            ui.hideLoading();

            ui.showToast(

                error.message,

                "error"

            );

        }

    }

);


console.log(

    "%cFirebase Auth Ready",

    "color:#00FFD5;font-size:14px;font-weight:bold;"

);