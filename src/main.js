import Vue from 'vue';

import axios from 'axios';
import VueAxios from 'vue-axios';
import VueRouter from 'vue-router';
import router from './router';
import Index from './Index';
import walletManager from "./walletManager";

Vue.router = router;
Vue.use(VueRouter);
Vue.use(VueAxios, axios);
Vue.use(walletManager);

if (window.location.href.indexOf('nft-meetup-example.github.io') > -1 || window.location.href.indexOf('ost:') > -1)
    new Vue({
        render: h => h(Index),
        el: '#app',
        router
    });
