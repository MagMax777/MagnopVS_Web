"use strict";

/*=========================================================
MAGNOPVS
PLAYER DASHBOARD
dashboard.js
=========================================================*/

console.log("🔥 DASHBOARD.JS CARGADO");

const Dashboard = {

    $: {},

    /*=====================================================
    INIT
    =====================================================*/

    init() {

        console.log("INIT");

        this.cacheDOM();

        this.bindTopBar();

        this.bindSidebar();

        this.bindChat();

    },

    /*=====================================================
    CACHE DOM
    =====================================================*/

    cacheDOM() {

        this.$ = {

            /* SIDEBAR */

            menuButton:
                document.getElementById("menuButton"),

            sidebar:
                document.getElementById("sidebar"),

            sidebarOverlay:
                document.getElementById("sidebarOverlay"),

            /* CHAT */

            chatButton:
                document.getElementById("chatButton"),

            chatPanel:
                document.getElementById("chatPanel"),

            chatOverlay:
                document.getElementById("chatOverlay"),

            closeChat:
                document.getElementById("closeChat")

        };

        console.log(this.$);

    },

    /*=====================================================
    TOP BAR
    =====================================================*/

    bindTopBar() {

        if (this.$.menuButton) {

            this.$.menuButton.addEventListener("click", () => {

                this.$.sidebar.classList.add("active");

                this.$.sidebarOverlay.classList.add("active");

                document.body.style.overflow = "hidden";

            });

        }

        /*==========================
        LOGO
        ==========================*/

        const logo = document.querySelector(".logo img");

        if (logo) {

            logo.addEventListener("click", () => {

                logo.classList.remove("rotating");

                void logo.offsetWidth;

                logo.classList.add("rotating");

            });

        }

        /*==========================
        ESC
        ==========================*/

        document.addEventListener("keydown", (event) => {

            if (event.key === "Escape") {

                this.closeSidebar();

                this.closeChat();

            }

        });

    },

    /*=====================================================
    SIDEBAR
    =====================================================*/

    bindSidebar() {

        const links = document.querySelectorAll(".sidebar-link");

        links.forEach(link => {

            link.addEventListener("click", () => {

                links.forEach(item => {

                    item.classList.remove("active");

                });

                link.classList.add("active");

                if (window.innerWidth < 1100) {

                    this.closeSidebar();

                }

            });

        });

        if (this.$.sidebarOverlay) {

            this.$.sidebarOverlay.addEventListener("click", () => {

                this.closeSidebar();

            });

        }

    },

    /*=====================================================
    CLOSE SIDEBAR
    =====================================================*/

    closeSidebar() {

        this.$.sidebar.classList.remove("active");

        this.$.sidebarOverlay.classList.remove("active");

        document.body.style.overflow = "";

    },

    /*=====================================================
    CHAT
    =====================================================*/

    bindChat() {

        if (
            !this.$.chatButton ||
            !this.$.chatPanel
        ) return;

        this.$.chatButton.addEventListener("click", () => {

            this.$.chatPanel.classList.add("active");

            this.$.chatOverlay.classList.add("active");

            document.body.style.overflow = "hidden";

        });

        if (this.$.closeChat) {

            this.$.closeChat.addEventListener("click", () => {

                this.closeChat();

            });

        }

        if (this.$.chatOverlay) {

            this.$.chatOverlay.addEventListener("click", () => {

                this.closeChat();

            });

        }

    },

    /*=====================================================
    CLOSE CHAT
    =====================================================*/

    closeChat() {

        this.$.chatPanel.classList.remove("active");

        this.$.chatOverlay.classList.remove("active");

        document.body.style.overflow = "";

    }

};

/*=========================================================
START
=========================================================*/

window.addEventListener("DOMContentLoaded", () => {

    Dashboard.init();

});