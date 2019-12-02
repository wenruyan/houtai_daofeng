import Vue from 'vue';
import axios from './router/axios';
import VueAxios from 'vue-axios';
import App from './App';
import router from './router/router';
import './permission'; // 权限
import './error'; // 日志
import './cache'; //页面缓存
import store from './store';
import {
  loadStyle
} from './util/util'
import * as urls from '@/config/env';
import Element from 'element-ui';
import {
  iconfontUrl,
  iconfontVersion
} from '@/config/env';
import i18n from './lang' // Internationalization
import './styles/common.scss';
import basicBlock from './components/basic-block/main'
import basicContainer from './components/basic-container/main'

// 引入公共样式 _flex _box _normalize
import './assets/base.scss'


Vue.use(router)
Vue.use(VueAxios, axios)
Vue.use(Element, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(window.AVUE, {
  i18n: (key, value) => i18n.t(key, value)
})
//注册全局容器
Vue.component('basicContainer', basicContainer)
Vue.component('basicBlock', basicBlock)
// 加载相关url地址
Object.keys(urls).forEach(key => {
  Vue.prototype[key] = urls[key];
})

// 动态加载阿里云字体库
iconfontVersion.forEach(ele => {
  loadStyle(iconfontUrl.replace('$key', ele));
})
localStorage.getItem('userInfoCard') && store.commit("CHANGE_USERINFO_CARD", localStorage.getItem('userInfoCard') == 'true' ? true : false);
localStorage.getItem('userInfoCard') && store.commit("CHANGE_HEADER_FIXED", localStorage.getItem('headerFixed') == 'true' ? true : false);
localStorage.getItem('siderFixed') && store.commit("CHANGE_SIDER_FIXED", localStorage.getItem('siderFixed') == 'true' ? true : false);
localStorage.getItem('siderIcon') && store.commit("CHANGE_SIDER_ICON", localStorage.getItem('siderIcon') == 'true' ? true : false);
localStorage.getItem('topNav') && store.commit("CHANGE_NAV_TOP", localStorage.getItem('topNav') == 'true' ? true : false);
let selectedTheme = localStorage.getItem('selectedTheme');
localStorage.getItem('selectedTheme') && store.commit("CHANGE_SELECTED_THEME", JSON.parse(selectedTheme));

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
