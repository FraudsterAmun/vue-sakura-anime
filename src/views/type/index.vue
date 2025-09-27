<script setup>
/* ============================================================================
   TypePage 组件 - 动漫分类页面
   ============================================================================
   功能：动漫分类展示、筛选、分页
   路由：/animeType/:type
   ============================================================================ */

/* ===== 1. 导入依赖 ===== */
// Vue 核心组合式API
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'

// 路由相关
import { useRoute } from 'vue-router'

// 状态管理
import { useCountryStore } from '@/stores/modules/country'

// UI组件
import { Icon } from '@iconify/vue'

// 自定义组件
import AnimeFilter from '@/views/type/components/AnimeFilter.vue'
import AnimeCard from '@/components/AnimeCard.vue'

// 工具函数
import { filterByFirstLetter } from '@/utils/letterFilter'

/* ===== 2. 状态管理和路由初始化 ===== */
const route = useRoute()
const countryStore = useCountryStore()

/* ===== 3. 响应式状态数据 ===== */
// 页面状态（已移除未使用的animeData变量）

// 响应式设计状态
const isMobile = ref(false) // 是否是小屏幕（≤768px）
const screenWidth = ref(window.innerWidth) // 当前屏幕宽度

// 分页状态
const currentPage = ref(1) // 当前页码

// 筛选状态
const activeFilters = ref({
  type: '全部',
  region: '全部',
  year: '全部',
  letter: '全部', // 首字母筛选条件
})

/* ===== 4. 工具函数 ===== */
/**
 * 检测屏幕尺寸并更新响应式状态
 */
function checkScreenSize() {
  const oldPageSize = pageSize.value
  screenWidth.value = window.innerWidth
  isMobile.value = window.innerWidth <= 768

  // 如果每页显示数量发生变化，重置到第一页
  if (oldPageSize !== pageSize.value) {
    currentPage.value = 1
  }
}

/**
 * 处理窗口大小变化事件
 */
function handleResize() {
  checkScreenSize()
}

/* ===== 5. 计算属性（按依赖关系排序） ===== */
// 页面标题（基于路由参数）
const typeTitle = computed(() => {
  const type = route.params.type
  return type ? `${type} 动漫` : '动漫分类'
})

// 类型信息（直接映射store数据）
const typeInfo = computed(() => countryStore.type_info)

// 总数据源（从store获取，确保数据类型安全）
const totalData = computed(() => {
  return Array.isArray(countryStore.type_info) ? countryStore.type_info : []
})

// 筛选后的数据（应用首字母筛选逻辑）
const filteredData = computed(() => {
  let result = totalData.value

  // 如果不是"全部"，则应用首字母筛选
  if (activeFilters.value.letter !== '全部') {
    result = filterByFirstLetter(result, activeFilters.value.letter, 'title')
  }

  return result
})

// 响应式每页显示数量
const pageSize = computed(() => {
  if (screenWidth.value > 1200) {
    return 36 // 大屏：6行x6列=36个
  } else if (screenWidth.value > 992) {
    return 30 // 中等屏：6行x5列=30个
  } else if (screenWidth.value > 768) {
    return 24 // 小屏：6行x4列=24个
  } else {
    return 18 // 移动端：6行x3列=18个
  }
})

// 当前页显示的数据（分页切片）
const currentPageData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredData.value.slice(start, end)
})

// 检查是否有激活的筛选条件
const hasActiveFilters = computed(() => {
  return (
    activeFilters.value.type !== '全部' ||
    activeFilters.value.region !== '全部' ||
    activeFilters.value.year !== '全部' ||
    activeFilters.value.letter !== '全部'
  )
})

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / pageSize.value)
})

/* ===== 6. 事件处理函数 ===== */
/**
 * 处理页码改变
 * @param {number} val - 新的页码
 */
function handleCurrentChange(val) {
  currentPage.value = val
  console.log(`📄 切换到第 ${val} 页`)
}

/**
 * 跳转到指定页码（移动端自定义分页使用）
 * @param {number} page - 目标页码
 */
function goToPage(page) {
  if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
    currentPage.value = page
    console.log(`📄 跳转到第 ${page} 页`)
  }
}

/**
 * 处理筛选条件变化
 * @param {Object} filterData - 筛选数据对象
 */
function handleFilterChange(filterData) {
  console.log('🔍 筛选条件变化:', filterData)

  // 更新筛选状态
  activeFilters.value = filterData.filters

  // 筛选后重置到第一页
  currentPage.value = 1

  // 调试信息
  console.log('✅ 当前筛选状态:', activeFilters.value)
  console.log('🔤 激活的字母筛选:', activeFilters.value.letter)
}

/**
 * 重置筛选条件
 */
function resetFilters() {
  activeFilters.value = {
    type: '全部',
    region: '全部',
    year: '全部',
    letter: '全部',
  }
  currentPage.value = 1
  console.log('🔄 已重置所有筛选条件')
}

/* ===== 7. 监听器 ===== */
// 监听pageSize变化，确保分页逻辑正确
watch(pageSize, (newPageSize, oldPageSize) => {
  if (newPageSize !== oldPageSize) {
    console.log(`📄 每页显示数量从 ${oldPageSize} 变更为 ${newPageSize}`)
    // 如果当前页超出了新的总页数，重置到最后一页
    const newTotalPages = Math.ceil(filteredData.value.length / newPageSize)
    if (currentPage.value > newTotalPages) {
      currentPage.value = Math.max(1, newTotalPages)
    }
  }
})
/* ===== 7. 路由参数监听 ===== */
// 简单防抖：记录上次请求时间
let lastRequestTime = 0
const REQUEST_DEBOUNCE_TIME = 300 // 300ms防抖

/**
 * 防抖获取数据函数
 * @param {string} type - 动漫类型
 */
const debouncedGetAnimeType = (type) => {
  const now = Date.now()

  // 如果距离上次请求小于300ms，则忽略
  if (now - lastRequestTime < REQUEST_DEBOUNCE_TIME) {
    console.log('🚫 请求被防抖拦截:', type)
    return
  }

  lastRequestTime = now
  countryStore.getAnimeType(type)
}

/**
 * 监听路由参数变化
 * @description 当用户在相同组件间切换时（如从japan到china），重新获取数据
 */
watch(
  () => route.params.type,
  (newType, oldType) => {
    if (newType && newType !== oldType) {
      console.log(`🔄 路由参数变化: ${oldType} → ${newType}`)

      // 重置筛选条件
      activeFilters.value = {
        type: '全部',
        region: '全部',
        year: '全部',
        letter: '全部',
      }

      // 重置分页
      currentPage.value = 1

      // 使用防抖函数获取数据
      nextTick(() => {
        debouncedGetAnimeType(newType)
      })
    }
  },
  { immediate: false }, // 不需要立即执行，因为onMounted已经会获取数据
)
/* ===== 8. 生命周期钩子 ===== */
onMounted(() => {
  console.log('📄 Type page mounted, type:', route.params.type)

  // 1. 初始化响应式检测
  checkScreenSize()
  window.addEventListener('resize', handleResize)

  // 2. 获取动漫数据
  nextTick(() => {
    countryStore.getAnimeType(route.params.type)
  })
})

onUnmounted(() => {
  // 清理事件监听器，防止内存泄漏
  window.removeEventListener('resize', handleResize)
  console.log('📄 Type page unmounted')
})
</script>
<template>
  <div class="type-page">
    <!-- ================================ -->
    <!-- 📄 页面标题区域（当前隐藏） -->
    <!-- ================================ -->
    <div class="type-header">
      <h1>{{ typeTitle }}</h1>
      <p v-if="!countryStore.loading">共 {{ totalData.length }} 部动漫</p>
      <p v-else class="loading-text">正在加载中...</p>

      <!-- 调试信息：显示类型信息 -->
      <div v-if="typeInfo && Object.keys(typeInfo).length > 0" class="type-info">
        <p>类型信息：{{ JSON.stringify(typeInfo) }}</p>
      </div>
    </div>

    <!-- ================================ -->
    <!-- 🔍 多维度筛选器组件 -->
    <!-- ================================ -->
    <AnimeFilter @filter-change="handleFilterChange" />

    <!-- ================================ -->
    <!-- 🎬 动漫列表展示区域 -->
    <!-- ================================ -->
    <!-- 无数据状态：优先判断筛选结果 -->
    <div
      v-if="filteredData.length === 0"
      class="empty-state flex flex-col items-center justify-center text-center"
    >
      <div class="empty-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="w-full h-full">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
      </div>
      <h3 class="empty-title">暂无相关内容</h3>
      <p class="empty-description">
        <span v-if="hasActiveFilters"> 没有找到符合筛选条件的动漫，试试调整筛选条件 </span>
        <span v-else> 当前分类暂无内容，请稍后再来看看 </span>
      </p>
      <button
        v-if="hasActiveFilters"
        class="reset-filters-btn cursor-pointer transition-all"
        @click="resetFilters"
      >
        清空筛选条件
      </button>
    </div>

    <!-- 有筛选结果：显示数据 -->
    <div v-else-if="currentPageData.length > 0" class="anime_grid grid_col_6">
      <!-- 遍历当前页的动漫数据 -->
      <AnimeCard v-for="card in currentPageData" :key="card.id" :list="card" />
    </div>

    <!-- 页码超出范围情况 -->
    <div v-else class="page-out-of-range flex flex-col items-center justify-center text-center">
      <div class="empty-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="w-full h-full">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      </div>
      <h3 class="empty-title">页码超出范围</h3>
      <p class="empty-description">
        当前显示第 {{ currentPage }} 页，但总共只有
        {{ Math.ceil(filteredData.length / pageSize) }} 页内容
      </p>
      <button class="reset-page-btn cursor-pointer transition-all" @click="currentPage = 1">
        返回第一页
      </button>
    </div>
    <!-- ================================ -->
    <!-- 📄 分页组件区域 -->
    <!-- ================================ -->
    <!-- PC端分页 -->
    <div
      v-if="filteredData.length > 0 && !isMobile"
      class="pagination-wrapper pc-pagination flex justify-center"
    >
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :small="false"
        :disabled="false"
        :background="false"
        layout="prev, pager, next"
        :total="filteredData.length"
        :pager-count="7"
        @current-change="handleCurrentChange"
        class="custom-pagination pc-custom-pagination"
      />
    </div>

    <!-- 移动端自定义分页 -->
    <div
      v-if="filteredData.length > 0 && isMobile"
      class="mobile-pagination-wrapper flex justify-center"
    >
      <ul class="custom-mobile-pagination w-full flex items-center">
        <!-- 首页按钮 -->
        <li>
          <a
            class="pagination-btn first-btn block w-full text-center cursor-pointer transition-all user-select-none"
            :class="{ disabled: currentPage === 1 }"
            href="javascript:void(0)"
            @click="currentPage === 1 ? null : goToPage(1)"
          >
            <Icon icon="mdi:page-first" class="pagination-icon" />
          </a>
        </li>

        <!-- 上一页按钮 -->
        <li>
          <a
            class="pagination-btn prev-btn block w-full text-center cursor-pointer transition-all user-select-none"
            :class="{ disabled: currentPage === 1 }"
            href="javascript:void(0)"
            @click="currentPage === 1 ? null : goToPage(currentPage - 1)"
          >
            <Icon icon="mdi:chevron-left" class="pagination-icon" />
          </a>
        </li>

        <!-- 页码显示 -->
        <li class="page-info flex items-center justify-center">
          <span class="current-page">{{ currentPage }}</span>
          <span class="separator">/</span>
          <span class="total-pages">{{ totalPages }}</span>
        </li>

        <!-- 下一页按钮 -->
        <li>
          <a
            class="pagination-btn next-btn block w-full text-center cursor-pointer transition-all user-select-none"
            :class="{ disabled: currentPage === totalPages }"
            href="javascript:void(0)"
            @click="currentPage === totalPages ? null : goToPage(currentPage + 1)"
          >
            <Icon icon="mdi:chevron-right" class="pagination-icon" />
          </a>
        </li>

        <!-- 末页按钮 -->
        <li>
          <a
            class="pagination-btn last-btn block w-full text-center cursor-pointer transition-all user-select-none"
            :class="{ disabled: currentPage === totalPages }"
            href="javascript:void(0)"
            @click="currentPage === totalPages ? null : goToPage(totalPages)"
          >
            <Icon icon="mdi:page-last" class="pagination-icon" />
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
/* ============================================================================
   TypePage 样式组织结构
   ============================================================================
   1. 基础样式和重置
   2. 页面容器样式
   3. 动漫网格布局样式
   4. 动漫卡片相关样式
   5. 分页相关样式
   6. 状态提示样式
   7. 响应式媒体查询
   ============================================================================ */

/* ===== 1. 基础样式和重置 ===== */
.type-page {
  padding: 0;
  background: #252525;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 未使用的用户选择禁用样式已移除 */

/* ===== 2. 页面容器样式 ===== */
.type-header {
  display: none;
}

.type-header h1 {
  font-size: 28px;
  color: #fff;
  margin-bottom: 10px;
  font-weight: 700;
}

.type-header p {
  color: #ccc;
  font-size: 16px;
}

.total-hint {
  color: #999;
  font-size: 14px;
}

.type-info {
  margin-top: 10px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  border-left: 3px solid #ff6600;
}

.type-info p {
  color: #ccc;
  font-size: 14px;
  margin: 0;
}

/* ===== 3. 动漫网格布局样式 ===== */
.anime_grid {
  display: grid;
}

.grid_col_6 {
  grid-template-columns: repeat(6, 1fr);
}

/* AnimeCard相关样式已移除，应该在AnimeCard组件中定义 */

/* ===== 5. 分页相关样式 ===== */
/* 5.1 PC端分页样式 */
.pc-pagination {
  /* display: flex; -> .flex */
  /* justify-content: center; -> .justify-center */
  margin-top: 40px;
  padding: 20px 0;
  background-color: #2c2c2c;
  border-radius: 6px;
}

.pc-custom-pagination {
  --el-pagination-font-size: 14px;
}

/* PC端分页器样式 */
.pc-pagination :deep(.el-pagination) {
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
}

/* PC端页码按钮样式 */
.pc-pagination :deep(.el-pagination .el-pager li) {
  min-width: 36px !important;
  height: 36px !important;
  line-height: 34px !important;
  background-color: #4a4a4a !important;
  color: #a0a0a0 !important;
  border: none !important;
  border-radius: 4px !important;
  margin: 0 2px !important;
  font-size: 14px !important;
  font-weight: 400 !important;
  transition: all 0.2s ease !important;
  cursor: pointer !important;
}

/* PC端当前激活页码 */
.pc-pagination :deep(.el-pagination .el-pager li.is-active) {
  background-color: #ff6600 !important;
  color: #ffffff !important;
  font-weight: 500 !important;
}

/* PC端页码悬停效果 */
.pc-pagination :deep(.el-pagination .el-pager li:hover:not(.is-active)) {
  background-color: #5a5a5a !important;
  color: #ffffff !important;
}

/* PC端上一页/下一页按钮 */
.pc-pagination :deep(.el-pagination .btn-prev),
.pc-pagination :deep(.el-pagination .btn-next) {
  min-width: 60px !important;
  height: 36px !important;
  background-color: #4a4a4a !important;
  color: #a0a0a0 !important;
  border: none !important;
  border-radius: 4px !important;
  font-size: 14px !important;
  font-weight: 400 !important;
  padding: 0 12px !important;
  transition: all 0.2s ease !important;
  cursor: pointer !important;
}

/* PC端上一页/下一页悬停效果 */
.pc-pagination :deep(.el-pagination .btn-prev:hover:not(:disabled)),
.pc-pagination :deep(.el-pagination .btn-next:hover:not(:disabled)) {
  background-color: #ff6600 !important;
  color: #ffffff !important;
}

/* PC端禁用状态 */
.pc-pagination :deep(.el-pagination .btn-prev:disabled),
.pc-pagination :deep(.el-pagination .btn-next:disabled) {
  background-color: #3a3a3a !important;
  color: #666666 !important;
  cursor: not-allowed !important;
}

/* PC端省略号样式 */
.pc-pagination :deep(.el-pagination .el-pager li.more) {
  background-color: transparent !important;
  color: #a0a0a0 !important;
  cursor: default !important;
}

.pc-pagination :deep(.el-pagination .el-pager li.more:hover) {
  background-color: transparent !important;
  color: #a0a0a0 !important;
}

/* 5.2 移动端自定义分页样式 */
.mobile-pagination-wrapper {
  /* display: flex; -> .flex */
  /* justify-content: center; -> .justify-center */
  margin-top: 20px;
  padding: 15px 0px;
}

.custom-mobile-pagination {
  /* width: 100%; -> .w-full */
  /* display: flex; -> .flex */
  /* align-items: center; -> .items-center */
  background-color: transparent;
  border-radius: 6px;
  overflow: hidden;
  /* 重置ul默认样式 */
  list-style: none;
  margin: 0;
  padding: 0;
}

/* li元素样式 */
.custom-mobile-pagination li {
  width: 20%;
  margin: 0 5px;
}

/* 分页按钮基础样式 */
.pagination-btn {
  /* display: block; -> .block */
  /* width: 100%; -> .w-full */
  height: 40px;
  line-height: 40px;
  background-color: #3f3f3f;
  color: #a0a0a0;
  border: none;
  /* cursor: pointer; -> .cursor-pointer */
  font-size: 16px;
  font-weight: 500;
  /* transition: all 0.2s ease; -> .transition-all */
  border: 1px solid #2f2f2f;
  /* text-align: center; -> .text-center */
  text-decoration: none;
  /* user-select: none; -> .user-select-none */
}

/* 按钮悬停效果 */
.pagination-btn:hover:not(:disabled):not(.disabled) {
  background-color: #5a5a5a;
  color: #ffffff;
}

/* 按钮禁用状态 */
.pagination-btn:disabled,
.pagination-btn.disabled {
  background-color: #2a2a2a;
  color: #555555;
  cursor: not-allowed;
  pointer-events: none;
}

.pagination-btn:disabled:hover,
.pagination-btn.disabled:hover {
  background-color: #2a2a2a;
  color: #555555;
}

/* 页码信息显示区域 */
.page-info {
  width: 20%;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background-color: #2a2a2a;
  color: #ffffff;
  font-size: 15px;
  font-weight: 500;
  padding: 0 20px;
  /* display: flex; -> .flex */
  /* align-items: center; -> .items-center */
  /* justify-content: center; -> .justify-center */
}

.page-info .current-page {
  color: #ffffff;
  font-weight: 600;
}

.page-info .separator {
  color: #888;
  margin: 0 6px;
  font-weight: 400;
}

.page-info .total-pages {
  color: #ffffff;
  font-weight: 600;
}

/* 按钮图标样式 */
.pagination-icon {
  width: 20px;
  height: 20px;
  color: inherit;
  vertical-align: -4px;
  transition: all 0.2s ease;
}

/* ===== 6. 状态提示样式 ===== */
/* 6.1 无数据状态 */
.empty-state {
  /* display: flex; -> .flex */
  /* flex-direction: column; -> .flex-col */
  /* align-items: center; -> .items-center */
  /* justify-content: center; -> .justify-center */
  padding: 80px 20px;
  /* text-align: center; -> .text-center */
  color: #888;
  min-height: 400px;
}

.empty-icon {
  width: 120px;
  height: 120px;
  margin-bottom: 24px;
  color: #666;
  opacity: 0.8;
}

.empty-icon svg {
  /* width: 100%; -> .w-full */
  /* height: 100%; -> .h-full */
  stroke-width: 1.5;
}

.empty-title {
  font-size: 24px;
  font-weight: 600;
  color: #ccc;
  margin: 0 0 12px 0;
  letter-spacing: 0.5px;
}

.empty-description {
  font-size: 16px;
  color: #888;
  margin: 0 0 32px 0;
  line-height: 1.6;
  max-width: 400px;
}

.reset-filters-btn {
  background: #ff6600;
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  /* cursor: pointer; -> .cursor-pointer */
  /* transition: all 0.3s ease; -> .transition-all */
  letter-spacing: 0.3px;
}

.reset-filters-btn:hover {
  background: #e55a00;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 102, 0, 0.3);
}

.reset-filters-btn:active {
  transform: translateY(0);
}

/* 6.2 页码超出范围状态 */
.page-out-of-range {
  /* display: flex; -> .flex */
  /* flex-direction: column; -> .flex-col */
  /* align-items: center; -> .items-center */
  /* justify-content: center; -> .justify-center */
  padding: 80px 20px;
  /* text-align: center; -> .text-center */
  color: #888;
  min-height: 400px;
}

.reset-page-btn {
  background: #4caf50;
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  /* cursor: pointer; -> .cursor-pointer */
  /* transition: all 0.3s ease; -> .transition-all */
  letter-spacing: 0.3px;
}

.reset-page-btn:hover {
  background: #45a049;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.reset-page-btn:active {
  transform: translateY(0);
}

/* 已移除未使用的loading和empty状态样式 */

/* ===== 7. 响应式媒体查询 ===== */
/* 7.1 大屏幕 (≤ 1200px) */
@media (max-width: 1200px) {
  .anime_grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

/* 7.2 中等屏幕 (≤ 992px) */
@media (max-width: 992px) {
  .anime_grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* 7.3 平板屏幕 (≤ 768px) */
@media (max-width: 768px) {
  /* 页面容器 */
  .type-page {
    padding: 0;
  }

  .type-header h1 {
    font-size: 24px;
  }

  .type-header p {
    font-size: 14px;
  }

  /* anime-grid样式已移除 */

  .anime_grid {
    grid-template-columns: repeat(3, 1fr);
    padding: 10px 0;
  }

  .anime_card_item {
    padding: 0px 5px;
    margin-bottom: 10px;
  }

  /* 状态提示样式已移除 */

  .empty-state,
  .page-out-of-range {
    padding: 60px 15px;
    min-height: 320px;
  }

  .empty-icon {
    width: 80px;
    height: 80px;
    margin-bottom: 20px;
  }

  .empty-title {
    font-size: 20px;
    margin-bottom: 10px;
  }

  .empty-description {
    font-size: 14px;
    margin-bottom: 24px;
    max-width: 300px;
  }

  .reset-filters-btn,
  .reset-page-btn {
    padding: 10px 20px;
    font-size: 13px;
  }
}

/* 7.4 小屏幕 (≤ 480px) */
@media (max-width: 480px) {
  /* anime-grid样式已移除 */

  /* 移动端分页适配 */
  .mobile-pagination-wrapper {
    padding: 15px 10px;
  }

  .pagination-btn {
    /* width: 100%; -> .w-full */
    height: 36px;
    line-height: 36px;
    font-size: 15px;
  }

  .page-info {
    height: 36px;
    font-size: 14px;
  }

  .pagination-icon {
    width: 18px;
    height: 18px;
  }

  .custom-mobile-pagination li {
    width: 17.5%;
  }

  .custom-mobile-pagination .page-info {
    width: 30% !important;
  }
}
</style>
