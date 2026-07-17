/*=========================================================
MagnopVS
REGISTER
=========================================================*/


/*=========================================================
ELEMENTS
=========================================================*/

const registerTab = document.getElementById("tab-register");
const loginTab = document.getElementById("tab-login");

const registerForm = document.getElementById("register-form");
const loginForm = document.getElementById("login-form");

const forgotPanel = document.getElementById("forgot-password-panel");

const forgotButton = document.getElementById("forgot-password-button");
const backButton = document.getElementById("back-to-login");

const loadingOverlay = document.getElementById("loading-overlay");

const toast = document.getElementById("toast");

const registerName = document.getElementById("register-name");

const avatarInitials = document.getElementById("avatar-initials");

const password = document.getElementById("register-password");

const confirmPassword = document.getElementById("register-confirm");

const strengthFill = document.getElementById("strength-fill");

const strengthText = document.getElementById("strength-text");


/*=========================================================
INITIALIZE
=========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    initTabs();

    initAvatar();

    initPasswordVisibility();

    initStrengthMeter();

    initForgotPassword();

});


/*=========================================================
TABS
=========================================================*/

function initTabs(){

    registerTab.addEventListener("click", showRegister);

    loginTab.addEventListener("click", showLogin);

}


function showRegister(){

    registerTab.classList.add("active");

    loginTab.classList.remove("active");

    registerForm.classList.remove("hidden");

    loginForm.classList.add("hidden");

    forgotPanel.classList.add("hidden");

}


function showLogin(){

    loginTab.classList.add("active");

    registerTab.classList.remove("active");

    loginForm.classList.remove("hidden");

    registerForm.classList.add("hidden");

    forgotPanel.classList.add("hidden");

}


/*=========================================================
FORGOT PASSWORD
=========================================================*/

function initForgotPassword(){

    if(!forgotButton) return;

    forgotButton.addEventListener("click",()=>{

        loginForm.classList.add("hidden");

        forgotPanel.classList.remove("hidden");

    });

    backButton.addEventListener("click",()=>{

        forgotPanel.classList.add("hidden");

        loginForm.classList.remove("hidden");

    });

}


/*=========================================================
AVATAR
=========================================================*/

function initAvatar(){

    if(!registerName) return;

    registerName.addEventListener("input",updateAvatar);

}


function updateAvatar(){

    let value = registerName.value.trim();

    if(value===""){

        avatarInitials.textContent="MV";

        return;

    }

    const words = value.split(" ");

    if(words.length===1){

        avatarInitials.textContent =

            words[0].substring(0,2).toUpperCase();

    }

    else{

        avatarInitials.textContent =

            (words[0][0]+words[1][0]).toUpperCase();

    }

}


/*=========================================================
PASSWORD VISIBILITY
=========================================================*/

function initPasswordVisibility(){

    bindPasswordToggle(

        "toggle-register-password",

        "register-password"

    );

    bindPasswordToggle(

        "toggle-confirm-password",

        "register-confirm"

    );

    bindPasswordToggle(

        "toggle-login-password",

        "login-password"

    );

}


function bindPasswordToggle(buttonId,inputId){

    const button=document.getElementById(buttonId);

    const input=document.getElementById(inputId);

    if(!button || !input) return;

    button.addEventListener("click",()=>{

        if(input.type==="password"){

            input.type="text";

            button.innerHTML=

            `<span class="material-symbols-outlined">

            visibility_off

            </span>`;

        }

        else{

            input.type="password";

            button.innerHTML=

            `<span class="material-symbols-outlined">

            visibility

            </span>`;

        }

    });

}

/*=========================================================
PASSWORD STRENGTH
=========================================================*/

function initStrengthMeter(){

    if(!password) return;

    password.addEventListener("input",checkPasswordStrength);

}


function checkPasswordStrength(){

    const value=password.value;

    let score=0;

    const rules={

        length:value.length>=8,

        uppercase:/[A-Z]/.test(value),

        number:/[0-9]/.test(value),

        symbol:/[^A-Za-z0-9]/.test(value)

    };

    updateRule("rule-length",rules.length);
    updateRule("rule-uppercase",rules.uppercase);
    updateRule("rule-number",rules.number);
    updateRule("rule-symbol",rules.symbol);

    Object.values(rules).forEach(rule=>{

        if(rule) score++;

    });

    const percent=(score/4)*100;

    strengthFill.style.width=percent+"%";

    switch(score){

        case 0:
        case 1:

            strengthFill.style.background="#ff4b5c";
            strengthText.textContent="Seguridad: Muy débil";
            break;

        case 2:

            strengthFill.style.background="#ffb84d";
            strengthText.textContent="Seguridad: Media";
            break;

        case 3:

            strengthFill.style.background="#ffe04d";
            strengthText.textContent="Seguridad: Buena";
            break;

        case 4:

            strengthFill.style.background="#48ff8d";
            strengthText.textContent="Seguridad: Excelente";
            break;

    }

}


/*=========================================================
PASSWORD RULES
=========================================================*/

function updateRule(id,valid){

    const element=document.getElementById(id);

    if(!element) return;

    if(valid){

        element.style.borderColor="#48ff8d";

        element.style.color="#48ff8d";

        element.innerHTML=

        "✅ "+element.textContent.substring(2);

    }

    else{

        element.style.borderColor="rgba(255,255,255,.05)";

        element.style.color="#b8c1d8";

        element.innerHTML=

        "⬜ "+element.textContent.substring(2);

    }

}


/*=========================================================
VALIDATION
=========================================================*/

function validateRegisterForm(){

    const name=document.getElementById("register-name").value.trim();

    const username=document.getElementById("register-username").value.trim();

    const email=document.getElementById("register-email").value.trim();

    const pass=password.value;

    const confirm=confirmPassword.value;

    const terms=document.getElementById("accept-terms").checked;

    if(name===""){

        showToast("Debes ingresar tu nombre.","error");

        return false;

    }

    if(username===""){

        showToast("Debes crear un alias.","error");

        return false;

    }

    if(email===""){

        showToast("Ingresa un correo válido.","error");

        return false;

    }

    if(pass.length<8){

        showToast("La contraseña es demasiado corta.","error");

        return false;

    }

    if(pass!==confirm){

        showToast("Las contraseñas no coinciden.","error");

        return false;

    }

    if(!terms){

        showToast("Debes aceptar los términos.","error");

        return false;

    }

    return true;

}


/*=========================================================
LOGIN VALIDATION
=========================================================*/

function validateLoginForm(){

    const email=document.getElementById("login-email").value.trim();

    const pass=document.getElementById("login-password").value;

    if(email===""){

        showToast("Introduce tu correo.","error");

        return false;

    }

    if(pass===""){

        showToast("Introduce tu contraseña.","error");

        return false;

    }

    return true;

}


/*=========================================================
LOADING
=========================================================*/

function showLoading(){

    loadingOverlay.classList.remove("hidden");

}


function hideLoading(){

    loadingOverlay.classList.add("hidden");

}


/*=========================================================
TOAST
=========================================================*/

let toastTimeout=null;

function showToast(message,type="success"){

    toast.textContent=message;

    toast.classList.remove("hidden");

    toast.classList.remove("error","success");

    toast.classList.add(type);

    if(type==="error"){

        toast.style.borderColor="#ff5b72";

    }

    else{

        toast.style.borderColor="#48ff8d";

    }

    clearTimeout(toastTimeout);

    toastTimeout=setTimeout(()=>{

        toast.classList.add("hidden");

    },3500);

}


/*=========================================================
UTILS
=========================================================*/

function clearRegisterForm(){

    registerForm.reset();

    avatarInitials.textContent="MV";

    strengthFill.style.width="0";

    strengthText.textContent="Seguridad: --";

}


function clearLoginForm(){

    loginForm.reset();

}

/*=========================================================
PASSWORD STRENGTH
=========================================================*/

function initStrengthMeter(){

    if(!password) return;

    password.addEventListener("input",checkPasswordStrength);

}


function checkPasswordStrength(){

    const value=password.value;

    let score=0;

    const rules={

        length:value.length>=8,

        uppercase:/[A-Z]/.test(value),

        number:/[0-9]/.test(value),

        symbol:/[^A-Za-z0-9]/.test(value)

    };

    updateRule("rule-length",rules.length);
    updateRule("rule-uppercase",rules.uppercase);
    updateRule("rule-number",rules.number);
    updateRule("rule-symbol",rules.symbol);

    Object.values(rules).forEach(rule=>{

        if(rule) score++;

    });

    const percent=(score/4)*100;

    strengthFill.style.width=percent+"%";

    switch(score){

        case 0:
        case 1:

            strengthFill.style.background="#ff4b5c";
            strengthText.textContent="Seguridad: Muy débil";
            break;

        case 2:

            strengthFill.style.background="#ffb84d";
            strengthText.textContent="Seguridad: Media";
            break;

        case 3:

            strengthFill.style.background="#ffe04d";
            strengthText.textContent="Seguridad: Buena";
            break;

        case 4:

            strengthFill.style.background="#48ff8d";
            strengthText.textContent="Seguridad: Excelente";
            break;

    }

}


/*=========================================================
PASSWORD RULES
=========================================================*/

function updateRule(id,valid){

    const element=document.getElementById(id);

    if(!element) return;

    if(valid){

        element.style.borderColor="#48ff8d";

        element.style.color="#48ff8d";

        element.innerHTML=

        "✅ "+element.textContent.substring(2);

    }

    else{

        element.style.borderColor="rgba(255,255,255,.05)";

        element.style.color="#b8c1d8";

        element.innerHTML=

        "⬜ "+element.textContent.substring(2);

    }

}


/*=========================================================
VALIDATION
=========================================================*/

function validateRegisterForm(){

    const name=document.getElementById("register-name").value.trim();

    const username=document.getElementById("register-username").value.trim();

    const email=document.getElementById("register-email").value.trim();

    const pass=password.value;

    const confirm=confirmPassword.value;

    const terms=document.getElementById("accept-terms").checked;

    if(name===""){

        showToast("Debes ingresar tu nombre.","error");

        return false;

    }

    if(username===""){

        showToast("Debes crear un alias.","error");

        return false;

    }

    if(email===""){

        showToast("Ingresa un correo válido.","error");

        return false;

    }

    if(pass.length<8){

        showToast("La contraseña es demasiado corta.","error");

        return false;

    }

    if(pass!==confirm){

        showToast("Las contraseñas no coinciden.","error");

        return false;

    }

    if(!terms){

        showToast("Debes aceptar los términos.","error");

        return false;

    }

    return true;

}


/*=========================================================
LOGIN VALIDATION
=========================================================*/

function validateLoginForm(){

    const email=document.getElementById("login-email").value.trim();

    const pass=document.getElementById("login-password").value;

    if(email===""){

        showToast("Introduce tu correo.","error");

        return false;

    }

    if(pass===""){

        showToast("Introduce tu contraseña.","error");

        return false;

    }

    return true;

}


/*=========================================================
LOADING
=========================================================*/

function showLoading(){

    loadingOverlay.classList.remove("hidden");

}


function hideLoading(){

    loadingOverlay.classList.add("hidden");

}


/*=========================================================
TOAST
=========================================================*/

let toastTimeout=null;

function showToast(message,type="success"){

    toast.textContent=message;

    toast.classList.remove("hidden");

    toast.classList.remove("error","success");

    toast.classList.add(type);

    if(type==="error"){

        toast.style.borderColor="#ff5b72";

    }

    else{

        toast.style.borderColor="#48ff8d";

    }

    clearTimeout(toastTimeout);

    toastTimeout=setTimeout(()=>{

        toast.classList.add("hidden");

    },3500);

}


/*=========================================================
UTILS
=========================================================*/

function clearRegisterForm(){

    registerForm.reset();

    avatarInitials.textContent="MV";

    strengthFill.style.width="0";

    strengthText.textContent="Seguridad: --";

}


function clearLoginForm(){

    loginForm.reset();

}

/*=========================================================
FORM EVENTS
=========================================================*/

registerForm?.addEventListener("submit",(event)=>{

    event.preventDefault();

    if(!validateRegisterForm()) return;

    document.dispatchEvent(

        new CustomEvent("magnopvs:register",{

            detail:{

                name:document.getElementById("register-name").value.trim(),

                username:document.getElementById("register-username").value.trim(),

                email:document.getElementById("register-email").value.trim(),

                password:document.getElementById("register-password").value,

                newsletter:document.getElementById("accept-news").checked

            }

        })

    );

});


loginForm?.addEventListener("submit",(event)=>{

    event.preventDefault();

    if(!validateLoginForm()) return;

    document.dispatchEvent(

        new CustomEvent("magnopvs:login",{

            detail:{

                email:document.getElementById("login-email").value.trim(),

                password:document.getElementById("login-password").value,

                remember:document.getElementById("remember-session").checked

            }

        })

    );

});


/*=========================================================
FORGOT PASSWORD
=========================================================*/

document

.getElementById("send-reset-email")

?.addEventListener("click",()=>{

    const email=

    document

    .getElementById("forgot-email")

    .value

    .trim();

    if(email===""){

        showToast(

            "Introduce un correo electrónico.",

            "error"

        );

        return;

    }

    document.dispatchEvent(

        new CustomEvent(

            "magnopvs:forgot-password",

            {

                detail:{

                    email

                }

            }

        )

    );

});


/*=========================================================
GOOGLE LOGIN
=========================================================*/

document

.getElementById("google-register")

?.addEventListener("click",()=>{

    document.dispatchEvent(

        new CustomEvent(

            "magnopvs:google"

        )

    );

});


document

.getElementById("google-login")

?.addEventListener("click",()=>{

    document.dispatchEvent(

        new CustomEvent(

            "magnopvs:google"

        )

    );

});


/*=========================================================
PUBLIC UI API
=========================================================*/

window.RegisterUI={

    showLoading,

    hideLoading,

    showToast,

    clearRegisterForm,

    clearLoginForm,

    showRegister,

    showLogin

};


/*=========================================================
SHORTCUTS
=========================================================*/

document.addEventListener("keydown",(event)=>{

    if(event.key==="Escape"){

        hideLoading();

    }

});


/*=========================================================
AUTOFOCUS
=========================================================*/

window.addEventListener("load",()=>{

    const input=document.getElementById("register-name");

    if(input){

        input.focus();

    }

});


/*=========================================================
END
=========================================================*/

console.log(

"%cMagnopVS Register UI Ready",

"color:#6CB7FF;font-size:14px;font-weight:bold;"

);
