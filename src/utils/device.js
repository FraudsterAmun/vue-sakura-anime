/**
 * 设备检测工具
 * 简单易懂的设备检测方案，适合团队协作
 */

import { ref, onMounted, onUnmounted } from 'vue'

/**
 * 响应式设备检测 - Vue 组合式函数
 * 自动监听窗口大小变化，组件卸载时自动清理
 *
 * @param {number} breakpoint - 移动端断点，默认 768px
 * @returns {Object} 包含响应式设备状态的对象
 *
 * @example
 * // 在组件中使用
 * const { isMobile, screenWidth, isTablet, isDesktop } = useDevice()
 *
 * // 在模板中直接使用
 * <div v-if="isMobile">移动端内容</div>
 */
export function useDevice(breakpoint = 768) {
  // 响应式状态
  const isMobile = ref(window.innerWidth <= breakpoint)
  const screenWidth = ref(window.innerWidth)
  const isTablet = ref(window.innerWidth > 768 && window.innerWidth <= 992)
  const isDesktop = ref(window.innerWidth > 992)

  // 防抖定时器
  let resizeTimer = null

  /**
   * 更新设备状态
   */
  const updateDeviceState = () => {
    const width = window.innerWidth
    screenWidth.value = width
    isMobile.value = width <= breakpoint
    isTablet.value = width > 768 && width <= 992
    isDesktop.value = width > 992
  }

  /**
   * 防抖处理的 resize 事件
   */
  const handleResize = () => {
    if (resizeTimer) {
      clearTimeout(resizeTimer)
    }
    resizeTimer = setTimeout(updateDeviceState, 150)
  }

  // 组件挂载时添加监听
  onMounted(() => {
    window.addEventListener('resize', handleResize)
  })

  // 组件卸载时自动清理
  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    if (resizeTimer) {
      clearTimeout(resizeTimer)
    }
  })

  // 返回响应式状态
  return {
    isMobile,
    screenWidth,
    isTablet,
    isDesktop,
  }
}
