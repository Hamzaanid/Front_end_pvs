import axios from 'axios';
import baseURL from '@/api/baseURL';

const state = {
    isLoggedIn: false,
    userDetails: {},

  // data of drawer        
        dossiers:false, // plaint et pvs
        decision_enquete:false,
        enquete:false, // pvs enquete ===>> pour ajouter dossier

        enqueteVice:false,
        juge_enquete:false,

        affectation:false,
        suivi:false,
        etude:false,
        statistic:false,
        statistic_p:false, // statistique khasssa
        gestDossiers:false,
        archive:true,
        comptes:false,
    
};

const getters = {
    loggedIn(state) {
        return state.isLoggedIn;
    },
}

const mutations = {
    userInfo(state,data){state.userDetails = data;},// userDetails
    profileBureau(state){
        state.dossiers = true;
      },
    profileVice(state){
        state.etude = true;
        state.statistic_p = true;
        state.enqueteVice = true;
    },
    profileProc(state){
        state.dossiers=true; // plaint et pvs
        //state.enquete=false;  //state.enqueteVice=true;
        state.decision_enquete=true;
        state.affectation=true;
        state.suivi=true;
        state.etude=true;
        state.statistic=true; //state.statistic_p=true;
        state.gestDossiers=true;
    },
    profileAdmin(){
        state.dossiers=true; // plaint et pvs
        state.enquete=true;  // state.enqueteVice=true;
        state.decision_enquete=true;
        state.affectation=true;
        state.suivi=true;
        state.etude=true;
        state.statistic=true;  state.statistic_p=true;
        state.gestDossiers=true; state.comptes = true;
    },
    profileJugeEnquete(state){
        state.juge_enquete = true;
      },
      profileF_enquete(state){
        state.enquete = true; // pvs enquete
        state.decision_enquete=true;
      },

    setLoggedIn(state, payload) {
        state.isLoggedIn = payload;
    },
    setUserDetails(state,userinfo){
        state.userDetails = userinfo;
    },
    defaultobject(state){
        state.dossiers=false; // plaint et pvs
        state.enquete=false;
        state.enqueteVice=false;
        state.juge_enquete=false; // pvs enquete
        state.affectation=false;
        state.suivi=false;
        state.etude=false;
        state.statistic=false;
        state.statistic_p=false;
        state.gestDossiers=false;
        state.archive=true;
        state.comptes=false;
        state.decision_enquete = false;
    }
};

const actions = {
    loginUser(ctx, payload){
        ctx.commit('defaultobject');
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
                             ctx.commit('profileBureau');
                                  break;
                                  }

                   case "vice_proc": { 
                                    ctx.commit('profileVice');
                                     break;
                                        }
                   case "proc": { 
                                ctx.commit('profileProc');
                                  break;
                                  }
                    case "admin": {
                                ctx.commit('profileAdmin');
                                    break;
                                }
                    case "f_enquête": { 
                                        ctx.commit('profileF_enquete');
                                            break;
                                    }
                    case "j_enquête": { 
                                          ctx.commit('profileJugeEnquete');
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
    profile(ctx,data){
        ctx.commit('userInfo',data);
        switch(data.role.nom) {
            case "user": { 
                     ctx.commit('profileBureau');
                          break;
                          }

           case "vice_proc": { 
                            ctx.commit('profileVice');
                             break;
                                }
           case "proc": { 
                        ctx.commit('profileProc');
                          break;
                          }
            case "admin": {
                        ctx.commit('profileAdmin');
                            break;
                        }
            case "f_enquête": { 
                                ctx.commit('profileF_enquete');
                                    break;
                            }
            case "j_enquête": { 
                                  ctx.commit('profileJugeEnquete');
                                      break;
                                }                
             }    
    }

    
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}