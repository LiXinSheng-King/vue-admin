import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI, { Message, MessageBox } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/global.css'
// import axios from 'axios'

Vue.prototype.$message = Message

// Vue.prototype.$http = axios

// 挂载确认消息弹框
Vue.prototype.$confirm = MessageBox.confirm

Vue.config.productionTip = false
Vue.use(ElementUI)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
