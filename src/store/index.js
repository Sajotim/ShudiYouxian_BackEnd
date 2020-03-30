import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import other from './modules/other'
import getters from './getters'
import settings from './modules/settings'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    other
  },
  getters
})

export default store
