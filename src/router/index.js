import { createRouter, createWebHistory } from 'vue-router'
import { setHomeSEO, setTypeSEO } from '@/utils/seo'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // 路由切换时滚动行为
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
  routes: [
    {
      path: '/',
      component: () => import('@/views/layout/index.vue'),
      redirect: '/home',
      children: [
        {
          path: 'home',
          name: 'Home',
          component: () => import('@/views/home/index.vue'),
          meta: {
            title: '樱花动漫 - 专业的动漫观看平台',
            description:
              '樱花动漫提供最新最全的日本动漫、国产动漫在线观看，包含热门新番、经典动漫、动漫电影等。',
            keywords: '动漫,日本动漫,国产动漫,在线观看,新番,动漫电影,樱花动漫',
          },
        },
        {
          path: 'detail/:id?',
          name: 'Detail',
          component: () => import('@/views/detail/index.vue'),
          meta: {
            title: '动漫详情 - 樱花动漫',
            description: '观看动漫详情页面，樱花动漫提供高清流畅的观看体验。',
            keywords: '动漫详情,在线观看,樱花动漫',
          },
        },
        {
          path: 'animeType/:type',
          name: 'AnimeType',
          component: () => import('@/views/type/index.vue'),
          meta: {
            title: '动漫分类 - 樱花动漫',
            description: '樱花动漫分类页面，按类型浏览精彩动漫内容。',
            keywords: '动漫分类,动漫列表,樱花动漫',
          },
        },
        {
          path: 'search',
          name: 'Search',
          component: () => import('@/views/search/index.vue'),
          meta: {
            title: '搜索结果 - 樱花动漫',
            description: '搜索动漫内容，樱花动漫提供精准的搜索服务。',
            keywords: '搜索,动漫搜索,樱花动漫',
          },
        },
      ],
    },
  ],
})

// 路由守卫 - 处理SEO
router.beforeEach((to, from, next) => {
  // 根据路由设置相应的SEO信息
  if (to.name === 'Home') {
    setHomeSEO()
  } else if (to.name === 'AnimeType' && to.params.type) {
    setTypeSEO(to.params.type)
  }
  // 详情页的SEO会在组件内部根据具体数据设置

  next()
})

export default router
