<script setup>
/* WeekItem 组件 - 每周动漫轮播卡片 */

/* ===== 1. 导入依赖 ===== */
// Vue 核心组合式API
import { ref, computed, onMounted, onUnmounted } from 'vue'
// 路由相关
import { useRouter } from 'vue-router'
// Swiper轮播组件
import { Swiper, SwiperSlide } from 'swiper/vue'
import { FreeMode, Mousewheel } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/free-mode'
// 自定义组件
import AnimeCard from '@/components/AnimeCard.vue'

/* ===== 2. 路由和Swiper配置初始化 ===== */
const router = useRouter()
const swiperModules = [FreeMode, Mousewheel]

/* ===== 3. 组件属性定义 ===== */
const props = defineProps({
  // 动漫列表数据
  list: {
    type: Array,
    default: () => [],
  },
})

/* ===== 4. 响应式状态数据 ===== */
// 4.1 分页相关状态
const currentPageIndex = ref(0) // 当前显示第几页（从0开始计数）
const cardsPerPage = ref(6) // 每页显示的卡片数量

// 4.2 设备和布局状态
const isMobile = ref(false) // 是否是小屏幕（≤768px）

// 4.3 Swiper相关引用
const swiperInstance = ref(null)
const cardContainer = ref(null)

/* ===== 5. 计算属性 ===== */
// 5.1 数据统计计算属性
const totalCards = computed(() => {
  return props.list?.length || 0
})

const totalPages = computed(() => {
  return Math.ceil(totalCards.value / cardsPerPage.value) - 1 // 减1是因为从0开始计数
})

const cardsToShow = computed(() => {
  return props.list || []
})

/* ===== 6. 核心事件处理函数 ===== */
// 6.1 Swiper实例初始化回调
/**
 * Swiper实例初始化回调
 * @param {Object} swiper - Swiper实例对象
 * @description 保存Swiper实例引用，用于后续的手动翻页控制
 */
const onSwiper = (swiper) => {
  swiperInstance.value = swiper
}

// 6.2 Swiper滑动事件回调
/**
 * Swiper滑动事件回调
 * @param {Object} swiper - Swiper实例对象
 * @description 处理滑动事件，智能更新页码（PC端分页模式）或跳过（移动端自由模式）
 */
const onSlideChange = (swiper) => {
  if (isMobile.value) {
    return
  }

  let newPageIndex = Math.floor(swiper.activeIndex / cardsPerPage.value)
  const maxPageIndex = totalPages.value

  if (newPageIndex > maxPageIndex) {
    newPageIndex = maxPageIndex
  }

  if (swiper.activeIndex >= totalCards.value - cardsPerPage.value) {
    newPageIndex = maxPageIndex
  }

  if (newPageIndex !== currentPageIndex.value) {
    currentPageIndex.value = newPageIndex
  }
}

/* ===== 7. 响应式布局核心函数 ===== */
// 7.1 响应式布局更新主函数
/**
 * 根据屏幕宽度更新每页卡片数量
 * @description 响应式设计核心逻辑：992px以下显示4个，1200px以下显示5个，其他显示6个
 * @returns {void}
 */
const updateCardsPerPage = () => {
  const oldCardsPerPage = cardsPerPage.value
  const currentWidth = window.innerWidth

  if (currentWidth < 992) {
    cardsPerPage.value = 4
  } else if (currentWidth < 1200) {
    cardsPerPage.value = 5
  } else {
    cardsPerPage.value = 6
  }

  if (oldCardsPerPage !== cardsPerPage.value) {
    currentPageIndex.value = 0
  }
}

// 7.2 设备类型检测函数
/**
 * 检查是否为移动端设备
 * @description 检测屏幕宽度是否小于等于768px，决定Swiper的滑动模式
 * @returns {void}
 */
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
}

/* ===== 8. 翻页控制API函数 ===== */
// 8.1 重置到第一页（最常用的操作）
/**
 * 重置到第一页
 * @description 重置Swiper到第一页并更新页码状态，通常在数据更新时调用
 * @returns {void}
 */
const resetToFirstPage = () => {
  if (!swiperInstance.value) {
    return
  }

  swiperInstance.value.slideTo(0)
  currentPageIndex.value = 0
}

// 8.2 下一页翻页
/**
 * 跳转到下一页
 * @description 调用Swiper的slideNext方法，触发分页动画
 * @returns {void}
 */
const goToNextPage = () => {
  if (!swiperInstance.value) {
    return
  }

  const currentPage = currentPageIndex.value + 1
  const totalPageCount = totalPages.value + 1

  if (currentPage >= totalPageCount) {
    return
  }

  swiperInstance.value.slideNext()
}

// 8.3 上一页翻页
/**
 * 跳转到上一页
 * @description 调用Swiper的slidePrev方法，触发分页动画
 * @returns {void}
 */
const goToPrevPage = () => {
  if (!swiperInstance.value) {
    return
  }

  const currentPage = currentPageIndex.value + 1

  if (currentPage <= 1) {
    return
  }

  swiperInstance.value.slidePrev()
}

/* ===== 9. 组件生命周期管理 ===== */
// 9.1 窗口大小变化处理函数
/**
 * 窗口大小变化处理函数
 * @description 响应窗口大小变化，按正确顺序更新布局和设备状态
 * @returns {void}
 */
const handleResize = () => {
  checkMobile()
  updateCardsPerPage()
}

// 9.2 组件挂载初始化
/**
 * 组件挂载时执行初始化
 * @description 按正确顺序初始化响应式布局，添加事件监听器
 * @returns {void}
 */
onMounted(() => {
  checkMobile()
  updateCardsPerPage()
  window.addEventListener('resize', handleResize)
})

// 9.3 组件卸载清理
/**
 * 组件卸载时清理资源
 * @description 移除事件监听器，防止内存泄漏，清理Swiper实例引用
 * @returns {void}
 */
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (swiperInstance.value) {
    swiperInstance.value = null
  }
})

/* ===== 10. 业务逻辑和路由导航 ===== */
// 10.1 动漫详情页面导航
/**
 * 点击卡片查看动漫详情
 * @param {Object} animeItem - 动漫数据对象
 * @param {string} animeItem.id - 动漫ID（必需）
 * @param {string} animeItem.title - 动漫标题（可选）
 * @param {string} animeItem.country - 动漫国家/地区（可选）
 * @description 验证数据完整性后导航到动漫详情页面
 * @returns {void}
 */
const viewAnimeDetail = (animeItem) => {
  if (!animeItem || !animeItem.id) {
    return
  }

  router.push({
    path: `/detail/${animeItem.id}`,
    query: animeItem.country
      ? {
          country: animeItem.country,
        }
      : {},
  })
}

/* ===== 11. 组件对外接口 ===== */
/**
 * 暴露方法和状态给父组件使用
 * @description 提供完整的翻页控制API、状态查询和高级功能接口
 */
defineExpose({
  // === 翻页控制API ===
  resetToFirstPage, // 重置到第一页
  handleNext: goToNextPage, // 下一页（兼容现有代码）
  handlePrev: goToPrevPage, // 上一页（兼容现有代码）
  goToNextPage, // 下一页（推荐使用）
  goToPrevPage, // 上一页（推荐使用）

  // === 状态数据查询 ===
  currentPageIndex, // 当前页码索引（从0开始）
  cardsPerPage, // 每页卡片数量
  isMobile, // 是否移动端设备
  totalCards, // 总卡片数量（计算属性）
  totalPages, // 总页数（计算属性）

  // === 高级功能接口 ===
  swiperInstance, // Swiper实例引用
  updateCardsPerPage, // 手动更新卡片数量
  checkMobile, // 手动检测设备类型
  viewAnimeDetail, // 动漫详情导航方法
})
</script>

<template>
  <div class="week_item user-select-none overflow-hidden">
    <Swiper
      ref="cardContainer"
      class="w-full h-auto"
      :modules="swiperModules"
      :slides-per-view="isMobile ? 3 : cardsPerPage"
      :slides-per-group="isMobile ? 1 : cardsPerPage"
      :space-between="isMobile ? 10 : 0"
      :free-mode="isMobile ? { enabled: true, sticky: false } : false"
      :mousewheel="isMobile ? { forceToAxis: true } : false"
      :grab-cursor="true"
      :allow-touch-move="true"
      :watch-slides-progress="false"
      :watch-slides-visibility="false"
      :resize-observer="false"
      @swiper="onSwiper"
      @slideChange="onSlideChange"
    >
      <SwiperSlide
        v-for="card in cardsToShow"
        :key="card.id"
        class="card_content_li cursor-pointer flex-shrink-0"
        @click="viewAnimeDetail(card)"
      >
        <AnimeCard :list="card" />
      </SwiperSlide>
    </Swiper>
  </div>
</template>

<style scoped>
/* WeekItem 组件样式 */

.week_item {
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
}

.week_item img {
  pointer-events: auto;
}

.card_content_li {
  width: 16.66666667%;
}

.text-ellipsis {
  -webkit-line-clamp: 1;
  line-clamp: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.swiper-container {
  overflow: visible;
}

.swiper-container .swiper-slide {
  width: auto !important;
  margin-right: 0 !important;
}

.swiper-container .card_content_li {
  width: 16.66666667% !important;
  padding: 10px !important;
}

@media (min-width: 1200px) and (max-width: 1309px) {
  .swiper-container .card_content_li {
    width: 195px !important;
  }
}

@media (max-width: 1200px) {
  .swiper-container .card_content_li {
    width: 20% !important;
  }
}

@media (max-width: 992px) {
  .swiper-container .card_content_li {
    width: 25% !important;
  }
}

@media (max-width: 768px) {
  .swiper-container .card_content_li {
    width: 33.33333333% !important;
    padding: 0 !important;
  }
}
</style>
