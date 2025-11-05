<script setup>
/* AnimeFilter 组件 - 动漫筛选器组件 */

/* ===== 1. 导入依赖 ===== */
// Vue 核心组合式API
import { ref, computed } from 'vue'
// Swiper轮播组件
import { Swiper, SwiperSlide } from 'swiper/vue'
import { FreeMode } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/free-mode'
// 筛选配置数据
import { filterConfig } from '@/utils/filterConfig'
// 设备检测工具
import { useDevice } from '@/utils/device'

/* ===== 2. 组件事件和配置初始化 ===== */
// 声明组件事件
const emit = defineEmits(['filter-change'])
// Swiper模块配置
const swiperModules = [FreeMode]

/* ===== 3. 响应式状态数据 ===== */
// 3.1 设备和布局状态 - 使用简化的 useDevice 组合式函数
const { isMobile } = useDevice()

// 3.2 筛选器状态数据
const filters = ref({
  type: '全部',
  region: '全部',
  year: '全部',
  letter: '全部',
})

/* ===== 4. 静态配置数据 ===== */
// 筛选条件标签映射
const filterLabels = {
  type: '类型',
  region: '地区',
  year: '年份',
  letter: '字母',
}

/* ===== 5. 计算属性 ===== */
// 5.1 活跃筛选标签计算
/**
 * 计算已激活的筛选条件
 * @description 过滤出所有非"全部"的筛选条件，用于状态标签显示
 * @returns {Array} 活跃的筛选标签数组
 */
const activeFilterTags = computed(() => {
  const tags = []
  Object.entries(filters.value).forEach(([key, value]) => {
    if (value !== '全部') {
      tags.push({
        label: filterLabels[key],
        value: value,
        key: key,
      })
    }
  })

  return tags
})

/* ===== 6. 筛选业务逻辑函数 ===== */
// 6.1 单项筛选处理
/**
 * 处理筛选项点击事件
 * @param {string} filterKey - 筛选类型键名 (type/region/year/letter)
 * @param {string} value - 选中的筛选值
 * @description 更新本地筛选状态，触发UI更新，并通知父组件筛选条件变化
 * @returns {void}
 */
const selectFilter = (filterKey, value) => {
  if (!filterKey || !filterLabels[filterKey]) {
    return
  }

  filters.value[filterKey] = value

  // 通知父组件筛选变化
  emit('filter-change', {
    filterKey,
    value,
    filters: { ...filters.value },
  })
}

// 7.2 筛选重置处理
/**
 * 重置所有筛选条件到默认状态
 * @description 将所有筛选条件重置为"全部"，清空活跃标签，并通知父组件
 * @returns {void}
 */
const resetAllFilters = () => {
  const defaultFilters = {
    type: '全部',
    region: '全部',
    year: '全部',
    letter: '全部',
  }

  filters.value = defaultFilters

  // 通知父组件重置筛选
  emit('filter-change', {
    filterKey: 'reset',
    value: null,
    filters: defaultFilters,
  })
}

// useDevice 会自动处理生命周期，无需手动管理
</script>

<template>
  <div class="anime-filter w-full">
    <!-- 筛选器列表 -->
    <div class="filter-list">
      <!-- PC端：普通布局 -->
      <template v-if="!isMobile">
        <div class="filter-row flex items-start">
          <div class="filter-label flex-shrink-0">已选</div>

          <div class="filter-options flex-1">
            <span
              v-for="option in activeFilterTags"
              :key="option"
              class="filter-option inline-block cursor-pointer user-select-none"
            >
              {{ option.value }}
            </span>

            <span
              v-if="activeFilterTags.length === 0"
              class="filter-option inline-block cursor-pointer user-select-none"
            >
              全部
            </span>
          </div>
          <div class="header-right">
            <span class="reset-link cursor-pointer" @click="resetAllFilters">重新筛选</span>
          </div>
        </div>

        <div v-for="config in filterConfig" :key="config.key" class="filter-row flex items-start">
          <!-- 筛选维度标签 -->
          <div class="filter-label flex-shrink-0">
            {{ config.label }}
          </div>

          <!-- 筛选选项 -->
          <div class="filter-options flex-1">
            <span
              v-for="option in config.options"
              :key="option"
              :class="[
                'filter-option inline-block cursor-pointer user-select-none transition-all',
                {
                  active: filters[config.key] === option,
                  'is-all': option === '全部',
                },
              ]"
              @click="selectFilter(config.key, option)"
            >
              {{ option }}
            </span>
          </div>
        </div>
      </template>

      <!-- 移动端：滑动布局 -->
      <template v-else>
        <div class="filter-row-mobile flex items-center">
          <div class="filter-label-mobile flex-shrink-0">已选</div>

          <div class="filter-options-mobile w-full overflow-hidden">
            <span v-for="option in activeFilterTags" :key="option" class="filter-option">
              {{ option.value }}
            </span>

            <span v-if="activeFilterTags.length === 0" class="filter-option-mobile"> 全部 </span>
          </div>
          <div class="header-right flex-shrink-0">
            <span class="reset-link cursor-pointer" @click="resetAllFilters">重新筛选</span>
          </div>
        </div>
        <div
          v-for="config in filterConfig"
          :key="config.key"
          class="filter-row-mobile flex items-center"
        >
          <!-- 筛选维度标签 -->
          <div class="filter-label-mobile flex-shrink-0">
            {{ config.label }}
          </div>

          <!-- 滑动筛选选项 -->
          <div class="filter-options-mobile w-full overflow-hidden">
            <Swiper
              :modules="swiperModules"
              :slides-per-view="'auto'"
              :space-between="8"
              :free-mode="{ enabled: true, sticky: false }"
              :grab-cursor="true"
              class="filter-swiper w-full"
            >
              <SwiperSlide
                v-for="option in config.options"
                :key="option"
                class="filter-slide flex-shrink-0"
              >
                <span
                  :class="[
                    'filter-option-mobile inline-flex items-center justify-center cursor-pointer user-select-none transition-all',
                    {
                      active: filters[config.key] === option,
                      'is-all': option === '全部',
                    },
                  ]"
                  @click="selectFilter(config.key, option)"
                >
                  {{ option }}
                </span>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
/* AnimeFilter 组件样式 */

.anime-filter {
  background: #2a2a2a;
  border: 1px solid #3a3a3a;
  border-radius: 0;
  padding: 0;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.reset-link {
  color: #bbb;
  font-size: 12px;
  text-decoration: none;
}

.reset-link:hover {
  color: #fff;
}

.filter-list {
  padding: 14px 16px;
}

.filter-row {
  gap: 12px;
  margin-bottom: 12px;
}

.filter-row:last-child {
  margin-bottom: 0;
}

.filter-label {
  color: #999;
  font-size: 12px;
  font-weight: normal;
  min-width: 28px;
  line-height: 20px;
}

.filter-options {
  line-height: 1;
}

.filter-option {
  padding: 2px 8px;
  color: #666;
  font-size: 12px;
  border-radius: 2px;
  white-space: nowrap;
  border: none;
  line-height: 1.4;
  text-align: center;
  min-width: 24px;
  height: 20px;
}

.filter-option:hover {
  background: #5a5a5a;
  color: #bbb;
}

.filter-option.active {
  background: #ff6600;
  color: #fff;
}

.filter-option.is-all.active {
  background: #ff6600;
  color: #fff;
}

.filter-row-mobile {
  margin-bottom: 12px;
}

.filter-row-mobile:last-child {
  margin-bottom: 0;
}

.filter-label-mobile {
  color: #999;
  font-size: 12px;
  font-weight: normal;
  padding: 0 4px;
}

.filter-swiper {
  padding: 0 4px;
}

.filter-slide {
  width: auto !important;
}

.filter-option-mobile {
  padding: 4px 12px;
  color: #666;
  font-size: 12px;
  border-radius: 16px;
  white-space: nowrap;
  background: #2a2a2a;
  line-height: 1.4;
  height: 28px;
  min-width: 40px;
}

.filter-option-mobile:hover {
  background: #3a3a3a;
  border-color: #555;
  color: #bbb;
}

.filter-option-mobile.active {
  background: #ff6600;
  border-color: #ff6600;
  color: #fff;
}

.filter-option-mobile.is-all.active {
  background: #ff6600;
  border-color: #ff6600;
  color: #fff;
}

.filter-swiper .swiper-slide {
  width: auto !important;
  margin-right: 10px !important;
}

@media (max-width: 768px) {
  .filter-list {
    padding: 10px 12px;
  }

  .filter-row {
    gap: 16px;
  }

  .filter-label {
    min-width: auto;
    margin-top: 0;
  }

  .filter-option {
    padding: 3px 6px;
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .filter-options {
    gap: 3px;
  }

  .filter-option {
    padding: 2px 5px;
    font-size: 10px;
  }

  .filter-option-mobile {
    padding: 3px 10px;
    height: 26px;
    min-width: 36px;
  }

  .filter-swiper {
    padding: 0 2px;
  }

  .active-filter-tag {
    font-size: 10px;
    padding: 2px 4px;
    margin-left: 4px;
  }

  .no-filter-text {
    font-size: 11px;
  }
}
</style>
