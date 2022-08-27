import axios from 'axios';
import baseURL from '@/api/baseURL';

const state = {
    isLoggedIn: false,
    userDetails: {},

    showDrwer:{
        dossiersFirst:true,
        statistic_Etude:false,
        Affect_suivi_statistic:false,
        gestUser:false,
        archive:true,
        mv_dossier:false,
    }
};

const getters = {
    loggedIn(state) {
        return state.isLoggedIn;
    }
}

const mutations = {
    setLoggedIn(state, payload) {
        state.isLoggedIn = payload;
    },
    setUserDetails(state,userinfo){
        state.userDetails = userinfo;
    },

    profile(state,ob){
        // bereau d'ordre
        this.state.user.showDrwer.dossiersFirst = ob[0];
        // vice
        this.state.user.showDrwer.statistic_Etude = ob[1];
        // procurreur
        this.state.user.showDrwer.Affect_suivi_statistic = ob[2];
        // admin
        this.state.user.showDrwer.gestUser = ob[3];
        // admin move fichier
        this.state.user.showDrwer.mv_dossier = ob[4];
      },
};

const actions = {
    loginUser(ctx, payload){
        return new Promise( (resolve, reject) => {
            axios
                .post(baseURL.api+'/users/login', payload)
                .then((response) => {
                 localStorage.setItem('token',response.data.access_token)
                ctx.commit('setLoggedIn',true)
                ctx.commit('setUserDetails',response.data)
                resolve(response);

                switch(response.data.role.nom) {
                    case "user": { 
                             ctx.commit('profile',[true,false,false,false,false]);
                                this.$router.push('/plaintes');
                                  break;
                                  }

                   case "vice_proc": { 
                                    ctx.commit('profile',[false,true,false,false,false]);
                                    this.$router.push('/mes_dossiers');
                                     break;
                                        }
                   case "proc": { 
                                ctx.commit('profile',[true,true,true,false,true]);
                                  this.$router.push('/suivi');  
                                  break;
                                  }
                    case "admin": {
                                ctx.commit('profile',[true,true,true,true,true]);
                                    this.$router.push('/GesyionUser');  
                                    break;
                                    }
                     }                                  
        })
        .catch((error) => {
            reject(error);
        })
    })
},
    logoutUser(ctx){
        return new Promise( (resolve) => {
            localStorage.removeItem('token');
            ctx.commit('setLoggedIn', false);
            resolve(true);
    })
    },
    setLoggedInState(ctx) {
        return new Promise((resolve) => {
            if( localStorage.getItem('token')){
                ctx.commit('setLoggedIn', true);
                resolve(true);
            }else{
            ctx.commit('setLoggedIn', false);
            resolve(false);
            }
        });
    },

    
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}