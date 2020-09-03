import Vue from 'vue'
// 兼容IE
import 'babel-polyfill'
//IOS点击事件300ms 延迟
import  FastClick  from  'fastclick'
// FastClick.attach(document.body);
//路由状态
import { sync } from 'vuex-router-sync';
import less from 'less'

import App from './App'
import router from './router'
import store from './store'


Vue.config.productionTip = false
Vue.use(less)
// VUE挂在公用方法
// import { ajaxServer, ajaxServerSign, ajaxServerSignToken, uploadImg} from "./libs/backend"
import backend from "./libs/backend"
Vue.prototype.$ajaxServer = backend.ajaxServer;
Vue.prototype.$ajaxServerSign = backend.ajaxServerSign;
Vue.prototype.$ajaxServerSignToken = backend.ajaxServerSignToken;
Vue.prototype.$uploadImg = backend.uploadImg;

// vuex-router
sync(store, router);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
