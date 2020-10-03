import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI, { Message, MessageBox } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'
// import axios from 'axios'

Vue.prototype.$message = Message

// Vue.prototype.$http = axios

// 挂载确认消息弹框
Vue.prototype.$confirm = MessageBox.confirm

// 注册全局树型表格组件 tree-table
Vue.component('tree-table', TreeTable)

Vue.config.productionTip = false
Vue.use(ElementUI)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
