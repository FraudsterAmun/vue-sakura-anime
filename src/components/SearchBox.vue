<script setup>
/* ============================================================================
   SearchBox 组件 - 搜索框组件
   ============================================================================
   功能：搜索输入、搜索历史
   ============================================================================ */

/* ===== 1. 导入依赖 ===== */
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSearchStore } from '@/stores'
import { Search, Delete, Clock } from '@element-plus/icons-vue'

/* ===== 2. 路由和状态管理 ===== */
const router = useRouter()
const searchStore = useSearchStore()

/* ===== 3. 响应式数据 ===== */
const searchInput = ref('')
const showDropdown = ref(false)
const inputFocused = ref(false)
const searchInputRef = ref(null)

/* ===== 4. 计算属性 ===== */
// 是否显示搜索历史
const showHistory = computed(() => {
  return inputFocused.value && !searchInput.value && searchStore.searchHistory.length > 0
})

// 是否显示下拉面板（只显示搜索历史）
const showPanel = computed(() => {
  return showHistory.value
})

/* ===== 6. 事件处理函数 ===== */
/**
 * 执行搜索
 */
const handleSearch = () => {
  const keyword = searchInput.value.trim()
  if (!keyword) return

  // 跳转到搜索结果页
  router.push({
    name: 'Search',
    query: { keyword },
  })

  // 隐藏下拉面板
  inputFocused.value = false
  showDropdown.value = false

  // 清空输入框
  searchInput.value = ''
}

/**
 * 选择历史记录
 * @param {string} keyword - 历史关键词
 */
const selectHistory = (keyword) => {
  searchInput.value = keyword
  handleSearch()
}

/**
 * 删除单条历史记录
 * @param {string} keyword - 要删除的关键词
 * @param {Event} event - 事件对象
 */
const removeHistory = (keyword, event) => {
  event.stopPropagation()
  searchStore.removeHistoryItem(keyword)
}

/**
 * 清空搜索历史
 */
const clearAllHistory = () => {
  searchStore.clearHistory()
}

/**
 * 输入框获得焦点
 */
const handleFocus = () => {
  inputFocused.value = true
  showDropdown.value = true

  // 确保输入框真正获得焦点
  if (searchInputRef.value) {
    searchInputRef.value.focus()
  }
}

/**
 * 点击容器区域，聚焦到输入框
 */
const handleWrapperClick = (e) => {
  // 如果点击的是搜索按钮，不处理
  if (e.target.closest('.search-button')) {
    return
  }

  // 聚焦到输入框
  if (searchInputRef.value) {
    searchInputRef.value.focus()
  }
}

/**
 * 输入框失去焦点（延迟隐藏，确保点击事件能触发）
 */
const handleBlur = () => {
  setTimeout(() => {
    inputFocused.value = false
    showDropdown.value = false
  }, 200)
}
</script>

<template>
  <div class="search_box_wrapper" @click="handleWrapperClick">
    <!-- 隐藏的假输入框，欺骗浏览器自动填充 -->
    <input type="text" name="fake-search" autocomplete="off" style="display: none" tabindex="-1" />

    <!-- 搜索输入框 - 使用原生样式 -->
    <input
      ref="searchInputRef"
      v-model="searchInput"
      type="search"
      placeholder="搜索..."
      class="search-input"
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      name="search-anime"
      role="search"
      @keyup.enter="handleSearch"
      @focus="handleFocus"
      @blur="handleBlur"
      @click="handleFocus"
    />
    <button class="search-button" @click="handleSearch">
      <Search />
      <span>搜索</span>
    </button>

    <!-- 下拉面板  -->
    <div v-show="showPanel" class="search_dropdown">
      <!-- 搜索历史 -->
      <div v-if="showHistory" class="history_panel">
        <div class="panel-header">
          <div class="panel-title">
            <el-icon class="title-icon"><Clock /></el-icon>
            搜索历史
          </div>
          <el-button link type="danger" size="small" @click="clearAllHistory"> 清空 </el-button>
        </div>
        <div class="history-list">
          <div
            v-for="(keyword, index) in searchStore.searchHistory"
            :key="index"
            class="history-item"
            @click="selectHistory(keyword)"
          >
            <span class="item-text">{{ keyword }}</span>
            <el-icon class="delete-icon" @click="removeHistory(keyword, $event)">
              <Delete />
            </el-icon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 搜索框容器 - 不改变原有样式 */
.search_box_wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  z-index: 9999; /* 确保搜索框和下拉框在最上层 */
}

/* 使用父组件的样式，不覆盖 */
.search-input {
  width: 100%;
  height: 100%;
  outline: none;
  border: 0;
  padding-left: 10px;
  color: #fff;
  background-color: transparent;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

/* 禁用浏览器自动填充的样式 */
.search-input:-webkit-autofill,
.search-input:-webkit-autofill:hover,
.search-input:-webkit-autofill:focus,
.search-input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 1000px #252525 inset !important;
  -webkit-text-fill-color: #fff !important;
  transition: background-color 5000s ease-in-out 0s;
}

/* 隐藏浏览器的自动填充图标 */
.search-input::-webkit-contacts-auto-fill-button,
.search-input::-webkit-credentials-auto-fill-button {
  visibility: hidden;
  display: none !important;
  pointer-events: none;
  position: absolute;
  right: 0;
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
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
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

/* 下拉面板 */
.search_dropdown {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  right: 0;
  background: #2a2a2a;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6);
  max-height: 400px;
  overflow-y: auto;
  z-index: 99999;
  border: 1px solid #3a3a3a;
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 面板标题 */
.panel-title {
  font-size: 13px;
  font-weight: 600;
  color: #aaa;
  padding: 14px 18px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  letter-spacing: 0.5px;
}

.title-icon {
  font-size: 16px;
  color: #f46b03;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 14px;
  border-bottom: 1px solid #3a3a3a;
  background: linear-gradient(180deg, #2d2d2d 0%, #2a2a2a 100%);
}

.panel-header .panel-title {
  padding-right: 0;
  border-bottom: none;
}

.panel-header .el-button {
  font-size: 12px;
  transition: all 0.2s;
}

.panel-header .el-button:hover {
  transform: scale(1.05);
}

/* 搜索历史 */
.history_panel {
  padding-bottom: 4px;
}

.history-list {
  max-height: 280px;
  overflow-y: auto;
  padding: 4px 0;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 18px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.history-item::before {
  content: '';
  position: absolute;
  left: 18px;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 0;
  background: #f46b03;
  border-radius: 2px;
  transition: height 0.2s ease;
}

.history-item:hover {
  background: linear-gradient(90deg, rgba(244, 107, 3, 0.1) 0%, transparent 100%);
  padding-left: 28px;
}

.history-item:hover::before {
  height: 60%;
}

.history-item .item-text {
  flex: 1;
  color: #ddd;
  font-size: 14px;
  transition: color 0.2s;
}

.history-item:hover .item-text {
  color: #fff;
}

.delete-icon {
  color: #666;
  font-size: 16px;
  transition: all 0.2s;
  opacity: 0;
  padding: 4px;
  border-radius: 4px;
}

.history-item:hover .delete-icon {
  opacity: 1;
  color: #999;
}

.delete-icon:hover {
  color: #f56c6c !important;
  background: rgba(245, 108, 108, 0.1);
  transform: scale(1.1);
}

/* ===== 响应式设计 ===== */
@media (max-width: 768px) {
  .search_box_wrapper {
    max-width: 100%;
  }

  .search-btn {
    min-width: 60px;
    padding: 0 15px;
  }

  .search_dropdown {
    max-height: 300px;
  }
}

@media (max-width: 480px) {
  .search-input :deep(.el-input__wrapper) {
    height: 36px;
  }

  .search-btn {
    height: 36px;
    font-size: 14px;
  }
}
</style>
