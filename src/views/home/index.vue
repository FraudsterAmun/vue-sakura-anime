<script setup>
/* ===== 1. 导入依赖 ===== */
// Vue 核心组合式API
import { onMounted, onBeforeUnmount, ref, computed } from 'vue'

// 状态管理
import { useHomeStore } from '@/stores'

// Element Plus 组件和图标
import { Management, Link } from '@element-plus/icons-vue'

// 自定义组件
import AnimeRankingList from '@/components/AnimeRankingList.vue'
import AnimeHeader from './components/AnimeHeader.vue'
import WeekItem from '@/views/home/components/WeekItem.vue'

// Swiper 轮播图组件
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'

// Swiper 样式
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

// 设备检测工具
import { useDevice } from '@/utils/device'

/* ===== 2. 状态管理初始化 ===== */
const homeStore = useHomeStore()

/* ===== 3. 响应式数据定义 ===== */
// 移动端检测 - 使用简化的 useDevice 组合式函数
const { isMobile } = useDevice()

// 当前选中的星期
const currentWeekday = ref(getTodayWeekday())

// 组件引用
const weekAnimeHeaderRef = ref(null)
const weekAnimeCardRef = ref(null)
const bannerSwiperRef = ref(null)
const japanAnimeHotHeaderRef = ref(null)

// 星期列表配置
const weekList = ref([
  { label: '周一', shortLabel: '一', value: 1 },
  { label: '周二', shortLabel: '二', value: 2 },
  { label: '周三', shortLabel: '三', value: 3 },
  { label: '周四', shortLabel: '四', value: 4 },
  { label: '周五', shortLabel: '五', value: 5 },
  { label: '周六', shortLabel: '六', value: 6 },
  { label: '周日', shortLabel: '日', value: 7 },
])

/* ===== 4. 工具函数 ===== */
/**
 * 获取今天是星期几
 * @returns {number} 1-7，1代表周一，7代表周日
 */
function getTodayWeekday() {
  const today = new Date()
  const dayOfWeek = today.getDay() // 0-6，0代表周日
  // 转换为1-7，1代表周一，7代表周日
  return dayOfWeek === 0 ? 7 : dayOfWeek
}

/* ===== 5. 计算属性 ===== */
// 从卡片组件获取当前页码
const currentPageFromCard = computed(() => {
  return weekAnimeCardRef.value?.currentPageIndex || 0
})

// 从卡片组件获取总卡片数
const totalCards = computed(() => {
  return weekAnimeCardRef.value?.totalCards || 6
})

// 从卡片组件获取每页卡片数
const cardsPerPage = computed(() => {
  return weekAnimeCardRef.value?.cardsPerPage || 6
})

// Swiper 配置项
const swiperOptions = computed(() => ({
  modules: [Navigation, Pagination, Autoplay],
  slidesPerView: 1,
  spaceBetween: 0,
  loop: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  pagination: isMobile.value
    ? false
    : {
        el: '.swiper-pagination',
        clickable: true,
      },
  grabCursor: true,
  allowTouchMove: true,
}))

/* ===== 6. 事件处理函数 ===== */
/**
 * 切换星期的处理函数
 * @param {number} weekValue - 星期值 (1-7)
 */
function handleWeekChange(weekValue) {
  currentWeekday.value = weekValue
  homeStore.getJapanWeekAnimeList(weekValue)

  // 重置到第一页
  if (weekAnimeHeaderRef.value && weekAnimeCardRef.value) {
    weekAnimeHeaderRef.value.resetToFirstPage()
    weekAnimeCardRef.value.resetToFirstPage()
  }
}

/**
 * 上一页处理函数
 */
function handleWeekAnimePrev() {
  if (weekAnimeCardRef.value) {
    weekAnimeCardRef.value.handlePrev()
  }
}

/**
 * 下一页处理函数
 */
function handleWeekAnimeNext() {
  if (weekAnimeCardRef.value) {
    weekAnimeCardRef.value.handleNext()
  }
}

/**
 * 重置到第一页处理函数
 */
function handleWeekAnimeReset() {
  if (weekAnimeCardRef.value) {
    weekAnimeCardRef.value.resetToFirstPage()
  }
}

/**
 * Swiper 实例回调
 * @param {Object} swiper - Swiper 实例
 */
function onBannerSwiper(swiper) {
  bannerSwiperRef.value = swiper
}

/* ===== 7. 生命周期钩子 ===== */
onMounted(() => {
  // useDevice 会自动处理设备检测

  // 获取数据
  const todayWeekday = getTodayWeekday()

  // 并行加载所有数据
  Promise.allSettled([
    homeStore.getJapanWeekAnimeList(todayWeekday),
    homeStore.getBannerList(),
    homeStore.getHotAnimeList(),
    homeStore.getJapanRankingList(),
    homeStore.getChinaRankingList(),
    homeStore.getChinaRankingTitleList(),
    homeStore.getJapanRankingTitleList(),
    homeStore.getAnimeTopicsList(),
    homeStore.getAnimeNewsList(),
  ]).catch((error) => {
    console.error('数据加载失败:', error)
  })
})

onBeforeUnmount(() => {
  // useDevice 会自动清理，无需手动销毁
})
</script>

<template>
  <div class="banner-container no-select relative w-full overflow-hidden">
    <Swiper
      v-bind="swiperOptions"
      @swiper="onBannerSwiper"
      class="banner-swiper w-full overflow-hidden"
    >
      <SwiperSlide v-for="item in homeStore.bannerList" :key="item.id">
        <div class="carousel-item flex relative w-full h-full">
          <div class="left-image relative overflow-hidden">
            <img
              :src="item.data_original"
              :alt="item.title || '动漫图片'"
              draggable="false"
              class="anime-image transition-transform w-full h-full object-cover"
            />
            <div class="image-info absolute">
              <div class="anime-title text-shadow-dark">{{ item.title }}</div>
              <div class="update-info text-shadow-light">{{ item.subtitle }}</div>
            </div>
          </div>
        </div>
      </SwiperSlide>

      <!-- 导航按钮 -->
      <div
        class="swiper-button-prev custom-nav-btn flex-center absolute cursor-pointer"
        v-if="!isMobile"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
        </svg>
      </div>
      <div
        class="swiper-button-next custom-nav-btn flex-center absolute cursor-pointer"
        v-if="!isMobile"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
        </svg>
      </div>

      <!-- 分页指示器 (只在PC端显示) -->
      <div class="swiper-pagination" v-if="!isMobile"></div>
    </Swiper>
  </div>

  <div class="anime_week no-select">
    <AnimeHeader
      ref="weekAnimeHeaderRef"
      :showPagination="true"
      title="日漫更新"
      :icon="Management"
      :totalPage="homeStore.animeJapanWeekAnimeList.length"
      :currentPageFromCard="currentPageFromCard"
      :totalCards="totalCards"
      :cardsPerPage="cardsPerPage"
      @prev="handleWeekAnimePrev"
      @next="handleWeekAnimeNext"
      @reset="handleWeekAnimeReset"
    >
      <template #center>
        <div class="week_list custom-scrollbar">
          <ul class="flex">
            <li
              v-for="item in weekList"
              :key="item.value"
              :class="{ active: currentWeekday === item.value }"
              @click="handleWeekChange(item.value)"
              class="border-radius-20 transition-all"
            >
              <a href="javascript:void(0)" draggable="false">
                <span class="week-label-full">{{ item.label }}</span>
                <span class="week-label-short">{{ item.shortLabel }}</span>
              </a>
            </li>
          </ul>
        </div>
      </template>
    </AnimeHeader>
    <WeekItem ref="weekAnimeCardRef" :list="homeStore.animeJapanWeekAnimeList"></WeekItem>
  </div>

  <div class="anime_hot_box no-select">
    <AnimeHeader
      ref="japanAnimeHotHeaderRef"
      :showPagination="false"
      title="热门动漫"
      :icon="Management"
    >
    </AnimeHeader>

    <div class="anime_grid grid_col_6 relative w-full">
      <AnimeCard
        :showPagination="false"
        v-for="card in homeStore.hotAnimeList"
        :key="card.id"
        :list="card"
      >
      </AnimeCard>
    </div>
  </div>

  <div class="japan_anime_ranking_card no-select">
    <AnimeHeader :showPagination="false" title="日本动漫" :icon="Management" subTitle="日漫排行">
    </AnimeHeader>
    <div class="anime_grid grid_col_6 relative w-full">
      <AnimeCard
        v-for="card in homeStore.japanAnimeRankingList"
        :key="card.id"
        :list="card"
      ></AnimeCard>
    </div>
    <div class="more_anime" v-if="isMobile">
      <a href="javascript:;" draggable="false">更多日本动漫></a>
    </div>
    <AnimeRankingList
      :rankingData="homeStore.japanRankingTitleList"
      title="日本动漫排行榜"
      :rankingData2="homeStore.japanAnimeRankingList"
    />
  </div>
  <div class="china_anime_ranking_card no-select">
    <AnimeHeader :showPagination="false" title="国产动漫" :icon="Management" subTitle="国漫排行">
    </AnimeHeader>
    <div class="anime_grid grid_col_6 relative w-full">
      <AnimeCard
        v-for="card in homeStore.animeChinaRankingList"
        :key="card.id"
        :list="card"
      ></AnimeCard>
    </div>
    <div class="more_anime" v-if="isMobile">
      <a href="javascript:;" draggable="false">更多国产动漫></a>
    </div>
    <AnimeRankingList
      :rankingData="homeStore.chinaRankingTitleList"
      title="国产动漫排行榜"
      :rankingData2="homeStore.animeChinaRankingList"
    />
  </div>

  <div class="anime_topics no-select mb-30">
    <AnimeHeader :showPagination="false" title="动漫专题" :icon="Management"> </AnimeHeader>
    <ul class="grid grid-row4">
      <li
        v-for="item in homeStore.animeTopicsList"
        :key="item.id"
        class="list-item relative min-w-0"
      >
        <a
          href="javascript:void(0)"
          class="anime_topics_item border-radius-8 relative block w-full h-full overflow-hidden"
          :style="{ backgroundImage: `url(${item.background_image})` }"
        >
          <div class="anime_topics_item_content absolute">
            <div class="anime_topics_title">{{ item.title }}</div>
            <div class="anime_topics_count border-radius-20 inline-block">
              共{{ item.new_anime_count }}部
            </div>
          </div>
          <div class="item-mask">
            <el-icon class="mask-icon"><Link /></el-icon>
          </div>
        </a>
      </li>
    </ul>
  </div>

  <div class="anime_news no-select">
    <AnimeHeader :showPagination="false" title="动漫资讯" :icon="Management"> </AnimeHeader>
    <ul class="grid grid-row6">
      <li v-for="item in homeStore.animeNewsList" :key="item.id" class="list-item relative min-w-0">
        <a href="javascript:;" class="news_link block w-full h-full" draggable="false">
          <img v-lazy="item.cover" class="border-radius-8 w-full object-cover" draggable="false" />
          <div class="item-mask" v-if="!isMobile">
            <el-icon class="mask-icon"><Link /></el-icon>
          </div>
          <div class="anime_news_info">
            <div class="anime_news_item_title text-ellipsis-2">{{ item.title }}</div>

            <div class="anime_news_item_info flex items-center">
              <div class="anime_news_item_tag whitespace-nowrap">{{ item.category }}</div>
              <div class="split"></div>
              <div class="anime_news_item_author whitespace-nowrap">{{ item.tag }}</div>
              <div class="split"></div>
              <div class="anime_news_item_time text-ellipsis whitespace-nowrap">
                {{ item.date }}
              </div>
            </div>
          </div>
        </a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* ============================================================================
   CSS 样式组织结构
   ============================================================================
   1. 项目特定工具类
   2. 组件基础样式
   3. 布局相关样式
   4. 轮播图样式
   5. 动漫网格样式
   6. 动漫专题样式
   7. 动漫资讯样式
   8. 响应式媒体查询
   ============================================================================ */

/* ===== 1. 项目特定工具类 ===== */
/* 1.1 用户选择禁用样式已移至工具类 utilities.css */

/* 1.2 文字阴影效果 */
.text-shadow-dark {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

.text-shadow-light {
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

/* 1.3 边框圆角 */
.border-radius-8 {
  border-radius: 8px;
}

.border-radius-20 {
  border-radius: 20px;
}

/* 1.4 过渡动画 */
.transition-transform {
  transition: transform 0.6s ease;
}

/* 1.5 间距 */
.mb-30 {
  margin-bottom: 30px;
}

/* ===== 2. 组件基础样式 ===== */
/* 2.1 遮罩效果 */
.item-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 8px;
  opacity: 0;
  z-index: 10;
  transition: opacity 0.3s ease;
  pointer-events: auto;
}

.item-mask:hover {
  opacity: 1;
}
.item-mask:hover .mask-icon {
  transform: translate(-50%, -50%) scale(0.9);
  transition: all 0.3s ease;
}
.mask-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(1.2);
  font-size: 24px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  color: white;
  background-color: rgba(0, 0, 0, 0.5);
  transition: all 0.3s ease;
  cursor: pointer;
}

.mask-icon:hover {
  background-color: #f35306;
}

/* 2.2 更多动漫按钮 */
.more_anime {
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-radius: 20px;
  margin: 10px 0;
  background-color: #252525;
}

.more_anime a {
  color: #666;
}

.more_anime:hover a {
  color: #fff;
}

/* ===== 3. 布局相关样式 ===== */
/* 3.1 网格布局 */
.grid {
  display: grid;
}

.grid-row4 {
  grid-template-columns: repeat(4, 1fr);
}

.grid-row6 {
  grid-template-columns: repeat(6, 1fr);
}

.anime_grid {
  display: grid;
}

.grid_col_6 {
  grid-template-columns: repeat(6, 1fr);
}

/* 3.2 列表项 */
.list-item {
  padding: 0 10px;
}

/* 3.3 排行卡片容器 */
.japan_anime_ranking_card,
.china_anime_ranking_card {
  position: relative;
}

/* ===== 4. 轮播图样式 ===== */
/* 4.1 轮播图容器 */
.banner-container {
  margin-bottom: 30px;
  border-radius: 12px;
}

.banner-swiper {
  height: 500px;
  border-radius: 12px;
}

.carousel-item {
  background: #000000;
}

/* 4.2 轮播图内容 */
.left-image {
  flex: 1;
}

.anime-image {
  transition: transform 0.6s ease;
}

.banner-swiper:hover .anime-image {
  transform: scale(1.1);
}

.image-info {
  bottom: 30px;
  left: 30px;
  color: white;
  z-index: 2;
}

.anime-title {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
}

.update-info {
  font-size: 14px;
  color: #ddd;
  line-height: 1.4;
  max-width: 300px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
}

/* 4.3 Swiper 分页指示器 */
:deep(.swiper-pagination) {
  position: absolute;
  right: 40px !important;
  bottom: 30px !important;
  left: auto !important;
  width: auto !important;
  text-align: right;
}

:deep(.swiper-pagination-bullet) {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  transition: all 0.3s ease;
  margin: 0 4px !important;
  opacity: 1;
}

:deep(.swiper-pagination-bullet:hover) {
  background-color: rgba(255, 153, 51, 0.8);
  transform: scale(1.3);
}

:deep(.swiper-pagination-bullet-active) {
  background-color: #ff9933 !important;
  transform: scale(1.4);
}

/* 4.4 Swiper 导航按钮 */
.custom-nav-btn {
  top: 50%;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.5) 100%);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform: translateY(-50%);
  box-shadow:
    0 4px 15px rgba(0, 0, 0, 0.2),
    0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.custom-nav-btn svg {
  width: 20px;
  height: 20px;
  transition: all 0.3s ease;
}

.custom-nav-btn:hover {
  background: linear-gradient(135deg, #ff6b35 0%, #f7931e 100%);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow:
    0 6px 20px rgba(255, 107, 53, 0.4),
    0 4px 15px rgba(0, 0, 0, 0.2);
}

.custom-nav-btn:active {
  transform: translateY(-50%) scale(1.05);
  transition: all 0.1s ease;
}

.swiper-button-prev.custom-nav-btn {
  left: 25px;
}

.swiper-button-next.custom-nav-btn {
  right: 25px;
}

/* 隐藏默认Swiper箭头 */
:deep(.swiper-button-prev):after,
:deep(.swiper-button-next):after {
  content: none;
}

/* 4.5 按钮显示动画 */
.banner-swiper .custom-nav-btn {
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s ease;
}

.banner-swiper:hover .custom-nav-btn {
  opacity: 0.8;
  pointer-events: auto;
}

.banner-swiper:hover .custom-nav-btn:hover {
  opacity: 1;
}

/* 4.6 周列表样式 */
.week_list {
  overflow-x: auto;
  overflow-y: hidden;
}

.week_list ul {
  height: 100%;
}

.week_list li {
  padding: 4px 15px;
  margin-left: 15px;
  background-color: #252525;
  cursor: pointer;
}

.week_list li.active,
.week_list li:hover {
  background-color: #f57d00;
  color: #fff;
}

.week_list li.loading {
  pointer-events: none;
  opacity: 0.7;
}

.week-label-full {
  display: inline;
}

.week-label-short {
  display: none;
}

/* 4.7 滚动条样式 */
.custom-scrollbar::-webkit-scrollbar,
.week_list::-webkit-scrollbar {
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track,
.week_list::-webkit-scrollbar-track {
  background: #2a2a2a;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb,
.week_list::-webkit-scrollbar-thumb {
  background: #555;
  border-radius: 3px;
  transition: background 0.3s ease;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover,
.week_list::-webkit-scrollbar-thumb:hover {
  background: #777;
}

/* ===== 5. 动漫专题样式 ===== */
/* 5.1 专题容器 */
.anime_topics {
  margin-bottom: 30px;
}

.anime_topics ul {
  grid-template-columns: repeat(4, 1fr);
  margin-top: 40px;
}

.anime_topics ul li,
.anime_news ul li {
  padding: 0 10px;
}

/* 5.2 专题卡片装饰 */
.anime_topics ul li:after,
.anime_topics ul li:before {
  content: '';
  position: absolute;
  border-radius: 10px 10px 0px 0px;
  background-color: rgba(95, 95, 95, 0.25);
  z-index: 0;
}

.anime_topics ul li:before {
  width: calc(100% - 60px);
  height: 30px;
  top: -21px;
  left: 30px;
}

.anime_topics ul li:after {
  width: calc(100% - 40px);
  height: 30px;
  top: -10px;
  left: 19px;
}

/* 5.3 专题项样式 */
.anime_topics_item {
  z-index: 999;
  padding-top: 56%;
  background-position: 50% 50%;
  background-size: cover;
}

.anime_topics_item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60%;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.6) 30%,
    rgba(0, 0, 0, 0.3) 60%,
    transparent 100%
  );
  pointer-events: none;
}

.anime_topics_item_content {
  bottom: 20px;
  padding: 0 20px;
  color: #fff;
  z-index: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.anime_topics_title {
  font-size: 16px;
  font-weight: 700;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
  max-height: calc(1.4em * 2);
}

.anime_topics_count {
  padding: 3px 15px;
  background-color: rgba(0, 0, 0, 0.5);
  font-weight: 600;
  margin-top: 10px;
}

/* ===== 6. 动漫资讯样式 ===== */
/* 6.1 资讯图片 */
.anime_news ul li .el-image {
  width: 100%;
  height: 110px;
  border-radius: 8px;
}

.anime_news ul li img {
  height: 110px;
  border-radius: 8px;
}

.anime_news .item-mask {
  height: 110px;
}

/* 6.2 资讯内容 */
.anime_news_item_title {
  font-size: 16px;
  font-weight: 700;
  line-height: 1.4;
  margin: 8px 0;
}

.anime_news_item_info {
  color: #888;
  font-size: 12px;
  flex-wrap: nowrap;
  overflow: hidden;
}

.anime_news ul li .el-image:hover + .item-mask,
.anime_news ul li .item-mask:hover {
  opacity: 1;
}

.anime_news_item_tag {
  background-color: #252525;
  padding: 3px;
  flex-shrink: 0;
  white-space: nowrap;
}

.split {
  width: 1px;
  height: 10px;
  margin: 0 10px;
  background-color: #888;
}

/* ===== 7. 响应式媒体查询 ===== */
/* 7.1 大屏幕 (≤ 1200px) */
@media (max-width: 1200px) {
  .anime_grid {
    grid-template-columns: repeat(5, 1fr);
  }

  .anime_grid .anime_card_item:nth-last-child(-n + 2) {
    display: none;
  }

  .banner-swiper {
    height: 450px;
  }

  .grid-row6 {
    grid-template-columns: repeat(5, 1fr);
  }

  .grid-row6 .list-item:last-child {
    display: none;
  }
}

/* 7.2 中等屏幕 (≤ 992px) */
@media (max-width: 992px) {
  .anime_grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .banner-swiper {
    height: 400px;
  }

  /* 简化的卡片显示控制 */
  .japan_anime_ranking_card :deep(.anime_grid) .anime_card_item:nth-last-child(-n + 3) {
    display: none !important;
  }
  .china_anime_ranking_card :deep(.anime_grid) .anime_card_item:nth-last-child(-n + 3) {
    display: none !important;
  }
  .anime_grid .anime_card_item:nth-last-child(-n + 2) {
    display: block;
  }
  .anime_topics .grid-row4 {
    grid-template-rows: repeat(2, 1fr);
    grid-template-columns: repeat(2, 1fr);
  }

  .anime_topics .grid-row4 .list-item {
    margin-bottom: 40px;
  }

  .grid-row6 {
    grid-template-columns: repeat(4, 1fr);
  }

  .grid-row6 .list-item:nth-last-child(-n + 2) {
    display: none;
  }

  .week-label-full {
    display: none !important;
  }

  .week-label-short {
    display: inline !important;
  }
}

/* 7.3 小屏幕 (≤ 770px) */
@media (max-width: 770px) {
  .banner-swiper {
    height: 350px;
  }
}

/* 7.4 平板屏幕 (≤ 768px) */
@media (max-width: 768px) {
  .anime_grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  .banner-container {
    margin-bottom: 20px;
    border-radius: 8px;
  }

  .carousel-item {
    flex-direction: column;
  }

  .left-image {
    height: 60%;
  }

  .image-info {
    bottom: 15px;
    left: 15px;
    right: 15px;
  }

  .anime-title {
    font-size: 16px;
    line-height: 1.3;
  }

  .update-info {
    font-size: 11px;
    max-width: none;
    line-height: 1.4;
  }

  .anime_topics .grid-row4 {
    grid-template-columns: repeat(1, 1fr);
  }

  .grid-row6 {
    grid-template-columns: repeat(1, 1fr);
  }
  /* 简化的卡片显示控制 */
  .japan_anime_ranking_card :deep(.anime_grid) .anime_card_item:nth-last-child(-n + 3) {
    display: block !important;
  }
  .china_anime_ranking_card :deep(.anime_grid) .anime_card_item:nth-last-child(-n + 3) {
    display: block !important;
  }
  :deep(.swiper-pagination) {
    right: 15px !important;
    bottom: 20px !important;
  }

  .custom-nav-btn {
    width: 40px;
    height: 40px;
    border-radius: 20px;
  }

  .custom-nav-btn svg {
    width: 16px;
    height: 16px;
  }

  .swiper-button-prev.custom-nav-btn {
    left: 15px;
  }

  .swiper-button-next.custom-nav-btn {
    right: 15px;
  }

  .banner-swiper:hover .custom-nav-btn:hover {
    transform: translateY(-50%) scale(1.05);
  }

  /* 移动端显示所有卡片 */
  .japan_anime_ranking_card :deep(.anime_grid) .anime_card_item,
  .china_anime_ranking_card :deep(.anime_grid) .anime_card_item {
    display: block !important;
  }

  .anime_news ul li {
    padding-bottom: 10px;
    overflow: hidden;
  }

  .news_link {
    display: flex;
    border-radius: 8px;
    margin-bottom: 15px;
  }

  .anime_news ul li img {
    width: 15%;
    height: auto;
    object-fit: cover;
    border-radius: 8px;
    flex-shrink: 0;
  }

  .anime_news_info {
    margin-left: 10px;
    flex: 1;
    min-width: 0;
  }

  .anime_news_item_title {
    font-size: 14px !important;
    margin: 0 0 8px 0 !important;
    color: #fff;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .anime_news_item_info {
    font-size: 11px !important;
    gap: 4px;
  }

  .anime_news_item_tag {
    flex-shrink: 0;
    white-space: nowrap;
  }

  .anime_news_item_author {
    flex: 0 1 auto;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    min-width: 30px;
  }

  .anime_news_item_time {
    flex: 1 2 auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 20px;
  }

  .split {
    flex-shrink: 0;
  }
}

/* 7.5 小平板屏幕 (≤ 590px) */
@media (max-width: 590px) {
  .week_list {
    width: 100%;
    margin-top: 10px;
  }

  .week_list li {
    width: 11.7125%;
    text-align: center;
    padding: 4px 0px;
  }

  .week_list ul li:first-child {
    margin-left: 0;
  }
}

/* 7.6 手机屏幕 (≤ 576px) */
@media (max-width: 576px) {
  .banner-swiper {
    height: 280px;
  }

  .banner-container {
    margin-bottom: 15px;
    border-radius: 6px;
  }

  .image-info {
    bottom: 10px;
    left: 10px;
    right: 10px;
  }

  .anime-title {
    font-size: 14px;
    margin-bottom: 4px;
  }

  .update-info {
    font-size: 10px;
    line-height: 1.3;
  }

  :deep(.swiper-pagination) {
    right: 10px !important;
    bottom: 10px !important;
  }

  :deep(.swiper-pagination-bullet) {
    width: 6px;
    height: 6px;
  }

  .custom-nav-btn {
    width: 35px;
    height: 35px;
    border-radius: 17.5px;
  }

  .custom-nav-btn svg {
    width: 14px;
    height: 14px;
  }

  .swiper-button-prev.custom-nav-btn {
    left: 10px;
  }

  .swiper-button-next.custom-nav-btn {
    right: 10px;
  }

  .banner-swiper:hover .custom-nav-btn:hover {
    transform: translateY(-50%) scale(1.03);
  }
}

/* 7.7 小手机屏幕 (≤ 480px) */
@media (max-width: 480px) {
  .banner-swiper {
    height: 190px;
  }
}

/* 7.8 特小手机屏幕 (≤ 468px) */
@media (max-width: 468px) {
  .anime_news ul li img {
    height: 80%;
  }
}

/* 7.9 超小手机屏幕 (≤ 400px) */
@media (max-width: 400px) {
  .banner-container {
    margin-bottom: 12px;
    border-radius: 4px;
  }

  .image-info {
    bottom: 16px;
    left: 16px;
    right: 8px;
  }

  .anime-title {
    font-size: 20px;
    margin-bottom: 2px;
  }

  .update-info {
    font-size: 12px;
  }

  :deep(.swiper-pagination) {
    display: none;
  }

  .custom-nav-btn {
    width: 28px;
    height: 28px;
    border-radius: 14px;
  }

  .custom-nav-btn svg {
    width: 12px;
    height: 12px;
  }

  .banner-swiper:hover .custom-nav-btn:hover {
    transform: translateY(-50%) scale(1.02);
  }
}
</style>
