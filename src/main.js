// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

/* 延迟加载图片 */
import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload)

/* element-ui */
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI);

/* GLOBAL value */
import GLOBAL from './components/GLOBAL'
Vue.prototype.GLOBAL = GLOBAL

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  render: h => h(App)
})