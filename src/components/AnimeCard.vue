<script setup>
/* AnimeCard 组件 - 动漫卡片组件 */

/* ===== 1. 导入依赖 ===== */
// 1.1 Vue Router路由导航
import { useRouter } from 'vue-router'
// 1.2 设备检测工具
import { useDevice } from '@/utils/device'

/* ===== 2. 路由和工具初始化 ===== */
const router = useRouter()

/* ===== 3. 组件属性定义 ===== */
/**
 * 组件属性配置
 * @typedef {Object} Props
 * @property {Object} list - 动漫卡片数据对象
 * @property {number} itemsPer - 每行显示的卡片数量
 */
const props = defineProps({
  // 动漫卡片数据
  list: {
    type: Object,
    default: () => ({}),
    required: true,
  },
  // 每行显示几个卡片 (3-6列可选)
  itemsPer: {
    type: Number,
    default: 6,
    validator: (value) => [3, 4, 5, 6].includes(value),
  },
})

/* ===== 4. 响应式状态数据 ===== */
// 4.1 设备状态管理 - 使用简化的 useDevice 组合式函数
const { isMobile } = useDevice()

/* ===== 5. 业务逻辑函数 ===== */
// 5.1 路由导航处理
/**
 * 点击卡片查看动漫详情
 * @param {Object} animeItem - 动漫数据对象
 * @description 验证数据有效性后导航到详情页面
 * @returns {void}
 */
const viewAnimeDetail = (animeItem) => {
  if (!animeItem || !animeItem.id) {
    return
  }

  // 导航到详情页
  const routeParams = {
    path: `/detail/${animeItem.id}`,
    query: {
      country: animeItem.country,
    },
  }

  router.push(routeParams)
}

// 5.2 图片加载事件处理
/**
 * 图片加载完成处理函数
 * @param {Event} event - 图片加载事件
 * @description 图片加载完成后设置透明度为1，实现淡入效果
 * @returns {void}
 */
const handleImageLoad = (event) => {
  const img = event.target
  if (img) {
    img.style.opacity = '1'
  }
}

/**
 * 图片加载失败处理函数
 * @param {Event} event - 图片错误事件
 * @description 图片加载失败时的错误处理和日志记录
 * @returns {void}
 */
const handleImageError = () => {
  // TODO: 可以在这里设置默认图片
  // if (event?.target) {
  //   event.target.src = '/default-cover.jpg'
  // }
}

// useDevice 会自动处理生命周期，无需手动管理

defineExpose({
  isMobile,
  viewAnimeDetail,
})
</script>

<template>
  <div class="anime_card_item no-select cursor-pointer" @click="viewAnimeDetail(props.list)">
    <a
      href="javascript:void(0)"
      class="anime_link relative block w-full text-center overflow-hidden transition-all"
    >
      <img
        v-lazy="props.list.cover"
        :alt="props.list.title"
        draggable="false"
        class="anime_bg_img absolute inset-0 w-full h-full object-cover transition-opacity"
        @load="handleImageLoad"
        @error="handleImageError"
      />
      <div class="anime_tag absolute">{{ props.list.tag }}</div>
      <div class="anime_update absolute text-ellipsis-1 user-select-none">
        {{ props.list.update_info }}
      </div>
      <div
        class="anime_mask absolute inset-0 w-full h-full flex items-center justify-center transition-opacity user-select-none"
        v-if="!isMobile"
      >
        <div
          class="mask-icon w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </a>
    <div class="anime_info">
      <div class="anime_title w-full text-ellipsis-1">{{ props.list.title }}</div>
      <div class="anime_sub text-ellipsis-1">
        <span class="anime_score">{{ props.list.score }}</span>
        <span class="anime_alias">{{ props.list.subtitle }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* AnimeCard 组件样式 */

.anime_card_item {
  padding: 10px;
}
.anime_link {
  padding-top: 130%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 10px;
  background-color: #2a2a2a;
}

.anime_bg_img {
  border-radius: 10px;
  opacity: 1;
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.anime_bg_img[lazy='loaded'] {
  opacity: 1;
}

.anime_bg_img[lazy='loading'] {
  opacity: 1;
}

.anime_bg_img[lazy='error'] {
  opacity: 1;
}

.anime_link[lazy='loading']::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  margin: -10px 0 0 -10px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #ff9933;
  border-radius: 50%;
  animation: lazy-spin 1s linear infinite;
  z-index: 5;
}

.anime_link[lazy='loaded'] {
  background-color: transparent;
}

.anime_link[lazy='error'] {
  background-color: #f0f0f0;
}

@keyframes lazy-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.anime_tag {
  top: 6px;
  right: 6px;
  padding: 0 5px;
  background-color: #51b23c;
  font-size: 12px;
  border-radius: 3px;
}

.anime_update {
  bottom: 5px;
  right: 10px;
  color: #fff;
  font-size: 12px;
  text-shadow:
    0 1px 3px rgba(0, 0, 0, 0.8),
    0 0 5px rgba(0, 0, 0, 0.6);
  pointer-events: none;
}

.anime_mask {
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 10px;
  opacity: 0;
  pointer-events: none;
}

.anime_link:hover .anime_mask {
  opacity: 1;
}

.mask-icon {
  width: 50px;
  height: 50px;
  background-color: rgba(0, 0, 0, 0.6);
  color: #fff;
  pointer-events: auto;
  transform: scale(1.2);
}

.mask-icon svg {
  width: 30px;
  height: 30px;
  margin-left: 2px; /* 播放按钮视觉居中调整 */
}

.mask-icon:hover {
  background-color: #f35306; /* 悬停时变为橙色 */
}

.anime_link:hover .mask-icon {
  opacity: 1;
  transform: scale(0.9); /* 悬停时缩小到正常大小 */
}

.anime_info {
  cursor: default;
  margin-top: 15px;
}

.anime_title {
  font-size: 16px;
}

.text-ellipsis-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  line-height: 1.2;
}

.anime_score {
  color: #f50;
  margin-right: 5px;
  font-weight: 700;
  vertical-align: middle;
}

.anime_sub {
  margin-top: 5px;
}

.anime_sub .anime_alias {
  color: #888;
  font-size: 12px;
}

/* 9.3 小屏幕/移动端适配 (≤ 768px) - 3列紧凑布局 */
@media (max-width: 768px) {
  .anime_card_item {
    padding: 0;
  }

  .anime_title {
    font-size: 14px; /* 移动端标题字体缩小 */
  }
}
</style>
