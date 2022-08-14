import Vue from 'vue'
import Vuex from 'vuex'
import baseURL from '@/api/baseURL';
import axios from 'axios';
import user from './user';

Vue.use(Vuex)


//const debug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
  modules: {
      user
   },
  state () {
    return {
      // pour la consultation de vice procurreur 
      Allplaintes: [],
      Allpvs: [],
    }
  },

  getters:{
    getAllplaintes_vice:(state)=>{ return state.Allplaintes;},
    getAllpvs_vice:(state)=>{ return state.Allpvs;}

  },

  actions :{

    plainteDeVice({state},userid){
            axios
          .post(baseURL.api + "/plaint/plaints_of_user",{
            userID:userid
          }, {
            headers: { Authorization: `Bearer ${baseURL.token}` },
          })
          .then((rep) => {
            state.Allplaintes = rep.data;
          });
    },

   pvsDeVice({state},userid){
        axios
        .post(baseURL.api + "/pvs/pvs_of_user",{
          userID:userid
        }, {
          headers: { Authorization: `Bearer ${baseURL.token}` },
        })
        .then((rep) => {
          this.state.Allpvs = rep.data;
        });
  }

  }

});

export default store
