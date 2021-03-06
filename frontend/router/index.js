import Vue from 'vue';
import Router from 'vue-router';

import Home from '../components/Home';
import Auth from '../components/Auth';
import Game from '../components/Game';
import Finish from '../components/Finish';

Vue.use(Router);


export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/auth',
      name: 'Auth',
      component: Auth,
    },
    {
      path: '/game',
      name: 'Game',
      component: Game,
    },
    {
      path: '/finish',
      name: 'Finish',
      component: Finish,
    },
  ],
});
