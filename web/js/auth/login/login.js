/*=========================================================
MAGNOPVS
LOGIN CONTROLLER
=========================================================*/
const form = document.getElementById("magnopvs-login-form");
const emailInput = document.getElementById("login-email");
const passwordInput = document.getElementById("login-password");
const googleButton = document.getElementById("google-login");
const forgotButton = document.getElementById("forgot-password-button");
/*=========================================================
FEEDBACK UI
=========================================================*/
const loadingOverlay = document.createElement("div");
loadingOverlay.id = "login-loading-overlay";
loadingOverlay.className =
    "hidden fixed inset-0 z-[2000] bg-black/80 backdrop-blur-sm items-center justify-center";
loadingOverlay.innerHTML = `
    <div class="border border-celestial-blue/30 bg-black/90 p-8 text-center shadow-[0_0_35px_rgba(0,245,255,0.12)]">
        <div class="w-10 h-10 mx-auto mb-5 border-2 border-celestial-blue/20 border-t-celestial-blue rounded-full animate-spin"></div>
        <p class="font-headline-lg text-xs text-celestial-blue tracking-[0.2em] uppercase">
            Sincronizando identidad
        </p>
        <p class="font-code-sm text-[9px] text-white/40 mt-3">
            Conectando con MagnopVS Core...
        </p>
    </div>
`;
document.body.appendChild(loadingOverlay);
const toast = document.createElement("div");
toast.id = "login-toast";
toast.className =
    "hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-[2100] max-w-[90vw] px-6 py-4 bg-black/95 border border-celestial-blue/50 text-white font-code-sm text-xs shadow-[0_0_25px_rgba(0,245,255,0.12)]";
toast.setAttribute("role", "status");
toast.setAttribute("aria-live", "polite");
document.body.appendChild(toast);
let toastTimeout = null;
function showLoading() {
    loadingOverlay.classList.remove("hidden");
    loadingOverlay.classList.add("flex");
}
function hideLoading() {
    loadingOverlay.classList.add("hidden");
    loadingOverlay.classList.remove("flex");
}
function showToast(message, type = "success") {
    toast.textContent = message;
    toast.classList.remove(
        "hidden",
        "border-celestial-blue/50",
        "border-red-500",
        "border-green-400"
    );
    toast.classList.add(
        type === "error" ? "border-red-500" : "border-green-400"
    );
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.add("hidden");
    }, 4500);
}
/*
Firebase Auth utiliza esta API publica.
No se carga register.js en esta pantalla.
*/
window.RegisterUI = {
    showLoading,
    hideLoading,
    showToast
};
/*=========================================================
EMAIL LOGIN
=========================================================*/
form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    if (!email || !password) {
        showToast("Completa el correo y la contraseña.", "error");
        return;
    }
    if (!emailInput.checkValidity()) {
        emailInput.reportValidity();
        return;
    }
    document.dispatchEvent(
        new CustomEvent("magnopvs:login", {
            detail: {
                email,
                password,
                remember: document.getElementById("remember-session").checked
            }
        })
    );
});
/*=========================================================
GOOGLE LOGIN
=========================================================*/
googleButton.addEventListener("click", () => {
    document.dispatchEvent(
        new CustomEvent("magnopvs:google", {
            detail: {
                remember: document.getElementById("remember-session").checked
            }
        })
    );
});
/*=========================================================
PASSWORD RECOVERY
=========================================================*/
forgotButton.addEventListener("click", () => {
    const email = emailInput.value.trim();
    if (!email) {
        showToast(
            "Introduce tu correo para enviarte el enlace de recuperación.",
            "error"
        );
        emailInput.focus();
        return;
    }
    if (!emailInput.checkValidity()) {
        emailInput.reportValidity();
        return;
    }
    document.dispatchEvent(
        new CustomEvent("magnopvs:forgot-password", {
            detail: { email }
        })
    );
});
console.log("[MagnopVS] Login Controller cargado.");