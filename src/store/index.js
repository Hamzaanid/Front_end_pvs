import Vue from 'vue'
import Vuex from 'vuex'

import md_plainte from './modules/md_plainte'
import md_pvs from './modules/md_pvs'

Vue.use(Vuex)


const debug = process.env.NODE_ENV !== 'production'

const store = new Vuex.Store({
  modules: {
   md_plainte,
     md_pvs
  }
})

export default store
