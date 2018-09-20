require('./bootstrap');

import 'es6-promise/auto'
import VueRouter from 'vue-router';
import Vue from 'vue';
import Vuex from 'vuex';
import router from './router';
import store from './store';
import {sync} from 'vuex-router-sync';
import AppView from './components/App.vue'
import Vuse from './plugins/Vuse';
import Uploader from './plugins/Vuse/plugins/Uploader.vue'
import VueCircleSlider from 'vue-circle-slider'

import section1 from './components/landings/sections/section1';
import section2 from './components/landings/sections/section2';
import newsletter from './components/landings/forms/newsletter';
import hero1 from './components/landings/hero/hero1';
import hero2 from './components/landings/hero/hero2';
import social1 from './components/landings/social/social1';
import social2 from './components/landings/social/social2';
import social3 from './components/landings/social/social3';
import social4 from './components/landings/social/social4';
import layout1 from './components/landings/layouts/layout1';
import layout2 from './components/landings/layouts/layout2';
import gallery1 from './components/landings/galleries/gallery1';
import buttons from './components/landings/elements/buttons';

import pwa from './plugins/Vuse/plugins/pwa';

Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(VueCircleSlider);

Vuse.mix({
    components: {
        Uploader
    }
});

Vuse.component(section1);
Vuse.component(section2);
Vuse.component(newsletter);
Vuse.component(hero1);
Vuse.component(hero2);
Vuse.component(social1);
Vuse.component(social2);
Vuse.component(social3);
Vuse.component(social4);
Vuse.component(layout1);
Vuse.component(layout2);
Vuse.component(gallery1);
Vuse.component(buttons);

Vuse.use(pwa);

Vue.use(Vuse, {
    css: 'css/app.css',
    js: 'js/app.js',
    /*assets: {
        preview: [{
            css: 'css/app.css',
            js: 'js/app.js'
        }],
        download: [{
            css: 'css/app.css',
            js: 'js/app.js'
        }],
    },*/
    themes: [
        /*{
            name: 'Theme 1',
            sections: [hero1, section1, social1, social3, newsletter]
        },
        {
            name: 'Theme 2',
            sections: [hero2, section2, social3, social4, newsletter]
        },*/
        {
            name: 'Layout 1',
            sections: [layout1]
        },
        {
            name: 'Layout 2',
            sections: [layout2, gallery1]
        },
        {
            name: 'Gallery 1',
            sections: [gallery1]
        },
        {
            name: 'Buttons',
            sections: [buttons]
        }
    ]
});

sync(store, router);

new Vue(
    {
        router: router,
        store: store,
        data: {},
        render: h => h(AppView)
    }
).$mount('#root');
