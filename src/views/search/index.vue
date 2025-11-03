<script setup>
/* ===== 1. 导入依赖 ===== */
import { onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSearchStore } from '@/stores'
import AnimeCard from '@/components/AnimeCard.vue'
import { Search, Loading, Warning } from '@element-plus/icons-vue'

/* ===== 2. 路由和状态管理 ===== */
const route = useRoute()
const router = useRouter()
const searchStore = useSearchStore()

/* ===== 3. 计算属性 ===== */
const keyword = computed(() => route.query.keyword || '')
const hasResults = computed(() => searchStore.searchResults.length > 0)
const showEmpty = computed(() => !searchStore.loading && !hasResults.value && keyword.value)

/* ===== 4. 生命周期 ===== */
onMounted(() => {
  // 页面加载时执行搜索
  if (keyword.value) {
    searchStore.search(keyword.value)
  }
})

/* ===== 5. 监听路由变化 ===== */
watch(
  () => route.query.keyword,
  (newKeyword) => {
    if (newKeyword) {
      searchStore.search(newKeyword)
    } else {
      searchStore.clearResults()
    }
  },
)

/* ===== 6. 事件处理函数 ===== */
/**
 * 返回首页
 */
const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="search_page">
    <!-- 搜索结果标题 -->
    <div class="search_header">
      <h1 class="search_title">
        <el-icon class="title-icon"><Search /></el-icon>
        搜索结果
      </h1>
      <p v-if="keyword" class="search_keyword">
        关键词：<span class="keyword-text">{{ keyword }}</span>
        <span v-if="searchStore.searchResults.length > 0" class="result-count">
          (共 {{ searchStore.searchResults.length }} 个结果)
        </span>
      </p>
    </div>

    <!-- 加载中状态 -->
    <div v-if="searchStore.loading" class="loading_state">
      <el-icon class="loading-icon is-loading"><Loading /></el-icon>
      <p class="loading-text">搜索中...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="searchStore.error" class="error_state">
      <el-icon class="error-icon"><Warning /></el-icon>
      <p class="error-title">{{ searchStore.error }}</p>
      <el-button type="primary" @click="searchStore.search(keyword)" class="retry-btn">
        重新搜索
      </el-button>
    </div>

    <!-- 搜索结果列表 -->
    <div v-else-if="hasResults" class="search_results">
      <div class="anime_grid">
        <AnimeCard v-for="anime in searchStore.searchResults" :key="anime.id" :list="anime" />
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else-if="showEmpty" class="empty_state">
      <el-icon class="empty-icon"><Search /></el-icon>
      <p class="empty-title">未找到相关动漫</p>
      <p class="empty-desc">试试其他关键词吧</p>
      <el-button type="primary" @click="goHome" class="back-home-btn"> 返回首页 </el-button>
    </div>

    <!-- 未输入关键词提示 -->
    <div v-else class="no_keyword_tip">
      <el-icon class="tip-icon"><Search /></el-icon>
      <p class="tip-text">请输入搜索关键词</p>
    </div>
  </div>
</template>

<style scoped>
/* 搜索页面容器 */
.search_page {
  min-height: calc(100vh - 200px);
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

/* 搜索结果标题 */
.search_header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
}

.search_title {
  font-size: 28px;
  font-weight: 600;
  color: #fff;
  margin: 0 0 10px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.title-icon {
  font-size: 28px;
  color: #f46b03;
}

.search_keyword {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.keyword-text {
  color: #f46b03;
  font-weight: 600;
}

.result-count {
  color: #999;
  margin-left: 8px;
}

/* 加载中状态 */
.loading_state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
}

.loading-icon {
  font-size: 48px;
  color: #409eff;
  animation: rotate 1.5s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 16px;
  color: #666;
  margin-top: 20px;
}

/* 错误状态 */
.error_state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
}

.error-icon {
  font-size: 60px;
  color: #f56c6c;
  margin-bottom: 20px;
}

.error-title {
  font-size: 18px;
  color: #666;
  margin: 0 0 30px 0;
}

.retry-btn {
  min-width: 120px;
}

/* 搜索结果网格 */
.search_results {
  width: 100%;
}

.anime_grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
}

/* 空状态 */
.empty_state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
}

.empty-icon {
  font-size: 80px;
  color: #d0d0d0;
  margin-bottom: 20px;
}

.empty-title {
  font-size: 20px;
  color: #666;
  margin: 0 0 10px 0;
  font-weight: 600;
}

.empty-desc {
  font-size: 14px;
  color: #999;
  margin: 0 0 30px 0;
}

.back-home-btn {
  min-width: 120px;
}

/* 未输入关键词提示 */
.no_keyword_tip {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
}

.tip-icon {
  font-size: 60px;
  color: #e0e0e0;
  margin-bottom: 20px;
}

.tip-text {
  font-size: 18px;
  color: #999;
}

/* ===== 响应式设计 ===== */
/* 大屏幕 (≤1200px) */
@media (max-width: 1200px) {
  .anime_grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

/* 中等屏幕 (≤992px) */
@media (max-width: 992px) {
  .anime_grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .search_title {
    font-size: 24px;
  }
}

/* 小屏幕 (≤768px) */
@media (max-width: 768px) {
  .search_page {
    padding: 15px;
  }

  .anime_grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 15px;
  }

  .search_title {
    font-size: 20px;
  }

  .search_keyword {
    font-size: 14px;
  }

  .empty-icon,
  .tip-icon {
    font-size: 60px;
  }

  .empty-title,
  .tip-text {
    font-size: 16px;
  }
}

/* 超小屏幕 (≤480px) */
@media (max-width: 480px) {
  .anime_grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .search_header {
    margin-bottom: 20px;
    padding-bottom: 15px;
  }
}
</style>
