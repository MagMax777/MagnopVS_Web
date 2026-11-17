/*=========================================================
MAGNOPVS
PROFILE SERVICE
profile.service.js
PARTE 1/3
=========================================================*/

"use strict";

/*=========================================================
IMPORTS
=========================================================*/

import {

    auth

} from "../../config/firebase/firebase-config.js";

import {

    supabase

} from "../../config/supabase/supabase-config.js";

import {

    onAuthStateChanged

} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

/*=========================================================
PROFILE SERVICE
=========================================================*/

const ProfileService={

/*=========================================================
STATE
=========================================================*/

user:null,

profile:null,

profileLoaded:false,

elements:null,

defaults:{

    avatar:
    "https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/assets/images/avatar/default-avatar.webp",

    banner:
    "https://jlckakyftkzgfgkmmdmc.supabase.co/storage/v1/object/public/MagnopVS_Web/web/assets/images/banner/default-banner.webp",

    display_name:"Nuevo Héroe",

    username:"hero",

    bio:
    "Todo héroe comienza explorando un universo desconocido.",

    level:1,

    xp:0,

    rank:"Explorer",

    hero_class:"Life Hero",

    faction:"Neutral",

    followers:0,

    following:0,

    reputation:0,

    magnopoints:0,

    microcoins:0

},

/*=========================================================
WAIT AUTH
=========================================================*/

waitUser(){

    return new Promise(resolve=>{

        onAuthStateChanged(

            auth,

            user=>resolve(user)

        );

    });

},

/*=========================================================
CURRENT USER
=========================================================*/

async getCurrentUser(){

    if(this.user){

        return this.user;

    }

    this.user=

        await this.waitUser();

    return this.user;

},

/*=========================================================
PROFILE EXISTS
=========================================================*/

async exists(uid){

    const{

        data,

        error

    }=

    await supabase

    .from("profiles")

    .select("uid")

    .eq("uid",uid)

    .maybeSingle();

    if(error){

        console.error(error);

        return false;

    }

    return !!data;

},

/*=========================================================
ENSURE PROFILE
=========================================================*/

async ensureProfile(){

    const user=

        await this.getCurrentUser();

    if(!user){

        return null;

    }

    let profile=

        await this.getCurrentProfile();

    if(!profile){

        profile=

            await this.createProfile();

    }

    profile=

        await this.syncProfile();

    return profile;

},

/*=========================================================
CREATE PROFILE
=========================================================*/

async createProfile(){

    const user=

        await this.getCurrentUser();

    if(!user){

        return null;

    }

    const username=

        (user.email||"")

        .split("@")[0]

        .toLowerCase()

        .replace(/[^a-z0-9._]/g,"");

    const profile={

        uid:user.uid,

        display_name:

            user.displayName ||

            username,

        username,

        email:user.email,

        newsletter:false,

        avatar:

            user.photoURL ||

            this.defaults.avatar,

        banner:

            this.defaults.banner,

        bio:

            this.defaults.bio,

        level:1,

        xp:0,

        rank:"Explorer",

        hero_class:"Life Hero",

        faction:"Neutral",

        followers:0,

        following:0,

        reputation:0,

        magnopoints:0,

        microcoins:0

    };

    const{

        data,

        error

    }=

    await supabase

    .from("profiles")

    .insert(profile)

    .select()

    .single();

    if(error){

        console.error(error);

        return null;

    }

    this.profile=data;

    this.profileLoaded=true;

    return data;

},

/*=========================================================
SYNC PROFILE
=========================================================*/

async syncProfile(){

    let profile=

        await this.getCurrentProfile();

    const user=

        await this.getCurrentUser();

    if(!profile || !user){

        return null;

    }

    const update={};

    if(

        !profile.display_name &&

        user.displayName

    ){

        update.display_name=

            user.displayName;

    }

    if(

        !profile.avatar &&

        user.photoURL

    ){

        update.avatar=

            user.photoURL;

    }

    if(

        !profile.banner

    ){

        update.banner=

            this.defaults.banner;

    }

    if(

        !profile.bio

    ){

        update.bio=

            this.defaults.bio;

    }

    if(

        profile.email!==user.email

    ){

        update.email=

            user.email;

    }

    if(

        Object.keys(update).length

    ){

        profile=

            await this.update(update);

    }

    return profile;

},

/*=========================================================
CURRENT PROFILE
=========================================================*/

async getCurrentProfile(){

    if(

        this.profileLoaded &&

        this.profile

    ){

        return this.profile;

    }

    const user=

        await this.getCurrentUser();

    if(!user){

        return null;

    }

    const{

        data,

        error

    }=

    await supabase

    .from("profiles")

    .select("*")

    .eq("uid",user.uid)

    .maybeSingle();

    if(error){

        console.error(error);

        return null;

    }

    this.profile=data;

    this.profileLoaded=true;

    return data;

},

/*=========================================================
CACHE ELEMENTS
=========================================================*/

cacheElements(){

    if(this.elements){

        return this.elements;

    }

    this.elements={

        display_name:[
            "playerName",
            "miniName"
        ],

        username:[
            "playerUsername"
        ],

        bio:[
            "playerBio"
        ],

        rank:[
            "playerRank",
            "miniRank"
        ],

        hero_class:[
            "playerClass"
        ],

        faction:[
            "playerFaction"
        ],

        level:[
            "playerLevel"
        ],

        followers:[
            "playerFollowers"
        ],

        following:[
            "playerFollowing"
        ],

        reputation:[
            "playerReputation"
        ],

        magnopoints:[
            "magnoPoints"
        ],

        microcoins:[
            "microCoins"
        ],

        avatar:[
            "profileAvatar",
            "miniAvatar"
        ],

        banner:[
            "heroBanner"
        ]

    };

    return this.elements;

},

/*=========================================================
RENDER PROFILE
=========================================================*/

renderProfile(profile=this.profile){

    if(!profile){

        return;

    }

    this.cacheElements();

    Object.entries(this.elements)

    .forEach(([field,ids])=>{

        ids.forEach(id=>{

            const element=

                document.getElementById(id);

            if(!element){

                return;

            }

            const value=

                profile[field];

            if(

                element.tagName==="IMG"

            ){

                element.src=

                    value ||

                    this.defaults[field] ||

                    "";

                return;

            }

            element.textContent=

                value ??

                "";

        });

    });

    this.renderXP(profile);

    this.renderHero(profile);

    this.renderResources(profile);

},

/*=========================================================
RENDER HERO
=========================================================*/

renderHero(profile){

    const status=

        document.getElementById(

            "playerStatus"

        );

    if(status){

        status.textContent=

            profile.status ||

            "🌌 Explorando la Quantvm Matrix";

    }

},

/*=========================================================
RENDER RESOURCES
=========================================================*/

renderResources(profile){

    const mp=

        document.getElementById(

            "magnoPoints"

        );

    if(mp){

        mp.textContent=

            Number(

                profile.magnopoints || 0

            ).toLocaleString();

    }

    const mc=

        document.getElementById(

            "microCoins"

        );

    if(mc){

        mc.textContent=

            Number(

                profile.microcoins || 0

            ).toLocaleString();

    }

},

/*=========================================================
RENDER XP
=========================================================*/

renderXP(profile){

    const fill=

        document.getElementById(

            "xpFill"

        );

    const text=

        document.getElementById(

            "xpText"

        );

    if(!fill || !text){

        return;

    }

    const xp=

        Number(profile.xp || 0);

    const level=

        Number(profile.level || 1);

    const next=

        level*100;

    const percent=

        Math.min(

            (xp/next)*100,

            100

        );

    fill.style.width=

        percent+"%";

    text.textContent=

        xp+

        " / "+

        next+

        " XP";

},

/*=========================================================
LOAD
=========================================================*/

async load(){

    const profile=

        await this.ensureProfile();

    if(!profile){

        return null;

    }

    this.renderProfile(profile);

    return profile;

},

/*=========================================================
UPDATE PROFILE
=========================================================*/

    async update(values={}){

        const user=

            await this.getCurrentUser();

        if(!user){

            return null;

        }

        const{

            data,

            error

        }=

        await supabase

        .from("profiles")

        .update(values)

        .eq(

            "uid",

            user.uid

        )

        .select()

        .single();

        if(error){

            console.error(error);

            return null;

        }

        this.profile=data;

        return data;

    },

/*=========================================================
UPDATE XP
=========================================================*/

    async updateXP(xp){

        return await this.update({

            xp

        });

    },

/*=========================================================
UPDATE LEVEL
=========================================================*/

    async updateLevel(level){

        return await this.update({

            level

        });

    },

/*=========================================================
UPDATE MAGNOPOINTS
=========================================================*/

    async updateMagnoPoints(points){

        return await this.update({

            magnopoints:points

        });

    },

/*=========================================================
UPDATE MICROCOINS
=========================================================*/

    async updateMicroCoins(coins){

        return await this.update({

            microcoins:coins

        });

    },

/*=========================================================
UPDATE REPUTATION
=========================================================*/

    async updateReputation(reputation){

        return await this.update({

            reputation

        });

    },

/*=========================================================
UPDATE FOLLOWERS
=========================================================*/

    async updateFollowers(followers){

        return await this.update({

            followers

        });

    },

/*=========================================================
UPDATE FOLLOWING
=========================================================*/

    async updateFollowing(following){

        return await this.update({

            following

        });

    },

/*=========================================================
UPDATE AVATAR
=========================================================*/

    async updateAvatar(avatar){

        return await this.update({

            avatar

        });

    },

/*=========================================================
UPDATE BANNER
=========================================================*/

    async updateBanner(banner){

        return await this.update({

            banner

        });

    },

/*=========================================================
UPDATE BIO
=========================================================*/

    async updateBio(bio){

        return await this.update({

            bio

        });

    },

/*=========================================================
SAVE PROFILE
=========================================================*/

async save(values={}){

    const profile=

        await this.update(values);

    if(profile){

        this.renderProfile(profile);

    }

    return profile;

},

/*=========================================================
UPDATE FIELD
=========================================================*/

async updateField(field,value){

    return await this.save({

        [field]:value

    });

},

/*=========================================================
UPLOAD AVATAR
=========================================================*/

async uploadAvatar(url){

    return await this.updateField(

        "avatar",

        url

    );

},

/*=========================================================
UPLOAD BANNER
=========================================================*/

async uploadBanner(url){

    return await this.updateField(

        "banner",

        url

    );

},

/*=========================================================
UPDATE BIO
=========================================================*/

async saveBio(bio){

    return await this.updateField(

        "bio",

        bio

    );

},

/*=========================================================
UPDATE DISPLAY NAME
=========================================================*/

async saveDisplayName(display_name){

    return await this.updateField(

        "display_name",

        display_name

    );

},

/*=========================================================
UPDATE USERNAME
=========================================================*/

async saveUsername(username){

    return await this.updateField(

        "username",

        username

    );

},

/*=========================================================
UPDATE HERO CLASS
=========================================================*/

async saveHeroClass(hero_class){

    return await this.updateField(

        "hero_class",

        hero_class

    );

},

/*=========================================================
UPDATE FACTION
=========================================================*/

async saveFaction(faction){

    return await this.updateField(

        "faction",

        faction

    );

},

/*=========================================================
CLEAR CACHE
=========================================================*/

clear(){

    this.user=null;

    this.profile=null;

    this.profileLoaded=false;

},

/*=========================================================
LOGOUT
=========================================================*/

async logout(){

    this.clear();

    await auth.signOut();

    window.location.href=

        "../../auth/login/login.html";

},

/*=========================================================
GETTERS
=========================================================*/

get uid(){

    return this.profile?.uid ?? null;

},

get displayName(){

    return this.profile?.display_name ?? "";

},

get username(){

    return this.profile?.username ?? "";

},

get avatar(){

    return this.profile?.avatar ??

        this.defaults.avatar;

},

get banner(){

    return this.profile?.banner ??

        this.defaults.banner;

},

get level(){

    return this.profile?.level ?? 1;

},

get xp(){

    return this.profile?.xp ?? 0;

},

get rank(){

    return this.profile?.rank ?? "Explorer";

},

get heroClass(){

    return this.profile?.hero_class ??

        "Life Hero";

},

get faction(){

    return this.profile?.faction ??

        "Neutral";

},

get followers(){

    return this.profile?.followers ?? 0;

},

get following(){

    return this.profile?.following ?? 0;

},

get reputation(){

    return this.profile?.reputation ?? 0;

},

get magnopoints(){

    return this.profile?.magnopoints ?? 0;

},

get microcoins(){

    return this.profile?.microcoins ?? 0;

},

/*=========================================================
CLEAR CACHE
=========================================================*/

    clear(){

        this.user=null;

        this.profile=null;

    },

/*=========================================================
SIGN OUT
=========================================================*/

    async logout(){

        this.clear();

        await auth.signOut();

    },

/*=========================================================
GETTERS
=========================================================*/

    get uid(){

        return this.user

            ? this.user.uid

            : null;

    },

    get email(){

        return this.user

            ? this.user.email

            : null;

    },

    get name(){

        return this.profile

            ? this.profile.full_name

            : "";

    },

    get avatar(){

        return this.profile

            ? this.profile.avatar

            : "";

    },

    get level(){

        return this.profile

            ? this.profile.level

            : 1;

    },

    get xp(){

        return this.profile

            ? this.profile.xp

            : 0;

    },

    get magnopoints(){

        return this.profile

            ? this.profile.magnopoints

            : 0;

    },

    get microcoins(){

        return this.profile

            ? this.profile.microcoins

            : 0;

    },

    get reputation(){

        return this.profile

            ? this.profile.reputation

            : 0;

    }

};

/*=========================================================
EXPORT
=========================================================*/

export default ProfileService;

/*=========================================================
END
=========================================================*/

console.log(

    "%c✓ Profile Service Ready",

    "color:#00FFD5;font-size:15px;font-weight:bold;"

);   