<script setup>
/* ============================================================================
   AnimeRankingList 组件 - 动漫排行榜组件
   ============================================================================
   功能：显示动漫排行榜，支持PC和移动端响应式布局
   特性：自适应屏幕尺寸，PC端显示简洁列表，移动端显示详细卡片
   ============================================================================ */

/* ===== 1. 导入依赖 ===== */
// Vue 核心组合式API
import { ref, onMounted, onUnmounted } from 'vue'

/* ===== 2. 组件属性定义 ===== */
const props = defineProps({
  // 排行榜数据（PC端使用，简单字符串数组）
  rankingData: {
    type: Array,
    default: () => [],
  },
  // 排行榜标题
  title: {
    type: String,
    default: '日本动漫排行榜',
  },
  // 排行榜数据（移动端使用，包含详细信息对象数组）
  rankingData2: {
    type: Array,
    default: () => [],
  },
  // 是否显示标题（控制PC端标题显示）
  isShow: {
    type: Boolean,
    default: false,
  },
})

/* ===== 3. 响应式状态数据 ===== */
// 移动端检测状态
const isMobile = ref(false)

/* ===== 4. 工具函数 ===== */
/**
 * 检测是否为移动端设备
 * @description 根据屏幕宽度判断设备类型，768px为分界点
 */
function checkIsMobile() {
  isMobile.value = window.innerWidth <= 768
}

/* ===== 5. 生命周期钩子 ===== */
onMounted(() => {
  // 1. 初始化设备检测
  checkIsMobile()

  // 2. 添加窗口大小变化监听器
  window.addEventListener('resize', checkIsMobile)
})

onUnmounted(() => {
  // 移除窗口大小变化监听器，防止内存泄漏
  window.removeEventListener('resize', checkIsMobile)
})
</script>

<template>
  <!-- 小屏幕 -->
  <div v-if="isMobile">
    <div class="rank_header flex justify-between items-center">
      <h2 class="rank_title">{{ title }}</h2>
      <a href="javascript:;" class="rank_more" draggable="false">更多></a>
    </div>
    <div class="mobile-ranking-list rounded overflow-hidden">
      <ul>
        <li v-for="(item, index) in props.rankingData2" :key="index" class="mobile-ranking-item">
          <a
            href="javascript:;"
            class="mobile-ranking-link flex items-center transition-all"
            draggable="false"
          >
            <span
              class="mobile-rank-number text-center flex-shrink-0"
              :class="`rank-${index + 1}`"
              >{{ index + 1 }}</span
            >
            <div class="mobile-anime-cover flex-shrink-0 rounded overflow-hidden">
              <img
                v-lazy="item.cover"
                :alt="item.title"
                draggable="false"
                class="cover-img w-full h-full object-cover transition-opacity"
              />
            </div>
            <div class="mobile-anime-info flex items-center flex-grow min-w-0">
              <span class="mobile-anime-title min-w-0 text-ellipsis">{{ item.title }}</span>
              <span class="split flex-shrink-0">/</span>
              <span class="mobile-anime-update flex-grow min-w-0 text-ellipsis">
                {{ item.update_info }}</span
              >
            </div>
            <div class="mobile-anime-tag flex-shrink-0">{{ item.tag }}</div>
          </a>
        </li>
      </ul>
    </div>
  </div>
  <!-- 大屏 -->
  <div class="anime_ranking_list no-select absolute" v-else>
    <div v-if="isShow" class="rank_title">
      <h2>{{ title }}</h2>
    </div>
    <ul class="ranking-list flex flex-col h-full rounded">
      <li v-for="(item, index) in props.rankingData" :key="index" class="ranking-item">
        <a
          href="javascript:void(0)"
          class="ranking-item-link block text-ellipsis"
          draggable="false"
        >
          <span class="rank-number flex-shrink-0" :class="`rank-${index + 1}`">{{
            index + 1
          }}</span>
          <span class="anime-title text-ellipsis">{{ item }}</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* AnimeRankingList 组件样式 */

/* ===== 1. 基础样式和重置 ===== */
/* 1.1 用户交互控制样式已移至工具类 utilities.css */

/* 1.2 文本省略 */
.text-ellipsis {
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ===== 2. PC端排行榜样式 ===== */
/* 2.1 PC端容器 */
.anime_ranking_list {
  right: 0px;
  top: 56px;
  width: 16.66666667%;
  height: 85%;
  padding: 10px;
}

.ranking-list {
  background: #1a1a1a;
  padding: 5% 0;
  margin: 0;
  list-style: none;
}

/* 2.2 PC端排行榜项目交互 */
.ranking-item {
  padding: 5% 20px 0;
}

.ranking-item:hover {
  opacity: 0.8;
  transition: opacity 0.2s ease;
}

/* 2.3 PC端排名数字 */
.rank-number {
  width: 20px;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  margin-right: 10px;
}

/* 前三名特殊颜色系统 */
.rank-1 {
  color: #ff4444; /* 第一名：红色 */
}

.rank-2 {
  color: #ff8800; /* 第二名：橙色 */
}

.rank-3 {
  color: #ffaa00; /* 第三名：黄色 */
}

.rank-number:not(.rank-1):not(.rank-2):not(.rank-3) {
  color: #999; /* 其他排名：灰色 */
}

/* 2.4 PC端动漫标题样式 */
.anime-title {
  color: #fff;
  font-size: 14px;
  font-weight: 400;
  transition: color 0.2s ease;
}

.anime-title:hover {
  color: #ff4444;
}

/* ===== 3. 移动端排行榜样式 ===== */
/* 3.1 移动端头部 */
.rank_header {
  margin-bottom: 20px;
}

.rank_title {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  margin: 0;
}

.rank_more {
  color: #999;
  font-size: 14px;
  text-decoration: none;
  transition: color 0.2s ease;
}

.rank_more:hover {
  color: #ff4444;
}

/* 3.2 移动端容器 */
.mobile-ranking-list {
  background: #1a1a1a;
}

.mobile-ranking-list ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

/* 3.3 移动端排行榜项目交互 */
.mobile-ranking-item {
  border-bottom: 1px solid #333;
}

.mobile-ranking-item:last-child {
  border-bottom: none;
}

.mobile-ranking-link {
  padding: 15px;
  text-decoration: none;
}

.mobile-ranking-link:hover {
  background-color: #252525;
}

/* 3.4 移动端排名数字 */
.mobile-rank-number {
  width: 24px;
  font-size: 16px;
  font-weight: 700;
  margin-right: 15px;
}

/* 移动端前三名颜色系统（与PC端保持一致） */
.mobile-rank-number.rank-1 {
  color: #ff4444; /* 第一名：红色 */
}

.mobile-rank-number.rank-2 {
  color: #ff8800; /* 第二名：橙色 */
}

.mobile-rank-number.rank-3 {
  color: #ffaa00; /* 第三名：黄色 */
}

.mobile-rank-number:not(.rank-1):not(.rank-2):not(.rank-3) {
  color: #999; /* 其他排名：灰色 */
}

/* 3.5 移动端封面 */
.mobile-anime-cover {
  width: 20%;
  margin-right: 15px;
}

/* 3.6 移动端信息 */
.mobile-anime-title {
  color: #fff;
  font-size: 16px;
  font-weight: 500;
}

.split {
  color: #999;
  font-size: 14px;
  margin: 0 4px;
  padding: 0 5px;
}

.mobile-anime-update {
  color: #999;
  font-size: 14px;
}

.mobile-anime-tag {
  color: #999;
  font-size: 14px;
  margin-left: 10px;
}

/* ===== 4. 响应式媒体查询 ===== */
/* 4.1 大屏幕适配 (≤ 1200px) */
@media (max-width: 1200px) {
  .anime_ranking_list {
    width: 20%; /* 调整为5分之1宽度 */
  }
}

/* 4.2 中等屏幕适配 (≤ 992px) */
@media (max-width: 992px) {
  .anime_ranking_list {
    width: 25%; /* 调整为4分之1宽度 */
  }
}

/* 4.3 平板屏幕适配 (≤ 768px) */
@media (max-width: 768px) {
  /* PC端排行榜在平板上的样式调整 */
  .ranking-list {
    padding: 0; /* 移除上下内边距 */
  }

  .ranking-item {
    padding: 20px; /* 增加项目内边距提升可点击性 */
  }
}

/* 样式文件结束 */
</style>
