import api_plaintes from '../../api/api_plaintes'
import axios from 'axios'
import baseURL from '@/api/baseURL'
// initial state

const state = () => ({
  typePlaints:[],
  sourcePlaints:[],

})

// getters
const getters = {
  
  }


// actions
const actions = {
    getDataPlaint(){
      axios.get(baseURL.api + "/plaint/type/index", {
        headers: {
          Authorization: `Bearer ${baseURL.token}`,
        },
      })
      .then((rep) => {
        this.state.typePlaints = rep.data;
        return rep.status;
      }).catch(err=>{
        return err.status;
      });
    }

}

// mutations
const mutations = {
  
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}