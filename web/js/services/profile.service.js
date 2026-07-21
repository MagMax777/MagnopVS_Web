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

    /*=====================================================
    STATE
    =====================================================*/

    user:null,

    profile:null,

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
CREATE PROFILE
=========================================================*/

async createProfile(){

    const user=await this.getCurrentUser();

    if(!user){

        return null;

    }

    const exists=await this.exists(user.uid);

    if(exists){

        return await this.getCurrentProfile();

    }

    const username=(user.email || "")
        .split("@")[0]
        .toLowerCase()
        .replace(/[^a-z0-9._]/g,"");

    const profile={

        uid:user.uid,

        full_name:
            user.displayName ||
            username,

        username,

        email:user.email,

        newsletter:false,

        avatar:
            user.photoURL ||
            "/assets/images/avatar/default.webp",

        banner:
            "/assets/images/banner/default.webp",

        bio:
            "Bienvenido a MagnopVS.",

        level:1,

        xp:0,

        rank:"Explorer",

        class:"Life Hero",

        faction:"Neutral",

        reputation:0,

        followers:0,

        following:0,

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

    return data;

},

/*=========================================================
SYNC PROFILE
=========================================================*/

async syncProfile(){

    const user=await this.getCurrentUser();

    if(!user){

        return null;

    }

    let profile=

        await this.getCurrentProfile();

    if(!profile){

        profile=

            await this.createProfile();

    }

    const update={};

    if(

        !profile.full_name &&

        user.displayName

    ){

        update.full_name=user.displayName;

    }

    if(

        !profile.avatar &&

        user.photoURL

    ){

        update.avatar=user.photoURL;

    }

    if(

        profile.email!==user.email

    ){

        update.email=user.email;

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
GET PROFILE
=========================================================*/

    async getCurrentProfile(){

        if(this.profile){

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

        .eq(

            "uid",

            user.uid

        )

        .maybeSingle();

        if(error){

            console.error(error);

            return null;

        }

        if(!data){

            return await this.createProfile();

        }

        this.profile=data;

        return data;

    },

/*=========================================================
GET PROFILE BY UID
=========================================================*/

    async getByUID(uid){

        const{

            data,

            error

        }=

        await supabase

        .from("profiles")

        .select("*")

        .eq(

            "uid",

            uid

        )

        .maybeSingle();

        if(error){

            console.error(error);

            return null;

        }

        return data;

    },

/*=========================================================
REFRESH PROFILE
=========================================================*/

    async refresh(){

        this.profile=null;

        return await this.getCurrentProfile();

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