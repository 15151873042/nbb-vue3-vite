import {createApp} from 'vue'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'

const app =createApp(App)

app.use(ElementPlus)

app.mount('#app')

import { version } from '../package.json'
console.log(`%c当前项目版本号: ${version}`, 'color: #42b883; font-size: 16px; font-weight: bold;')