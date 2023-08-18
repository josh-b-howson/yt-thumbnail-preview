import { createApp } from 'vue'
import './assets/css/main.scss'
import App from './App.vue'
import router from './plugins/router'
import Link from './components/Link.vue'

const app = createApp(App)

app.component('Link', Link)
app.use(router).mount('#app')
