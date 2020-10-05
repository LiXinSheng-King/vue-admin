import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 引入全局样式
import '@/assets/css/global.css'
// 引入表格树
import TreeTable from 'vue-table-with-tree-grid'
// 导入符文编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器对应的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
// import axios from 'axios'

// Vue.prototype.$message = Message

// Vue.prototype.$http = axios

// 挂载确认消息弹框
// Vue.prototype.$confirm = MessageBox.confirm

// 注册全局树型表格组件 tree-table
Vue.component('tree-table', TreeTable)
// 将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor)
// 定义全局的过滤器
Vue.filter('dataFormat', function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  // yyyy-mm-dd hh:mm:ss
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.config.productionTip = false
// Vue.use(ElementUI)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
