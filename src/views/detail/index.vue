<script setup>
/* ============================================================================
   DetailPage 组件 - 动漫详情页面
   ============================================================================
   功能：动漫详情展示、评分、播放列表、评论等
   特性：响应式布局、图片懒加载、平滑滚动、评分系统
   ============================================================================ */

/* ===== 1. 导入依赖 ===== */
// Vue 核心组合式API
import { onMounted, ref, computed } from 'vue'
// 路由相关
import { useRoute } from 'vue-router'
// 状态管理
import { useDetailStore, useHomeStore } from '@/stores'
// 静态资源
import bleachImage from '@/assets/images/bleach.jpg'
// UI组件
import { Icon } from '@iconify/vue'
import { ArrowRight } from '@element-plus/icons-vue'
// 自定义组件
import AnimeRankingList from '@/components/AnimeRankingList.vue'

/* ===== 2. 状态管理和路由初始化 ===== */
const route = useRoute()
const detailStore = useDetailStore()
const homeStore = useHomeStore()

/* ===== 3. 响应式状态数据 ===== */
// 3.1 评分相关状态
const userRating = ref(1) // 用户评分（1-5星）

// 3.2 播放列表相关状态
const activeRoute = ref('route1') // 当前活跃的播放线路
const currentEpisode = ref(1) // 当前播放集数

// 3.3 UI交互状态
const isEpisodeExpanded = ref(false) // 移动端集数列表是否展开
const isDescriptionExpanded = ref(false) // 简介是否展开

// 3.5 模拟数据（播放列表）
const episodeList = ref(
  Array.from({ length: 24 }, (_, index) => ({
    id: index + 1,
    title: `第${String(index + 1).padStart(2, '0')}集`,
    url: `episode_${index + 1}.mp4`,
  })),
)

const latestEpisodeList = ref(
  Array.from({ length: 12 }, (_, index) => ({
    id: index + 1,
    title: `第${String(index + 1).padStart(2, '0')}集`,
    url: `latest_episode_${index + 1}.mp4`,
  })),
)

/* ===== 4. 计算属性 ===== */
// 4.1 评分相关计算属性
const averageRating = computed(() => {
  const score = detailStore.detail_info.score
  return score ? Number(score).toFixed(1) : '0.0'
})

const totalReviews = computed(() => {
  return detailStore.detail_info.score_count || 0
})

const starRating = computed(() => {
  const score = detailStore.detail_info.score
  return score ? Number(score) / 2 : 0
})

/* ===== 5. 工具函数 ===== */
// 5.1 评分相关工具函数
/**
 * 获取评分描述文本
 * @param {number} rating - 评分值（1-5）
 * @returns {string} 评分描述
 */
const getRatingText = (rating) => {
  if (rating <= 1) return '很差'
  if (rating <= 2) return '较差'
  if (rating <= 3) return '一般'
  if (rating <= 4) return '好看'
  return '很好看'
}

// 5.2 页面交互工具函数
/**
 * 平滑滚动到指定元素
 * @param {string} elementId - 元素ID
 * @description 使用原生API实现平滑滚动效果
 */
const scrollToElement = (elementId) => {
  const element = document.getElementById(elementId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

/* ===== 6. 事件处理函数 ===== */
// 6.1 评分相关事件处理
/**
 * 用户评分变化处理
 * @param {number} value - 新的评分值（1-5）
 * @description 处理用户星级评分变化，记录日志并可扩展为提交到后端
 */
const handleRatingChange = () => {
  // TODO: 这里可以添加评分提交到后端的逻辑
  // await submitRating(detailStore.detail_info.id, userRating.value)
}

// 6.2 工具栏交互事件处理
/**
 * 工具图标点击处理
 * @param {string} action - 操作类型（mobile|favorite|edit|rate|like）
 * @description 处理工具栏各种操作，包括移动端播放、收藏、编辑等
 */
const handleToolClick = (action) => {
  switch (action) {
    case 'mobile':
      // TODO: 实现移动端播放逻辑
      break
    case 'favorite':
      // TODO: 实现收藏功能
      break
    case 'edit':
      // TODO: 实现编辑功能
      break
    case 'rate':
      scrollToElement('rating-section')
      break
    case 'like':
      // TODO: 实现点赞功能
      break
    default:
      break
  }
}

// 6.3 播放相关事件处理
/**
 * 播放集数处理
 * @param {Object} episode - 集数对象
 * @param {number} episode.id - 集数ID
 * @param {string} episode.title - 集数标题
 * @param {string} episode.url - 播放链接
 * @description 处理集数点击播放，更新当前播放状态
 */
const playEpisode = (episode) => {
  currentEpisode.value = episode.id
  // TODO: 这里可以添加实际的视频播放逻辑
  // await startVideoPlayer(episode.url)
}

// 6.4 UI交互事件处理
/**
 * 切换集数列表展开/收缩状态
 * @description 移动端集数列表的展开收起控制
 */
const toggleEpisodeExpanded = () => {
  isEpisodeExpanded.value = !isEpisodeExpanded.value
}

/**
 * 切换简介展开/收缩状态
 * @description 剧情简介的展开收起控制
 */
const toggleDescription = () => {
  isDescriptionExpanded.value = !isDescriptionExpanded.value
}

/* ===== 7. 生命周期钩子 ===== */
/**
 * 组件挂载生命周期
 * @description 组件挂载后执行初始化逻辑，包括数据加载、DOM处理等
 */
onMounted(async () => {
  try {
    // 7.1 路由参数获取和验证
    const id = route.params.id || route.query.id
    if (!id) {
      return
    }

    // 7.2 异步数据加载
    await detailStore.getAnimeDetail(id)
  } catch {
    // TODO: 可以在这里添加错误处理逻辑，如显示错误提示
  }
})
</script>

<template>
  <div class="detail">
    <div class="detail_item">
      <div class="detail_topbg">
        <span
          :style="{
            backgroundImage: detailStore.detail_info.cover
              ? `url(${detailStore.detail_info.cover})`
              : 'none',
          }"
          class="detail_topbg_pic"
        ></span>
        <span class="detail_topbg_mask"></span>
      </div>
      <div class="detail-container">
        <div class="detail_content flex">
          <div class="detail_info relative flex">
            <div class="detail_info_pic">
              <span
                class="relative block overflow-hidden"
                :style="{
                  backgroundImage: detailStore.detail_info.cover
                    ? `url(${detailStore.detail_info.cover})`
                    : `url(${bleachImage})`,
                }"
              ></span>
            </div>
            <div class="detail_contont overflow-hidden">
              <div class="detail_headwrap">
                <h2 class="detail_title">{{ detailStore.detail_info.title || '加载中...' }}</h2>
                <h5 class="detail_subtitle text_muted">
                  {{ detailStore.detail_info.subtitle || '' }}
                </h5>
              </div>
              <div class="detail_info_data">
                <ul class="flex flex-wrap">
                  <li class="w-full" style="color: #f50">
                    <span class="text_muted">状态:</span>
                    {{ detailStore.detail_info.update_info || '未知' }}
                  </li>
                  <li class="w33">
                    <span class="text_muted">年份:</span>
                    {{ new Date().getFullYear() }}
                  </li>
                  <li class="w33">
                    <span class="text_muted">地区:</span>
                    {{ detailStore.detail_info.country === 'japan' ? '日本' : '中国' }}
                  </li>
                  <li class="w33">
                    <span class="text_muted">语言:</span>
                    {{ detailStore.detail_info.country === 'japan' ? '日语' : '国语' }}
                  </li>
                  <li class="w-full">
                    <span class="text_muted">类型:</span>
                    {{ detailStore.detail_info.type || '未知' }}
                  </li>
                  <li class="w-full">
                    <span class="text_muted">更新:</span>
                    {{ detailStore.detail_info.update_time || '未知' }}
                  </li>
                  <li class="description_item w-full">
                    <span class="text_muted">简介:</span
                    >{{ detailStore.detail_info.description || '暂无简介' }}
                  </li>
                </ul>
              </div>

              <!-- 播放 -->
              <div class="detail_others flex items-center justify-between">
                <div
                  class="play relative cursor-pointer transition-all"
                  @click="scrollToElement('play-section')"
                >
                  <a
                    href="javascript:;"
                    class="play-button relative inline-flex w-full h-full items-center justify-center"
                  >
                    <Icon icon="material-symbols:play-circle-outline-rounded" />
                    <span>立刻播放</span>
                    <div class="ripple-effect absolute"></div>
                  </a>
                </div>
                <div class="detail_tool_icon">
                  <ul class="flex">
                    <li
                      class="tool-item relative cursor-pointer transition-all"
                      @click="handleToolClick('mobile')"
                      title="移动端播放"
                    >
                      <Icon icon="tabler:device-mobile" />
                    </li>
                    <li
                      class="tool-item favorite relative cursor-pointer transition-all"
                      @click="handleToolClick('favorite')"
                      title="收藏"
                    >
                      <Icon icon="tabler:heart" />
                    </li>
                    <li
                      class="tool-item relative cursor-pointer transition-all"
                      @click="handleToolClick('edit')"
                      title="编辑"
                    >
                      <Icon icon="tabler:edit" />
                    </li>
                    <li
                      class="tool-item relative cursor-pointer transition-all"
                      @click="handleToolClick('rate')"
                      title="评分"
                    >
                      <Icon icon="tabler:mood-smile" />
                    </li>
                    <li
                      class="tool-item like relative cursor-pointer transition-all"
                      @click="handleToolClick('like')"
                      title="点赞"
                    >
                      <Icon icon="tabler:thumb-up" />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div class="detail_side relative">
            <!-- 评分模块 -->
            <div id="rating-section" class="side_rating">
              <div class="rating_header flex justify-between items-center">
                <div class="rating_score flex items-start">
                  <span class="score">{{ averageRating }}</span>
                  <div class="score_info flex flex-col">
                    <div class="score_label">网友评分</div>
                    <el-rate
                      v-model="starRating"
                      :disabled="true"
                      :show-score="false"
                      :max="5"
                      :colors="['#f7ba2a', '#f7ba2a', '#f7ba2a']"
                      disabled-void-color="#c6d1de"
                      size="small"
                      allow-half
                    />
                  </div>
                </div>
                <div class="rating_count">
                  {{ totalReviews > 0 ? totalReviews + '次评分' : '暂无评分' }}
                </div>
              </div>

              <div class="rating_box">
                <!-- 用户评分 -->
                <div class="user_rating text-center">
                  <el-rate
                    v-model="userRating"
                    :colors="['#f7ba2a', '#f7ba2a', '#f7ba2a']"
                    void-color="#f7ba2a"
                    disabled-void-color="#f7ba2a"
                    size="large"
                    @change="handleRatingChange"
                    allow-half
                  />
                  <div class="rating_text">{{ getRatingText(userRating) }}</div>
                </div>

                <!-- 二维码 -->
                <div class="qr_code text-center">
                  <div class="qr_image w-full h-full flex items-center justify-center">
                    <!-- 这里可以放二维码图片或生成的二维码 -->
                    <Icon icon="mdi:qrcode" />
                  </div>
                  <div class="qr_text">扫一扫用手机访问</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="detail-container">
      <div class="conch-ctwrap">
        <div class="crumbs-all">
          <el-breadcrumb :separator-icon="ArrowRight">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item
              :to="{
                path:
                  detailStore.detail_info.country === 'japan'
                    ? '/animeType/japan'
                    : '/animeType/china',
              }"
            >
              {{ detailStore.detail_info.country === 'japan' ? '日本动漫' : '国产动漫' }}
            </el-breadcrumb-item>
            <el-breadcrumb-item>{{
              detailStore.detail_info.title || '动漫详情'
            }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="row-box flex">
          <div class="left">
            <div id="play-section" class="rb-head flex justify-between items-center">
              <h2>播放列表</h2>
              <a href="javascript:;" class="sort-btn" draggable="false">
                <span>升序</span>
              </a>
            </div>

            <el-tabs v-model="activeRoute" class="play-tabs">
              <el-tab-pane label="第一线路" name="route1">
                <div class="episode-list">
                  <ul
                    class="relative flex flex-wrap transition-all overflow-hidden"
                    :class="{ ulzk: !isEpisodeExpanded }"
                  >
                    <li v-for="episode in episodeList" :key="episode.id" class="episode-item">
                      <a
                        href="javascript:;"
                        class="block rounded text-center cursor-pointer transition-all"
                        @click="playEpisode(episode)"
                        >第{{ String(episode.id).padStart(2, '0') }}集</a
                      >
                    </li>
                    <!-- 移动端展开/收缩按钮 -->
                    <li
                      :class="['episode-item', { zk: !isEpisodeExpanded }]"
                      @click="toggleEpisodeExpanded"
                    >
                      <a
                        href="javascript:;"
                        class="block rounded text-center cursor-pointer transition-all"
                      >
                        <Icon :icon="isEpisodeExpanded ? 'mdi:chevron-up' : 'mdi:chevron-down'" />
                        <span>{{ isEpisodeExpanded ? '收起' : '展开全部' }}</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </el-tab-pane>

              <el-tab-pane label="最新线路" name="route2">
                <div class="episode-list">
                  <ul
                    class="relative flex flex-wrap transition-all overflow-hidden"
                    :class="{ ulzk: !isEpisodeExpanded }"
                  >
                    <li v-for="episode in latestEpisodeList" :key="episode.id" class="episode-item">
                      <a
                        href="javascript:;"
                        class="block rounded text-center cursor-pointer transition-all"
                        @click="playEpisode(episode)"
                        >第{{ String(episode.id).padStart(2, '0') }}集</a
                      >
                    </li>
                    <!-- 移动端展开/收缩按钮 -->
                    <li
                      :class="['episode-item', { zk: !isEpisodeExpanded }]"
                      @click="toggleEpisodeExpanded"
                    >
                      <a
                        href="javascript:;"
                        class="block rounded text-center cursor-pointer transition-all"
                      >
                        <Icon :icon="isEpisodeExpanded ? 'mdi:chevron-up' : 'mdi:chevron-down'" />
                        <span>{{ isEpisodeExpanded ? '收起' : '展开全部' }}</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </el-tab-pane>
            </el-tabs>

            <div class="detail_introduction" id="plot-section">
              <h2 class="detail_title">剧情简介</h2>
              <div
                class="content-text relative transition-all"
                :class="{ expanded: isDescriptionExpanded }"
              >
                <p
                  class="description-content transition-all"
                  :class="{ 'text-ellipsis': !isDescriptionExpanded }"
                >
                  {{ detailStore.detail_info.description || '暂无简介' }}
                </p>
                <div class="zhankai text-center cursor-pointer" @click="toggleDescription">
                  <Icon
                    :icon="isDescriptionExpanded ? 'mdi:expand-less' : 'mdi:expand-more'"
                    class="expand-icon transition-all"
                  />
                </div>
              </div>
            </div>

            <div class="pl">
              <div class="pl_header flex items-center">
                <h2 class="pl_title">评论</h2>
                <span>共<i>0</i>条评论</span>
              </div>
              <div class="pl_box flex items-start">
                <div class="pl_act flex-shrink-0">
                  <img
                    :src="bleachImage"
                    alt=""
                    draggable="false"
                    class="w-full h-full rounded-full object-cover transition-all"
                  />
                </div>
                <textarea
                  name=""
                  id=""
                  cols="30"
                  rows="2"
                  class="pl_text flex-1 transition-all"
                  placeholder="文明发言，共建和谐社会"
                ></textarea>
              </div>

              <div class="empty-comments text-center">
                <div class="empty-icon">
                  <Icon icon="mdi:comment-outline" />
                </div>
                <div class="empty-text">当前暂无评论，赶紧抢个沙发</div>
              </div>
            </div>
          </div>
          <div class="right">
            <AnimeRankingList
              :rankingData="
                route.query.country === 'japan'
                  ? homeStore.japanRankingTitleList
                  : homeStore.chinaRankingTitleList
              "
              :isShow="true"
              :title="route.query.country === 'japan' ? '日本动漫排行榜' : '国产动漫排行榜'"
              :rankingData2="
                route.query.country === 'japan'
                  ? homeStore.japanAnimeRankingList
                  : homeStore.animeChinaRankingList
              "
            ></AnimeRankingList>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* DetailPage 组件样式 */

/* ===== 1. 全局基础样式 ===== */
/* 1.1 平滑滚动设置 */
html {
  scroll-behavior: smooth;
}

/* 1.2 自定义滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #f46b03, #e55a00);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #e55a00, #d54900);
}
/* ===== 2. 页面容器和布局 ===== */
/* 2.1 主要页面结构 */
.detail_item {
  position: relative;
}

.detail-container {
  width: 1280px;
  margin: 0 auto;
  padding: 20px;
  z-index: 1;
}

.detail-page {
  padding: 20px;
  color: #fff;
}

/* 2.2 背景图片和遮罩层 */
.detail_topbg {
  position: absolute;
  top: -140px;
  bottom: 0;
  width: 100%;
}

.detail_topbg_pic {
  position: relative;
  display: block;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-position-y: 50%;
}

.detail_topbg_mask {
  position: absolute;
  top: 0;
  display: block;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  backdrop-filter: saturate(180%) blur(20px);
}
/* ===== 3. 动漫信息展示区域 ===== */
/* 3.1 主要内容区域布局 */
.detail_content {
  padding-bottom: 30px;
  padding-top: 20px;
}

.detail_info {
  width: 75%;
  padding-right: 25px;
}

.detail_side {
  width: 25%;
}

/* 3.2 标题和基本信息 */
.detail_headwrap {
  margin-bottom: 20px;
}

.detail_title {
  font-size: 28px;
  line-height: 32px;
}

.detail_contont {
  padding-left: 25px;
  width: calc(100% - 240px);
}

.detail_contont h5 {
  font-size: 14px;
  margin-top: 10px;
}

.text_muted {
  padding-right: 5px;
  color: rgba(255, 255, 255, 0.6);
}

/* 3.3 封面图片区域 */
.detail_info_pic {
  width: 240px;
}

.detail_info_pic span {
  padding-top: 145%;
  background-position: 50% 50%;
  background-size: cover;
  border-radius: 10px;
}

/* 3.5 动漫详细信息列表 */
.detail_info_data ul li {
  margin: 3px 0;
}

.detail_info_data ul .w33 {
  width: 33.33333333%;
}

.description_item {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.5;
  word-break: break-word;
  padding-left: 2.6em;
  text-indent: -2.6em;
}

/* ===== 4. 评分和工具栏模块 ===== */
/* 4.1 评分模块基础样式 */
.side_rating {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 30px;
  color: #fff;
}

.rating_header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 10px;
}

.rating_score {
  gap: 10px;
}

.score {
  font-size: 32px;
  height: 32px;
  line-height: 32px;
  font-weight: bold;
  color: #fff;
}

.score_label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.rating_count {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

/* 4.2 用户评分区域 */
.user_rating {
  margin-bottom: 20px;
}

.rating_text {
  margin-top: 10px;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
}

/* 4.3 二维码区域 */

.qr_image {
  width: 120px;
  height: 120px;
  margin: 0 auto 10px;
  background: #fff;
  border-radius: 8px;
}

.qr_image .iconify {
  width: 80px;
  height: 80px;
  color: #333;
}

.qr_text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

/* 4.4 Element Plus Rate 组件自定义样式 */
:deep(.el-rate) {
  display: flex;
  align-items: center;
}

.user_rating :deep(.el-rate) {
  justify-content: center;
}

:deep(.el-rate__item) {
  margin-right: 2px;
}

:deep(.el-rate__icon) {
  font-size: 14px;
}

/* 顶部评分星星样式 */
.score_info :deep(.el-rate__icon) {
  font-size: 10px;
}

.score_info :deep(.el-rate) {
  height: 10px;
}

/* 用户评分区域的星星样式 */
.user_rating :deep(.el-rate__icon) {
  font-size: 24px;
  /* 不设置color，让Element Plus自己控制 */
}

/* 半星的关键修复 */
.user_rating :deep(.el-rate__decimal) {
  position: absolute !important;
  top: 0;
  left: 0;
  width: 50% !important; /* 半星宽度 */
  overflow: hidden !important;
  color: inherit !important;
}

/* 半星图标 */
.user_rating :deep(.el-rate__decimal .el-rate__icon) {
  color: #f7ba2a !important;
  width: 200% !important; /* 补偿被裁剪的部分 */
}

/* 顶部评分星星的半星修复 */
.score_info :deep(.el-rate__decimal) {
  position: absolute !important;
  top: 0;
  left: 0;
  width: 50% !important;
  overflow: hidden !important;
  color: inherit !important;
}

.score_info :deep(.el-rate__decimal .el-rate__icon) {
  color: #f7ba2a !important;
  width: 200% !important;
}

/* 4.5 播放按钮和工具栏 */
.play {
  height: 40px;
  background: linear-gradient(45deg, #f58100, #e55a00);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(245, 129, 0, 0.3);
}

.play-button {
  padding: 20px;
  color: #fff;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  z-index: 2;
}

.play-button svg,
.play-button .iconify {
  width: 20px;
  height: 20px;
}

.ripple-effect {
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: all 0.6s ease;
}

.play:active .ripple-effect {
  width: 200px;
  height: 200px;
}

.detail_others {
  margin-top: 40px;
}

/* 4.6 工具图标样式 */
.detail_tool_icon ul {
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.tool-item {
  padding: 10px;
  line-height: 16px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.tool-item:hover {
  background-color: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.tool-item.favorite:hover {
  background-color: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.3);
}

.tool-item.like:hover {
  background-color: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.3);
}

.tool-item .iconify {
  width: 20px;
  height: 20px;
  color: rgba(255, 255, 255, 0.8);
  transition: color 0.3s ease;
  vertical-align: text-top;
}

.tool-item:hover .iconify {
  color: rgba(255, 255, 255, 1);
}

.crumbs-all {
  margin-bottom: 20px;
  padding: 12px 20px 12px 0px;
  border-radius: 6px;
}

/* Element Plus 面包屑自定义样式 */
.crumbs-all :deep(.el-breadcrumb) {
  font-size: 14px;
}

.crumbs-all :deep(.el-breadcrumb__item) {
  font-size: 14px;
}

.crumbs-all :deep(.el-breadcrumb__inner) {
  color: #666;
  font-weight: normal;
  text-decoration: none;
  transition: color 0.3s ease;
}

.crumbs-all :deep(.el-breadcrumb__inner):hover {
  color: #f46b03;
}

.crumbs-all :deep(.el-breadcrumb__item):last-child .el-breadcrumb__inner {
  color: #fff;
  font-weight: 500;
}

.crumbs-all :deep(.el-breadcrumb__separator) {
  color: rgba(255, 255, 255, 0.4);
  margin: 0 8px;
}
.row-box {
  gap: 20px;
}

.left {
  width: 75%;
  border-radius: 8px;
}

.right {
  width: 25%;
  border-radius: 8px;
}
.right :deep(.anime_ranking_list) {
  position: relative;
  width: 100%;
  top: 0; /* 重置顶部偏移，让排行榜贴顶显示 */
  padding: 0 10px;
}
.right :deep(.anime_ranking_list) .ranking-list {
  background-color: transparent;
  padding: 0;
  margin-top: -23px;
}
.right :deep(.anime_ranking_list) .ranking-list .ranking-item {
  padding: 6% 20px 4% 0;
  border-bottom: 1px solid #252525;
}
.right :deep(.anime_ranking_list) .ranking-item:last-child {
  border-bottom: none;
}
.right :deep(.anime_ranking_list) h2 {
  font-size: 20px;
}
.right :deep(.anime_ranking_list) .rank_title {
  padding-bottom: 20px;
}
/* 播放列表头部 */
.rb-head {
  padding-bottom: 12px;
}

.rb-head h2 {
  font-size: 20px;
  color: #fff;
  margin: 0;
  font-weight: 600;
}

.sort-btn {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.sort-btn:hover {
  color: #f46b03;
}

/* Element Plus Tabs 自定义样式 */
.play-tabs {
  margin-bottom: 20px;
}
.play-tabs :deep(.el-tabs__header) {
  margin: 0 0 20px 0;
}

.play-tabs :deep(.el-tabs__nav-wrap)::after {
  background-color: rgba(255, 255, 255, 0.1);
}

.play-tabs :deep(.el-tabs__item) {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  font-weight: 500;
}

.play-tabs :deep(.el-tabs__item.is-active) {
  color: #f46b03;
}

.play-tabs :deep(.el-tabs__active-bar) {
  background-color: #f46b03;
}
.zk {
  display: none;
}
/* 集数列表样式优化 */

.episode-btn {
  height: 40px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  margin: 0;
  padding-left: 12px;
  background-color: #252525;
  border: 0;
  transition: all 0.3s ease;
}
.episode-list ul {
  margin-left: -10px;
}
.episode-list ul .episode-item {
  width: 16.66666667%;
  padding: 0 10px;
  margin-bottom: 10px;
}
.episode-item a {
  line-height: 40px;
  background-color: #252525;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
}
.episode-list ul li a:hover {
  background-color: #f46b03;
  color: #fff;
}
/* 默认状态的集数按钮 */
.episode-btn:deep(.el-button--default) {
  background-color: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.8);
}

.episode-btn:deep(.el-button--default:hover) {
  background-color: rgba(255, 255, 255, 0.12);
  border-color: #f46b03;
  color: #f46b03;
}

/* 激活状态的集数按钮 */
.episode-btn:deep(.el-button--primary) {
  background-color: #f46b03;
  border-color: #f46b03;
}

.episode-btn:deep(.el-button--primary:hover) {
  background-color: #e55a00;
  border-color: #e55a00;
  box-shadow: 0 6px 16px rgba(244, 107, 3, 0.4);
  transform: translateY(-2px);
}

.episode-btn:deep(.el-button):active {
  transform: translateY(0);
  transition: transform 0.1s;
}

@media (max-width: 768px) {
  .episode-btn {
    height: 36px;
    font-size: 12px;
  }
}
.detail_introduction .detail_title {
  font-size: 20px;
}

/* 简介展开功能优化 */
.content-text {
  color: #666;
  font-size: 14px;
  margin: 10px 0;
}

.description-content.text-ellipsis {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.6;
  word-break: break-word;
}

.description-content {
  margin: 0;
  line-height: 1.6;
  word-break: break-word;
}

/* 展开状态：移除行数限制 */
.content-text.expanded .description-content {
  display: block;
  -webkit-line-clamp: unset;
  line-clamp: unset;
  overflow: visible;
}

.collapse-text {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
.show-text {
  display: flex;
  align-items: center;
  position: absolute;
  right: 0;
  bottom: 0;
  height: 20px;
  line-height: 20px;
}

.hl-mbg {
  width: 80px;
  height: 20px;
  background: linear-gradient(
    to right,
    rgba(15, 15, 15, 0) 0%,
    rgba(15, 15, 15, 0.8) 50%,
    #0f0f0f 100%
  );
}

/* 展开/收起按钮优化 */
.zhankai {
  padding: 6px 12px;
  border-radius: 16px;
}

.expand-icon {
  width: 20px;
  height: 20px;
  color: #666;
}

.zhankai:hover .expand-icon {
  color: #fff;
  transform: scale(1.1);
}
/* 评论区域样式美化 */
.pl {
  margin-top: 30px;
}

.pl_header {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.pl_title {
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.pl_header span {
  margin-left: 15px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

.pl_header i {
  color: #f46b03;
  font-style: normal;
  font-weight: 600;
}

.pl_box {
  gap: 15px;
}

.pl_act {
  width: 60px;
  height: 60px;
}

.pl_act img {
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.pl_act img:hover {
  border-color: #f46b03;
}

.pl_text {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 12px 15px;
  color: #fff;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;
  min-height: 60px;
  font-family: inherit;
}
.ulzk {
  max-height: 100px;
}
.pl_text::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.pl_text:focus {
  outline: none;
  border-color: #f46b03;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 2px rgba(244, 107, 3, 0.15);
}

.pl_text:hover {
  border-color: rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.07);
}
.episode-item svg {
  font-size: 14px;
  vertical-align: middle;
}
/* 空状态样式 */
.empty-comments {
  padding: 60px 20px;
}

.empty-icon {
  font-size: 64px;
  color: rgba(255, 255, 255, 0.3);
  margin-bottom: 20px;
  opacity: 0.8;
}

.empty-text {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 400;
}
@media (min-width: 1200px) and (max-width: 1309px) {
  .detail-container {
    width: 1170px;
  }
}
@media (max-width: 1200px) {
  .detail-container {
    width: 970px;
    padding: 20px 10px;
  }
  .detail_info {
    width: 70%;
  }
  .detail_info_pic {
    width: 240px;
  }

  .detail_side {
    width: 30%;
  }

  .play-button {
    padding: 10px;
  }
}

@media (max-width: 992px) {
  .row-box {
    flex-direction: column;
  }

  .left,
  .right {
    width: 100%;
  }

  .detail_content {
    flex-wrap: wrap;
  }
  .detail_info_pic {
    width: 220px;
  }
  .detail-container {
    width: 750px;
    padding-right: 0;
  }
  .detail_others {
    margin-top: 15px;
  }
  .detail_info {
    width: 100%;
    padding-right: 0;
  }
  .detail_side {
    width: 100%;
    margin-top: 30px;
  }

  .right :deep(.anime_ranking_list) .ranking-list .ranking-item {
    padding: 3% 20px 3% 0;
  }
}
@media (max-width: 768px) {
  .detail-container {
    width: 100%;
    padding-right: 10px;
  }
  .rating_header {
    border-bottom: 0;
  }
  .zk {
    display: block;
    position: absolute;
    right: 0;
    bottom: 0;
  }
  .rating_box {
    display: none;
  }
  .detail_info_pic {
    width: 33.333333%;
    min-width: 150px;
  }
  .detail_others {
    position: absolute;
    bottom: 0;
  }
  .detail_others .detail_tool_icon {
    display: none;
  }
  .episode-list ul .episode-item {
    width: 33.33333333%;
  }
  .crumbs-all {
    display: none;
  }

  .w33 {
    display: none;
  }
  /* 移动端标题单行显示省略号 */

  .detail_contont {
    position: relative;
    width: 66.666666%;
  }
  .detail_title,
  .detail_subtitle,
  .rating_count,
  .detail_info_data li:not(:last-child) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }
}
@media (max-width: 574px) {
  .detail_others {
    display: none;
  }
}
</style>
