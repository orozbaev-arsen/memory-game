import Vue from 'vue';
import Vuex from 'vuex';
import actions from './actions';
import state from './state';
import getters from './getters';
import mutations from './mutations';
import socket from './socket';
import game from './modules/game';

Vue.use(Vuex);

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules: {
    game,
  },
  plugins: [
    socket(),
  ],
});

export default store;

