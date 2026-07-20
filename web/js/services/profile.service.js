/*=========================================================
MAGNOPVS
PROFILE SERVICE
profile.service.js
PARTE 1/2
=========================================================*/

"use strict";

/*=========================================================
IMPORTS
=========================================================*/

import { auth } from "../config/firebase/firebase-config.js";
import { supabase } from "../config/supabase/supabase-config.js";

/*=========================================================
PROFILE SERVICE
=========================================================*/

class ProfileService{

    /*=====================================================
    GET CURRENT USER
    =====================================================*/

    getCurrentUser(){

        return auth.currentUser;

    }

    /*=====================================================
    GET CURRENT PROFILE
    =====================================================*/

    async getCurrentProfile(){

        try{

            const user = auth.currentUser;

            if(!user){

                console.warn("No hay usuario autenticado.");

                return null;

            }

            const { data, error } = await supabase

                .from("profiles")

                .select("*")

                .eq("uid", user.uid)

                .single();

            if(error){

                throw error;

            }

            return data;

        }

        catch(error){

            console.error(

                "Error cargando perfil:",

                error

            );

            return null;

        }

    }

    /*=====================================================
    PROFILE EXISTS
    =====================================================*/

    async profileExists(uid){

        try{

            const { data } = await supabase

                .from("profiles")

                .select("uid")

                .eq("uid", uid)

                .maybeSingle();

            return !!data;

        }

        catch(error){

            console.error(error);

            return false;

        }

    }

    /*=====================================================
    CREATE PROFILE
    =====================================================*/

    async createProfile(profile){

        try{

            const { data, error } = await supabase

                .from("profiles")

                .insert(profile)

                .select()

                .single();

            if(error){

                throw error;

            }

            console.log("Perfil creado.");

            return data;

        }

        catch(error){

            console.error(

                "Error creando perfil:",

                error

            );

            return null;

        }

    }

    /*=====================================================
    UPDATE PROFILE
    =====================================================*/

    async updateProfile(uid,values){

        try{

            const { data, error } = await supabase

                .from("profiles")

                .update(values)

                .eq("uid", uid)

                .select()

                .single();

            if(error){

                throw error;

            }

            console.log("Perfil actualizado.");

            return data;

        }

        catch(error){

            console.error(

                "Error actualizando perfil:",

                error

            );

            return null;

        }

    }

    /*=========================================================
PROFILE SERVICE
PARTE 2/2
=========================================================*/

    /*=====================================================
    UPDATE AVATAR
    =====================================================*/

    async updateAvatar(uid, avatar){

        return await this.updateProfile(uid,{
            avatar
        });

    }

    /*=====================================================
    UPDATE BANNER
    =====================================================*/

    async updateBanner(uid, banner){

        return await this.updateProfile(uid,{
            banner
        });

    }

    /*=====================================================
    UPDATE BIO
    =====================================================*/

    async updateBio(uid, bio){

        return await this.updateProfile(uid,{
            bio
        });

    }

    /*=====================================================
    UPDATE LEVEL
    =====================================================*/

    async updateLevel(uid, level){

        return await this.updateProfile(uid,{
            level
        });

    }

    /*=====================================================
    UPDATE XP
    =====================================================*/

    async updateXP(uid, xp){

        return await this.updateProfile(uid,{
            xp
        });

    }

    /*=====================================================
    UPDATE RANK
    =====================================================*/

    async updateRank(uid, rank){

        return await this.updateProfile(uid,{
            rank
        });

    }

    /*=====================================================
    UPDATE REPUTATION
    =====================================================*/

    async updateReputation(uid, reputation){

        return await this.updateProfile(uid,{
            reputation
        });

    }

    /*=====================================================
    UPDATE MAGNOPOINTS
    =====================================================*/

    async updateMagnoPoints(uid, magnopoints){

        return await this.updateProfile(uid,{
            magnopoints
        });

    }

    /*=====================================================
    UPDATE MICROCOINS
    =====================================================*/

    async updateMicroCoins(uid, microcoins){

        return await this.updateProfile(uid,{
            microcoins
        });

    }

    /*=====================================================
    FOLLOW USER
    =====================================================*/

    async follow(uid){

        const profile = await this.getCurrentProfile();

        if(!profile) return;

        return await this.updateProfile(uid,{
            followers:
            (profile.followers ?? 0) + 1
        });

    }

    /*=====================================================
    UNFOLLOW USER
    =====================================================*/

    async unfollow(uid){

        const profile = await this.getCurrentProfile();

        if(!profile) return;

        return await this.updateProfile(uid,{
            followers:
            Math.max(
                (profile.followers ?? 1) - 1,
                0
            )
        });

    }

    /*=====================================================
    DELETE PROFILE
    =====================================================*/

    async deleteProfile(uid){

        try{

            const { error } = await supabase

                .from("profiles")

                .delete()

                .eq("uid",uid);

            if(error){

                throw error;

            }

            console.log("Perfil eliminado.");

            return true;

        }

        catch(error){

            console.error(error);

            return false;

        }

    }

    /*=====================================================
    RELOAD PROFILE
    =====================================================*/

    async reload(){

        return await this.getCurrentProfile();

    }

}

/*=========================================================
EXPORT
=========================================================*/

const profileService = new ProfileService();

export default profileService;

/*=========================================================
END
=========================================================*/

console.log(

"%cProfile Service Ready",

"color:#00FFD5;font-size:14px;font-weight:bold;"

);

