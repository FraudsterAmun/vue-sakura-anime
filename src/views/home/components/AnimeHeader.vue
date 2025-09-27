<script setup>
/* ============================================================================
   AnimeHeader 组件 - 动漫头部组件
   ============================================================================
   功能：显示动漫列表标题、图标、分页控制
   特性：支持左右翻页、节流防抖、响应式隐藏
   ============================================================================ */

/* ===== 1. 导入依赖 ===== */
// Vue 核心组合式API
import { ref, computed } from 'vue'
// Element Plus 图标
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue'

/* ===== 2. 组件属性定义 ===== */
const props = defineProps({
  // 标题相关属性
  title: {
    type: String,
    default: '',
  },
  icon: {
    type: [Object, String],
    default: null,
  },
  iconColor: {
    type: String,
    default: '#f46304',
  },
  subTitle: {
    type: String,
    default: '',
  },
  totalPage: {
    type: Number,
    default: 0,
  },
  // 分页相关属性
  showPagination: {
    type: Boolean,
    default: false,
  },
  currentPageFromCard: {
    type: Number,
    default: 0,
  },
  totalCards: {
    type: Number,
    default: 0,
  },
  cardsPerPage: {
    type: Number,
    default: 6,
  },
})

/* ===== 3. 事件定义 ===== */
const emit = defineEmits(['prev', 'next', 'reset'])

/* ===== 4. 响应式状态数据 ===== */
// 节流状态控制
const isThrottling = ref(false)

/* ===== 5. 计算属性 ===== */
// 当前页码（从父组件props获取）
const currentPage = computed(() => props.currentPageFromCard)

// 计算最大页数
const maxPage = computed(() => {
  return Math.ceil(props.totalPage / props.cardsPerPage)
})

/* ===== 6. 事件处理函数 ===== */
/**
 * 重置到第一页
 * @description 重置分页状态并清除节流
 */
const resetToFirstPage = () => {
  isThrottling.value = false
  emit('reset', { page: 0 })
}

/**
 * 上一页处理函数（带节流控制）
 * @description 检查边界条件和节流状态，执行上一页操作
 */
const handlePrev = () => {
  if (currentPage.value > 0 && !isThrottling.value) {
    // 开启节流
    isThrottling.value = true

    // 触发上一页事件
    emit('prev')

    // 500ms后解除节流（与动画时长一致）
    setTimeout(() => {
      isThrottling.value = false
    }, 500)
  }
}

/**
 * 下一页处理函数（带节流控制）
 * @description 检查边界条件和节流状态，执行下一页操作
 */
const handleNext = () => {
  if (currentPage.value < maxPage.value - 1 && !isThrottling.value) {
    // 开启节流
    isThrottling.value = true

    // 触发下一页事件
    emit('next')

    // 500ms后解除节流（与动画时长一致）
    setTimeout(() => {
      isThrottling.value = false
    }, 500)
  }
}

/* ===== 7. 组件暴露接口 ===== */
// 暴露方法和数据给父组件使用
defineExpose({
  resetToFirstPage,
  currentPage,
})
</script>

<template>
  <div class="card_header no-select flex items-center justify-between">
    <!-- 左侧标题 -->
    <div class="card_header_title">
      <el-icon v-if="props.icon" :color="props.iconColor">
        <component :is="props.icon" />
      </el-icon>
      <span class="card_header_title_text">{{ props.title }}</span>
    </div>

    <!-- 中间插槽（周末列表等） -->
    <slot name="center"></slot>

    <!-- 分页控制 -->
    <div class="card_header_pagination flex items-center" v-if="props.showPagination">
      <el-icon
        :size="16"
        @click="handlePrev"
        class="pagination-btn cursor-pointer flex items-center justify-center rounded-full transition-all"
        :class="{
          disabled: currentPage === 0,
          throttling: isThrottling,
        }"
      >
        <ArrowLeft />
      </el-icon>
      <span class="pagination-info text-center">{{ currentPage + 1 }} / {{ maxPage }}</span>
      <el-icon
        :size="16"
        @click="handleNext"
        class="pagination-btn cursor-pointer flex items-center justify-center rounded-full transition-all"
        :class="{
          disabled: currentPage >= maxPage - 1,
          throttling: isThrottling,
        }"
      >
        <ArrowRight />
      </el-icon>
    </div>

    <!-- 右侧副标题 -->
    <div class="card_header_right" v-if="props.subTitle">
      <h3 class="card_header_title_text">{{ props.subTitle }}</h3>
    </div>
  </div>
</template>

<style scoped>
/* AnimeHeader 组件样式 */

/* ===== 1. 基础样式和重置 ===== */
/* 1.1 用户交互控制样式已移至工具类 utilities.css */

/* ===== 2. 头部容器 ===== */
.card_header {
  margin-bottom: 20px;
  margin-left: 10px;
}

/* ===== 3. 标题样式 ===== */
.card_header_title .el-icon {
  font-size: 28px;
  vertical-align: -6px;
}

.card_header_title_text {
  font-size: 24px;
  font-weight: 800;
}

/* ===== 4. 分页控制 ===== */
.card_header_pagination {
  margin-left: auto;
  padding: 4px 8px;
  gap: 8px;
}

.pagination-btn {
  padding: 4px;
  color: rgba(255, 255, 255, 0.7);
  background-color: transparent;
  width: 24px;
  height: 24px;
}

.pagination-btn:hover:not(.disabled) {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.1);
}

.pagination-btn.disabled {
  opacity: 0.3;
}

.pagination-btn.disabled:hover {
  background-color: transparent;
  color: rgba(255, 255, 255, 0.7);
}

.pagination-btn.throttling {
  cursor: wait;
  pointer-events: none;
}

.pagination-btn.throttling:hover {
  background-color: rgba(255, 153, 51, 0.3);
  color: rgba(255, 255, 255, 0.7);
}

.pagination-info {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 400;
  min-width: 30px;
  padding: 0 4px;
  line-height: 1;
}

/* ===== 5. 副标题 ===== */
.card_header_right {
  margin-right: 90px;
}

/* ===== 6. 响应式 ===== */
@media (max-width: 1200px) {
  .card_header_right {
    margin-right: 80px;
  }
}

@media (max-width: 992px) {
  .card_header_right {
    margin-right: 75px;
  }
}

@media (max-width: 768px) {
  .card_header {
    margin-left: 0;
    justify-content: start;
  }

  .card_header_pagination {
    display: none; /* 平板和移动端隐藏分页控制 */
  }

  .card_header_right {
    display: none; /* 平板和移动端隐藏副标题 */
  }

  .card_header_title .el-icon {
    font-size: 24px;
  }

  .card_header_title_text {
    font-size: 20px;
  }
}

@media (max-width: 590px) {
  .card_header {
    flex-wrap: wrap;
  }
}
</style>
