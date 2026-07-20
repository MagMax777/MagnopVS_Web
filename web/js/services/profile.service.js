/*=========================================================
MAGNOPVS
PROFILE SERVICE
=========================================================*/

"use strict";

/*=========================================================
IMPORTS
=========================================================*/

import { auth }

from "../../config/firebase/firebase-config.js";

import { supabase }

from "../../config/supabase/supabase-config.js";

import {

    onAuthStateChanged

}

from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

/*=========================================================
SERVICE
=========================================================*/

const ProfileService={

    currentUser:null,

    currentProfile:null,

/*=========================================================
WAIT AUTH
=========================================================*/

    async waitUser(){

        return new Promise(resolve=>{

            onAuthStateChanged(

                auth,

                user=>{

                    resolve(user);

                }

            );

        });

    },

/*=========================================================
GET PROFILE
=========================================================*/

    async getCurrentProfile(){

        const user=

            await this.waitUser();

        if(!user){

            return null;

        }

        this.currentUser=user;

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

        .single();

        if(error){

            console.error(error);

            return null;

        }

        this.currentProfile=data;

        return data;

    },

/*=========================================================
UPDATE PROFILE
=========================================================*/

    async update(values){

        if(

            !this.currentUser

        ){

            await this.getCurrentProfile();

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

            this.currentUser.uid

        )

        .select()

        .single();

        if(error){

            console.error(error);

            return null;

        }

        this.currentProfile=data;

        return data;

    },

/*=========================================================
REFRESH
=========================================================*/

    async refresh(){

        return await this.getCurrentProfile();

    },

/*=========================================================
GET UID
=========================================================*/

    get uid(){

        return this.currentUser

            ? this.currentUser.uid

            : null;

    }

};

/*=========================================================
EXPORT
=========================================================*/

export default ProfileService;
