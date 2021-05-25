import { createApp } from 'vue'
import { router } from './router'
import antd from 'ant-design-vue'
import message from 'ant-design-vue'
import icons from '@/antd/index'
import App from './App.vue'
import store from './store'
import 'ant-design-vue/dist/antd.less'
import '@/assets/css/ani.less'
import '@/assets/css/variable.less'
import '@/assets/css/index.less'

const app = createApp(App)

icons.forEach((i) => {
  app.component(i.name, i)
})
app.use(message);
app
  .use(store)
  .use(antd)
  .use(router)
  .mount('#app')
