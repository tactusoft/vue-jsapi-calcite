import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { setAssetPath } from '@esri/calcite-components/dist/components';

// eslint-disable-next-line no-restricted-globals
setAssetPath(location.href);

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.mount('#app')
