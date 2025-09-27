<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import {
  Search,
  Timer,
  VideoPlay,
  Collection,
  DataAnalysis,
  Expand,
  User,
} from '@element-plus/icons-vue'

import { Icon } from '@iconify/vue'
import { useRoute, useRouter } from 'vue-router'
import { useScroll, useElementBounding } from '@vueuse/core'
const route = useRoute()
const router = useRouter()

// 判断是否在详情页
const isDetailPage = computed(() => route.path.startsWith('/detail/'))
const headerRef = ref(null)
const { y: scrollY } = useScroll(window)
const { height: headerHeight } = useElementBounding(headerRef)
const shouldShowDetailBackground = computed(() => {
  return isDetailPage.value && scrollY.value >= headerHeight.value
})

// 设备检测
const isMobile = ref(false)
const checkDevice = () => {
  isMobile.value = window.innerWidth <= 768
}

// 根据country参数显示对应的标题
const mobileTitle = computed(() => {
  if (!isDetailPage.value) return ''
  const country = route.query.country
  if (country === 'japan') return '日本动漫'
  if (country === 'china') return '国产动漫'
  return '动漫详情'
})

// 导航激活状态管理
const activeNav = ref('/') // 默认首页激活
const init = () => {
  const route_path = route.path
  if (route_path === '/' || route_path === '/home') {
    activeNav.value = '/'
  } else if (route_path === '/animeType/japan') {
    activeNav.value = '/animeType/japan'
  } else if (route_path === '/animeType/china') {
    activeNav.value = '/animeType/china'
  } else if (route_path.startsWith('/detail/')) {
    // 详情页根据country参数激活对应导航
    if (route.query.country === 'japan') {
      activeNav.value = '/animeType/japan'
    } else if (route.query.country === 'china') {
      activeNav.value = '/animeType/china'
    } else {
      activeNav.value = '' // 没有country参数时不激活任何导航
    }
  } else {
    // 其他页面直接匹配路径
    activeNav.value = route_path
  }
}
// 监听路由变化，实时更新导航状态
watch(
  () => route.path,
  () => {
    init()
  },
  { immediate: true },
)

watch(
  () => route.query,
  () => {
    init()
  },
  { immediate: true },
)

onMounted(() => {
  init()
  checkDevice()
  window.addEventListener('resize', checkDevice)
})

// ================================
// 侧边栏相关逻辑
// ================================
// 侧边栏显示控制
const showSidebar = ref(false)

// 控制侧边栏显示/隐藏
const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value
}

// 关闭侧边栏
const closeSidebar = () => {
  showSidebar.value = false
}

// 监听侧边栏状态，修复移动端样式问题
watch(showSidebar, (newValue) => {
  // 在移动端，当侧边栏状态改变时手动处理body样式
  if (window.innerWidth <= 768) {
    const body = document.body

    if (newValue) {
      // 侧边栏打开时：移除Element Plus添加的问题样式
      setTimeout(() => {
        if (body.classList.contains('el-popup-parent--hidden')) {
          body.style.width = '100%'
          body.style.paddingRight = '0'
          body.style.overflow = 'auto'
        }
      }, 0)
    } else {
      // 侧边栏关闭时：确保样式正常
      body.style.width = ''
      body.style.paddingRight = ''
      body.style.overflow = ''
    }
  }
})

// 侧边栏菜单数据（完全按照截图）
const sidebarMenuItems = [
  {
    id: '1',
    title: '首页',
    route: '/',
    icon: 'home',
    count: null,
  },
  {
    id: '2',
    title: 'APP',
    route: '/app',
    icon: 'app',
    count: null,
  },
  {
    id: '3',
    title: '日本动漫',
    route: '/animeType/japan',
    icon: 'japanese',
    count: null,
  },
  {
    id: '4',
    title: '国产动漫',
    route: '/animeType/china',
    icon: 'chinese',
    count: null,
  },
  {
    id: '5',
    title: '动漫电影',
    route: '/movie',
    icon: 'movie',
    count: null,
  },
  {
    id: '6',
    title: '欧美动漫',
    route: '/korea',
    icon: 'western',
    count: null,
  },
  {
    id: '7',
    title: '动漫资讯',
    route: '/news',
    icon: 'news',
    count: null,
  },
  {
    id: '8',
    title: '专题',
    route: '/topic',
    icon: 'special',
    count: null,
  },
  {
    id: '9',
    title: '留言',
    route: '/message',
    icon: 'message',
    count: null,
  },
  {
    id: '10',
    title: '最新',
    route: '/latest',
    icon: 'latest',
    count: null,
  },
  {
    id: '11',
    title: '排行',
    route: '/ranking',
    icon: 'ranking',
    count: null,
  },
]

// 处理菜单点击
const handleSidebarMenuClick = (menuItemIndex) => {
  const selectedItem = sidebarMenuItems.find((item) => item.id === menuItemIndex)
  if (selectedItem) {
    router.push(selectedItem.route)
    closeSidebar()
    handleNavClick(selectedItem.route)
  }
}

// Menu组件的open/close回调（必需的）
const handleOpen = () => {}
const handleClose = () => {}

// 根据图标类型获取对应的图标
const getMenuIcon = (iconType) => {
  const iconMap = {
    home: 'mdi:home',
    app: 'mdi:apps',
    japanese: 'mdi:television-classic',
    chinese: 'mdi:flag-triangle',
    movie: 'mdi:movie-open',
    western: 'mdi:earth',
    news: 'mdi:newspaper',
    special: 'mdi:star-box',
    message: 'mdi:message-text',
    latest: 'mdi:new-box',
    ranking: 'mdi:chart-line',
  }
  return iconMap[iconType] || 'mdi:circle'
}

// 点击导航项处理函数
const handleNavClick = (navPath) => {
  activeNav.value = navPath
}

// 返回按钮处理函数
const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}

// 鼠标拖拽滑动功能
const navRef = ref(null)
let isDragging = false
let startX = 0
let scrollLeft = 0
let velocity = 0
let lastX = 0
let lastTime = 0
let animationId = null

const handleMouseDown = (e) => {
  if (!navRef.value) return
  isDragging = true
  startX = e.pageX
  lastX = e.pageX
  lastTime = Date.now()
  scrollLeft = navRef.value.scrollLeft
  velocity = 0
  navRef.value.style.cursor = 'grabbing'
  // 停止任何正在进行的惯性滚动
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
  e.preventDefault()
}

const handleMouseMove = (e) => {
  if (!isDragging || !navRef.value) return
  e.preventDefault()

  const currentTime = Date.now()
  const currentX = e.pageX
  const deltaX = currentX - lastX
  const deltaTime = currentTime - lastTime

  // 计算速度（用于惯性滚动）
  if (deltaTime > 0) {
    velocity = deltaX / deltaTime
  }

  // 平滑滚动
  const walk = (currentX - startX) * 1.2
  navRef.value.scrollLeft = scrollLeft - walk

  lastX = currentX
  lastTime = currentTime
}

// 惯性滚动函数
const inertiaScroll = () => {
  if (!navRef.value || Math.abs(velocity) < 0.1) {
    animationId = null
    return
  }

  navRef.value.scrollLeft -= velocity * 16 // 16ms per frame
  velocity *= 0.95 // 减速

  animationId = requestAnimationFrame(inertiaScroll)
}

const handleMouseUp = () => {
  isDragging = false
  if (navRef.value) {
    navRef.value.style.cursor = 'grab'
    // 开始惯性滚动
    if (Math.abs(velocity) > 0.5) {
      inertiaScroll()
    }
  }
}

const handleMouseLeave = () => {
  isDragging = false
  if (navRef.value) {
    navRef.value.style.cursor = 'grab'
  }
}

// 鼠标滚轮水平滚动
const handleWheel = (e) => {
  if (navRef.value) {
    e.preventDefault()
    navRef.value.scrollLeft += e.deltaY
  }
}

onMounted(() => {
  // 延迟绑定，确保DOM完全渲染
  setTimeout(() => {
    if (navRef.value) {
      navRef.value.addEventListener('mousedown', handleMouseDown)
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      navRef.value.addEventListener('mouseleave', handleMouseLeave)
      navRef.value.addEventListener('wheel', handleWheel, { passive: false })
      navRef.value.style.cursor = 'grab'
    }
  }, 100)
})

onBeforeUnmount(() => {
  // 清理设备检测事件监听器
  window.removeEventListener('resize', checkDevice)

  // 清理导航拖拽事件监听器
  if (navRef.value) {
    navRef.value.removeEventListener('mousedown', handleMouseDown)
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
    navRef.value.removeEventListener('mouseleave', handleMouseLeave)
    navRef.value.removeEventListener('wheel', handleWheel)
  }
})
</script>
<template>
  <div class="layout">
    <!-- 头部 - Layout负责 -->
    <header
      ref="headerRef"
      class="header"
      :class="{
        'header-transparent': isDetailPage,
        'header-detail-scrolled': shouldShowDetailBackground,
      }"
    >
      <div class="header-container">
        <!-- 桌面端Header (桌面端或非详情页) -->
        <template v-if="!isMobile || !isDetailPage">
          <div class="logo"></div>
          <nav class="nav" ref="navRef">
            <router-link
              to="/"
              :class="['nav-item', 'nav-priority-high', { nav_active: activeNav === '/' }]"
              style="margin-left: 0"
              @click="handleNavClick('/')"
              >首页</router-link
            >
            <router-link
              to="/app"
              :class="['nav-item', 'nav-priority-low', { nav_active: activeNav === '/app' }]"
              @click="handleNavClick('/app')"
              >APP</router-link
            >
            <router-link
              to="/animeType/japan"
              :class="[
                'nav-item',
                'nav-priority-low',
                {
                  nav_active: activeNav === '/animeType/japan' || route.query.country === 'japan',
                },
              ]"
              @click="handleNavClick('/animeType/japan')"
              >日本动漫</router-link
            >
            <router-link
              to="/animeType/china"
              :class="[
                'nav-item',
                'nav-priority-low',
                { nav_active: activeNav === '/animeType/china' || route.query.country === 'china' },
              ]"
              @click="handleNavClick('/animeType/china')"
              >国产动漫</router-link
            >
            <router-link
              to="/usa"
              :class="['nav-item', 'nav-priority-low', { nav_active: activeNav === '/usa' }]"
              @click="handleNavClick('/usa')"
              >动漫电影</router-link
            >
            <router-link
              to="/china"
              :class="['nav-item', 'nav-priority-low', { nav_active: activeNav === '/korea' }]"
              @click="handleNavClick('/korea')"
              >欧美动漫</router-link
            >
            <router-link
              to="/news"
              :class="['nav-item', 'nav-priority-medium', { nav_active: activeNav === '/news' }]"
              @click="handleNavClick('/news')"
              >动漫资讯</router-link
            >
            <router-link
              to="/topic"
              :class="['nav-item', 'nav-priority-medium', { nav_active: activeNav === '/topic' }]"
              @click="handleNavClick('/topic')"
              >专题</router-link
            >
            <router-link
              to="/message"
              :class="['nav-item', 'nav-priority-medium', { nav_active: activeNav === '/message' }]"
              @click="handleNavClick('/message')"
              >留言</router-link
            >
            <router-link
              to="/latest"
              :class="['nav-item', 'nav-priority-medium', { nav_active: activeNav === '/latest' }]"
              @click="handleNavClick('/latest')"
              >最新</router-link
            >
            <router-link
              to="/ranking"
              :class="['nav-item', 'nav-priority-medium', { nav_active: activeNav === '/ranking' }]"
              style="margin-right: 50px"
              @click="handleNavClick('/ranking')"
              >排行</router-link
            >
            <span class="nav-item nav-priority-all cursor-pointer" @click="toggleSidebar">
              全部<Expand />
            </span>
          </nav>
          <div class="search">
            <input type="text" placeholder="搜索..." class="search-input" />
            <button class="search-button">
              <Search />
              <span>搜索</span>
            </button>
          </div>
          <div class="conch-list">
            <ul class="conch-list-ul">
              <li class="conch-list-li">
                <a href="#" draggable="false"><Timer /></a>
              </li>
              <li class="conch-list-li">
                <a href="#" draggable="false"><VideoPlay /></a>
              </li>
              <li class="conch-list-li">
                <a href="#" draggable="false"><Collection /></a>
              </li>
              <li class="conch-list-li">
                <a href="#" draggable="false"><DataAnalysis /></a>
              </li>
              <li class="conch-list-li">
                <div class="user"><User /></div>
              </li>
            </ul>
          </div>
        </template>
        <!-- 移动端详情页专用Header -->
        <template v-if="isMobile && isDetailPage">
          <div class="mobile-header-content">
            <a href="javascipt:;" class="mobile-back-button" @click="goBack" draggable="false">
              <Icon icon="mdi:arrow-left" class="mobile-back-icon" />
            </a>
            <div class="mobile-title">{{ mobileTitle }}</div>
            <button class="mobile-menu-button" @click="toggleSidebar">
              <Icon icon="mdi:menu" class="mobile-menu-icon" />
            </button>
          </div>
        </template>
      </div>
    </header>

    <!-- ================================ -->
    <!-- 左侧侧边栏 -->
    <!-- ================================ -->
    <el-drawer
      v-model="showSidebar"
      title=""
      :with-header="false"
      direction="ltr"
      size="280px"
      :modal="true"
      :lock-scroll="false"
      :append-to-body="false"
      class="sidebar-drawer"
      :style="{ backgroundColor: '#3a3a3a' }"
    >
      <!-- 侧边栏头部 -->
      <div class="sidebar-header" :style="{ backgroundColor: '#3a3a3a' }">
        <div class="sidebar-logo">
          <Icon icon="mdi:cherry-blossom" class="logo-icon" />
          <span class="logo-text">樱花动漫</span>
        </div>
        <el-button type="text" class="sidebar-close-btn" @click="closeSidebar">
          <Icon icon="mdi:close" />
        </el-button>
      </div>

      <!-- Element Plus Menu 组件 -->
      <div :style="{ backgroundColor: '#3a3a3a' }">
        <el-menu
          class="sidebar-menu"
          background-color="#3a3a3a"
          text-color="#ccc"
          active-text-color="#ff6600"
          :default-active="activeNav"
          @select="handleSidebarMenuClick"
          @open="handleOpen"
          @close="handleClose"
          :style="{ backgroundColor: '#3a3a3a' }"
        >
          <el-menu-item
            v-for="item in sidebarMenuItems"
            :key="item.id"
            :index="item.id"
            class="custom-menu-item"
          >
            <Icon class="menu-item-icon" :icon="getMenuIcon(item.icon)" />
            <span class="menu-item-text">{{ item.title }}</span>
            <span v-if="item.count" class="menu-item-count">{{ item.count }}</span>
          </el-menu-item>
        </el-menu>
      </div>
    </el-drawer>
    <!-- 主体 - 根据路由提供不同结构 -->
    <main class="main">
      <!-- 详情页：全屏背景 + 不受限的 router-view -->
      <template v-if="isDetailPage">
        <router-view />
      </template>

      <!-- 其他页面：正常版心容器 -->
      <div v-else class="main-container">
        <router-view />
      </div>
    </main>

    <!-- 底部 - Layout负责 -->
    <footer class="footer">
      <div class="footer-container">
        <p>&copy; 2024 电影网站</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* 头部样式 */
.header {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  background: #1a1a1a;
  z-index: 1000;
  box-shadow: 0 0 20px hsla(0, 0%, 0%, 0.3);
  transition: all 0.3s ease;
  overflow: hidden;
}

/* 详情页透明背景 */
.header-transparent {
  background: transparent;
}

/* 详情页滚动后显示背景色 */
.header-detail-scrolled {
  background: #1a1a1a !important;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease;
}

/* 详情页时svg图标变为白色 */
.header-transparent .conch-list-li svg {
  color: #fff !important;
}

.header-transparent .search-button svg {
  color: #fff !important;
}

.header-transparent .nav-item svg {
  color: #fff !important;
}

/* 详情页时展开图标也变为白色 */
.header-transparent .nav-priority-all svg {
  color: #fff !important;
}

/* 详情页时导航文字确保为白色 */
.header-transparent .nav-item {
  color: #fff !important;
}

/* 激活状态仍然保持橙色 */
.header-transparent .nav_active {
  color: #f46b03 !important;
}

/* 悬停效果保持橙色 */
.header-transparent .conch-list-li a svg:hover {
  color: #f46b03 !important;
}
.header-transparent .search {
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0px 0px 21px -8px rgba(0, 0, 0, 0.8);
}
.header-transparent .search input::placeholder {
  color: white;
}
.header-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.logo {
  background-image: url('@/assets/images/logo.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 128px;
  height: 44px;
  flex-shrink: 0;
}
.search {
  position: relative;
  flex: 1;
  min-width: 160px;
  height: 40px;
  margin-left: 30px;
  background-color: #252525;
  line-height: 30px;
  border-radius: 20px;
}
.search-input {
  height: 100%;
  outline: none;
  border: 0;
  padding-left: 10px;

  color: #fff;
  background-color: transparent;
}
.search-button {
  position: absolute;
  right: 0;
  top: 0;
  width: 74px;
  height: 100%;
  background-color: #f46b03;
  border-radius: 20px;
  border: 0;
  color: white;
}
.search-button span {
  font-size: 14px;
  font-weight: 400;
}
.search-button svg {
  width: 1em;
  height: 1em;
  margin-right: 3px;
  font-size: 16px;
  vertical-align: text-bottom;
}
.conch-list {
  line-height: 60px;
}
.conch-list-ul {
  display: flex;
  align-items: center;
  line-height: 60px;
}
.conch-list-li {
  width: 25px;
  height: 60px;
  margin-left: 15px;
  list-style: none;
}
.conch-list-li svg {
  display: inline-block;
  width: 22px;
  height: 22px;
  color: #666666;
  vertical-align: middle;
  cursor: pointer;
  transition: transform 0.3s ease;
}
.conch-list-li .user {
  width: 32px;
  height: 32px;
  line-height: 30px;
  text-align: center;
  margin-top: 16px;
  background-color: #252525;
  border-radius: 50%;
  cursor: pointer;
}
.conch-list-li .user svg {
  width: 18px;
  height: 18px;
}
.conch-list-li a svg:hover {
  color: #f46b03;
  transform: scale(1.1);
  transition: transform 0.3s ease;
}
.nav {
  margin-left: 30px;
}

.nav-item {
  display: inline-block; /* 水平排列 */
  color: #fff; /* 修改为白色字体 */
  margin-left: 30px; /* 添加左右间距 */
  text-decoration: none; /* 去掉下划线 */
  cursor: pointer;
  font-size: 16px;
}
.nav-priority-medium {
  display: none;
}

.nav-item svg {
  width: 20px;
  height: 20px;
  margin-left: 5px;
  vertical-align: text-bottom;
}
.nav_active {
  font-weight: 800;
  color: #f46b03;
}
/* 主体 - 只提供版心，不写具体内容 */
.main {
  position: relative;
  flex: 1;
  background: #0f0f0f;
}

/* 已移除未使用的detail_topbg相关样式 */
.main-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 20px 0;
  min-height: calc(100vh - 120px);
}

/* 底部样式 */
.footer {
  background: #1a1a1a;
}

.footer-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

/* ========================================== */
/* ============= Element Plus 移动端兼容性修复 ============== */
/* 修复 el-drawer 在移动端的 body 样式问题 */
:global(.el-popup-parent--hidden) {
  width: 100% !important;
  padding-right: 0 !important;
}

/* 修复 drawer 遮罩在移动端的问题 */
:global(.el-overlay) {
  position: fixed !important;
}

/* 确保页面在移动端不会被drawer影响 */
@media (max-width: 768px) {
  :global(body.el-popup-parent--hidden) {
    width: 100% !important;
    padding-right: 0 !important;
    overflow: auto !important;
  }
}

/* ============= 响应式媒体查询 ============== */
/* ========================================== */

/* ===== 超大桌面 (≥1310px) ===== */
@media (min-width: 1310px) {
  .main-container,
  .header-container {
    width: 1280px;
  }
}

/* ===== 大桌面 (1200px - 1309px) ===== */
@media (min-width: 1200px) and (max-width: 1309px) {
  .main-container,
  .header-container {
    width: 1170px;
  }
}

/* ===== 中等桌面 (992px - 1199px) ===== */
@media (max-width: 1200px) {
  .header-container,
  .main-container,
  .footer-container {
    max-width: 970px;
  }

  .main-container {
    padding: 20px 10px;
  }
}
/* 移除了未使用的detail_topbg媒体查询 */
@media (min-width: 768px) and (max-width: 991px) {
  .main-container,
  .header-container {
    width: 750px;
  }
}

/* ===== 导航项隐藏 - 1300px以下 ===== */
@media (max-width: 1299px) {
  .nav-item:nth-child(6) {
    /* 隐藏：欧美动漫 */
    display: none;
  }
}

/* ===== 导航项隐藏 - 1200px以下 ===== */
@media (max-width: 1199px) {
  .nav-item:nth-child(5) {
    /* 隐藏：动漫电影 */
    display: none;
  }

  .nav-item {
    margin-left: 25px; /* 缩小导航间距 */
  }
}

/* ===== 导航项隐藏 - 1100px以下 ===== */
@media (max-width: 1099px) {
  .nav-item:nth-child(2) {
    /* 隐藏：APP */
    display: none;
  }
}

/* ===== 导航项隐藏 - 1050px以下 ===== */
@media (max-width: 1050px) {
  .nav-item:nth-child(4) {
    /* 隐藏：国产动漫 */
    display: none;
  }
}

/* ===== 导航项隐藏 - 999px以下 ===== */
@media (max-width: 999px) {
  .nav {
    flex-shrink: 0;
  }
  .nav-item:nth-child(3) {
    /* 隐藏：日本动漫 */
    display: none;
  }
}

/* ===== 小桌面/平板横屏 (768px - 992px) ===== */
@media (max-width: 992px) {
  .main-container {
    padding: 10px;
  }

  .footer-container {
    padding: 20px 25px;
  }
}

/* ===== 两行布局 - 770px以下 ===== */
@media (max-width: 770px) {
  /* === 头部调整为两行布局 === */

  .header-container {
    position: relative;
    align-content: flex-start; /* 内容从上开始排列 */
    padding: 10px 20px; /* 增加上下内边距 */
    flex-wrap: wrap; /* 允许换行 */
  }

  /* === 第一行：Logo + 搜索框 + 用户图标 === */
  .logo {
    order: 1;
    margin-bottom: 0;
  }

  .search {
    order: 2;
    margin-left: 20px; /* 与logo的间距 */
    margin-right: 0;
    min-width: 0; /* 允许收缩到很小 */
    margin-bottom: 0;
  }

  .conch-list {
    order: 3;
    margin-bottom: 0;
  }

  /* === 第二行：导航菜单（可滚动） === */
  .nav {
    order: 4;
    width: 100%; /* 占满整行 */
    margin-left: 0;
    margin-top: 10px;
    display: flex; /* flex布局 */
    flex-wrap: nowrap; /* 不换行 */
    overflow-x: auto; /* 水平滚动 */
    overflow-y: hidden; /* 隐藏垂直滚动 */
    padding: 8px 15px;
    scrollbar-width: none; /* 隐藏滚动条 */
    -ms-overflow-style: none;
    user-select: none; /* 禁止选择文本 */
    cursor: grab; /* 显示抓手光标 */
    scroll-behavior: auto; /* 禁用默认平滑滚动 */
    will-change: scroll-position; /* 优化滚动性能 */
  }

  /* 隐藏滚动条 */
  .nav::-webkit-scrollbar {
    display: none; /* 隐藏Chrome/Safari滚动条 */
  }

  /* 导航项样式调整 */
  .nav-item {
    flex-shrink: 0;
    margin-left: 15px;
    margin-right: 15px;
    user-select: none; /* 禁止选择文本 */
    -webkit-user-select: none; /* Safari */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* IE/Edge */
    -webkit-user-drag: none; /* 禁止拖拽 */
  }

  .nav-item:first-child {
    margin-left: 0; /* 重置首页的margin-left */
  }

  /* 重新显示之前隐藏的导航项 */
  .nav-item:nth-child(3),
  .nav-item:nth-child(4),
  .nav-item:nth-child(5),
  .nav-item:nth-child(6) {
    display: block;
  }

  .nav-priority-medium {
    display: block;
  }

  /* "全部"按钮固定在右侧 */
  .nav-priority-all {
    position: absolute;
    padding-left: 10px;
    right: 0;
    background: #1a1a1a;
  }
}

/* ===== 平板竖屏 (576px - 768px) ===== */
@media (max-width: 768px) {
  .main-container {
    padding: 15px 20px;
  }

  .footer-container {
    padding: 15px 20px;
  }
  .header-transparent .logo,
  .header-transparent .search,
  .header-transparent .nav,
  .header-transparent .conch-list {
    display: none;
  }
}

/* ===== 中等手机 (600px - 699px) ===== */
@media (max-width: 699px) {
  .search {
    margin-left: 20px;
    margin-right: 15px;
  }

  .conch-list-li {
    margin-left: 10px;
  }
}

/* ===== 小手机 (450px - 599px) ===== */
@media (max-width: 599px) {
  /* 只保留最后一个用户图标 */
  .conch-list-li:not(:last-child) {
    display: none;
  }

  .nav-priority-high {
    margin-left: 15px;
  }
}

/* ===== 手机端通用 (≤576px) ===== */
@media (max-width: 576px) {
  .header-container,
  .main-container,
  .footer-container {
    max-width: 100%;
    padding: 15px;
  }

  .main-container {
    padding: 15px;
  }

  .footer-container {
    padding: 15px;
  }
}

/* ===== 超小手机 (≤450px) ===== */
@media (max-width: 450px) {
  /* 隐藏所有右侧图标 */
  .conch-list-li {
    display: none;
  }

  .search {
    margin-right: 0;
  }

  /* 搜索按钮样式调整 */
  .search-button span {
    font-size: 12px;
  }

  .search-button svg {
    width: 14px;
    height: 14px;
  }
}

/* ===== 移动端Header样式 ===== */
.mobile-header-content {
  width: 100%;
  display: flex;
  min-height: 50px;
  align-items: center;
  justify-content: space-between;
  background: transparent;
  color: white;
}

.mobile-back-button,
.mobile-menu-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.2s ease;
}

.mobile-back-button:hover,
.mobile-menu-button:hover {
  background: rgba(255, 255, 255, 0.1);
}

.mobile-back-icon,
.mobile-menu-icon {
  width: 24px;
  height: 24px;
  color: #fff;
}

.mobile-title {
  color: #fff;
  font-size: 18px;
  font-weight: 500;
  margin: 0;
  text-align: center;
  flex: 1;
  line-height: 1.2;
}

/* 确保在小屏幕上也能正常显示 */
@media (max-width: 360px) {
  .mobile-title {
    font-size: 16px;
  }

  .mobile-back-icon,
  .mobile-menu-icon {
    width: 20px;
    height: 20px;
  }
}

/* ===== 侧边栏样式 ===== */
/* 简化的抽屉样式 */
.sidebar-drawer :deep(.el-drawer__body) {
  padding: 0 !important;
  background: #3a3a3a !important;
}

.sidebar-drawer :deep(.el-drawer__header) {
  display: none !important;
}

.sidebar-drawer :deep(.el-overlay) {
  background-color: rgba(0, 0, 0, 0.5) !important;
}

/* 简化的侧边栏背景样式 */
.sidebar-drawer .el-menu {
  background: #3a3a3a !important;
  border: none !important;
}

/* 侧边栏头部样式 */
.sidebar-header {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  padding: 20px !important;
  background: #3a3a3a !important;
  background-color: #3a3a3a !important;
  border-bottom: none !important;
  position: relative !important;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 28px;
  height: 28px;
  color: #ff6b9d;
}

.logo-text {
  font-size: 18px;
  font-weight: 700;
  color: #ff6b9d;
  letter-spacing: 1px;
}

.sidebar-close-btn {
  color: #888 !important;
  background: transparent !important;
  border: none !important;
  padding: 4px !important;
  width: 24px !important;
  height: 24px !important;
  border-radius: 4px !important;
  position: absolute;
  top: 15px;
  right: 15px;
}

.sidebar-close-btn:hover {
  background: rgba(255, 255, 255, 0.1) !important;
  color: #fff !important;
}

/* Menu组件样式 */
.sidebar-drawer .sidebar-menu {
  border: none !important;
  background: #3a3a3a !important;
  background-color: #3a3a3a !important;
  padding: 0 !important;
  margin-top: 10px !important;
}

.sidebar-drawer :deep(.el-menu) {
  border: none !important;
  background: #3a3a3a !important;
  background-color: #3a3a3a !important;
}

.sidebar-drawer :deep(.el-menu-item) {
  display: flex !important;
  align-items: center !important;
  padding: 16px 20px !important;
  height: auto !important;
  background: transparent !important;
  color: #ccc !important;
  transition: all 0.2s ease !important;
}

.sidebar-drawer :deep(.el-menu-item:hover) {
  background: rgba(255, 255, 255, 0.05) !important;
  color: #fff !important;
}

.sidebar-drawer :deep(.el-menu-item.is-active) {
  background: rgba(255, 107, 109, 0.1) !important;
  color: #ff6b6d !important;
}

.sidebar-drawer .menu-item-icon {
  color: #ff6600 !important;
  margin-right: 15px !important;
  width: 20px !important;
  height: 20px !important;
  flex-shrink: 0 !important;
}

.sidebar-drawer .menu-item-text {
  flex: 1 !important;
  font-size: 15px !important;
  font-weight: 400 !important;
  color: #ccc !important;
}

.sidebar-drawer .menu-item-count {
  background: #ff6600 !important;
  color: #fff !important;
  padding: 2px 8px !important;
  border-radius: 12px !important;
  font-size: 12px !important;
  font-weight: 600 !important;
  margin-left: auto !important;
  min-width: 30px !important;
  text-align: center !important;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .sidebar-drawer :deep(.el-drawer) {
    width: 85% !important;
    max-width: 320px !important;
  }

  .sidebar-header {
    padding: 16px;
  }

  .logo-text {
    font-size: 16px;
  }

  .sidebar-drawer :deep(.el-menu-item) {
    padding: 10px 16px !important;
  }
}
</style>

<style>
/* 全局样式 - 简化的Drawer背景覆盖 */
.sidebar-drawer .el-drawer,
.sidebar-drawer .el-drawer__body,
.sidebar-drawer .el-menu {
  background: #3a3a3a !important;
  --el-bg-color: #3a3a3a !important;
  --el-menu-bg-color: #3a3a3a !important;
}
</style>
