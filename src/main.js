import { createApp } from 'vue'
import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'
import VueLazyLoad from 'vue3-lazy'
import './assets/styles/beginner-base.css'
import './assets/utilities.css'
import 'element-plus/dist/index.css'
// 导入占位符图片
import defaultCover from './assets/images/default_cover.jpg'

import App from './App.vue'
import router from './router'

const app = createApp(App)

// 创建 pinia 实例并添加持久化插件
const pinia = createPinia()
pinia.use(persist)

// 配置vue3-lazy懒加载 - 优化占位符显示
app.use(VueLazyLoad, {
  loading: defaultCover, // 加载中显示占位图
  error: defaultCover, // 加载失败显示占位图
  observerOptions: {
    rootMargin: '100px', // 提前100px开始加载，减少白屏时间
    threshold: 0.01, // 降低阈值
  },
  log: import.meta.env.DEV, // 只在开发环境开启调试日志
  lifecycle: {
    loading: (el) => {
      // 加载开始时立即显示占位符
      el.style.opacity = '1'
      el.style.backgroundImage = `url(${defaultCover})`
      el.style.backgroundSize = 'cover'
      el.style.backgroundPosition = 'center'
      el.style.backgroundRepeat = 'no-repeat'
      if (import.meta.env.DEV) {
        console.log('🔄 开始懒加载:', el.dataset.src)
      }
    },
    loaded: (el) => {
      // 加载完成时移除背景图
      el.style.backgroundImage = ''
      if (import.meta.env.DEV) {
        console.log('✅ 懒加载完成:', el.src)
      }
    },
    error: (el) => {
      // 加载失败时保持占位符
      el.style.backgroundImage = `url(${defaultCover})`
      if (import.meta.env.DEV) {
        console.log('❌ 懒加载失败:', el.dataset.src)
      }
    },
  },
})

app.use(pinia)
app.use(router)

app.mount('#app')
