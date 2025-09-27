/**
 * 设备检测工具类
 * 用于统一管理移动端、平板端、桌面端的检测逻辑
 */

/**
 * 静态设备检测工具
 */
export const deviceUtils = {
  // 检测是否为移动端
  isMobile: (breakpoint = 768) => window.innerWidth <= breakpoint,

  // 检测是否为平板
  isTablet: () => window.innerWidth > 768 && window.innerWidth <= 992,

  // 检测是否为桌面端
  isDesktop: () => window.innerWidth > 992,

  // 获取当前屏幕宽度
  getScreenWidth: () => window.innerWidth,

  // 获取设备类型
  getDeviceType: () => {
    const width = window.innerWidth
    if (width <= 768) return 'mobile'
    if (width <= 992) return 'tablet'
    return 'desktop'
  },
}

/**
 * 响应式设备检测类
 * 用于需要监听设备变化的场景
 */
export class ResponsiveDevice {
  constructor(callback, breakpoint = 768) {
    this.callback = callback
    this.breakpoint = breakpoint
    this.isMobile = window.innerWidth <= breakpoint
    this.screenWidth = window.innerWidth

    // 绑定this上下文
    this.handleResize = this.handleResize.bind(this)

    // 防抖处理，避免频繁触发
    this.debounceTimer = null
    this.debouncedResize = this.debouncedResize.bind(this)

    // 添加事件监听
    window.addEventListener('resize', this.debouncedResize)

    // 初始调用回调
    this.callback({
      isMobile: this.isMobile,
      screenWidth: this.screenWidth,
      isTablet: this.screenWidth > 768 && this.screenWidth <= 992,
      isDesktop: this.screenWidth > 992,
    })
  }

  /**
   * 防抖处理resize事件
   */
  debouncedResize() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }
    this.debounceTimer = setTimeout(this.handleResize, 150)
  }

  /**
   * 处理屏幕尺寸变化
   */
  handleResize() {
    const newWidth = window.innerWidth
    const newIsMobile = newWidth <= this.breakpoint

    // 只有状态真正变化时才触发回调
    if (newIsMobile !== this.isMobile || newWidth !== this.screenWidth) {
      this.isMobile = newIsMobile
      this.screenWidth = newWidth

      this.callback({
        isMobile: this.isMobile,
        screenWidth: this.screenWidth,
        isTablet: this.screenWidth > 768 && this.screenWidth <= 992,
        isDesktop: this.screenWidth > 992,
      })
    }
  }

  /**
   * 清理资源，防止内存泄漏
   */
  destroy() {
    window.removeEventListener('resize', this.debouncedResize)
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer)
    }
    this.callback = null
  }

  /**
   * 手动触发检测
   */
  check() {
    this.handleResize()
  }
}

/**
 * 创建简单的设备检测器
 * @param {Function} callback 设备状态变化回调
 * @param {number} breakpoint 移动端断点，默认768
 * @returns {Object} 包含destroy方法的检测器实例
 */
export function createDeviceDetector(callback, breakpoint = 768) {
  const detector = new ResponsiveDevice(callback, breakpoint)

  return {
    // 销毁检测器
    destroy: () => detector.destroy(),

    // 手动检测
    check: () => detector.check(),

    // 获取当前状态
    getCurrentState: () => ({
      isMobile: detector.isMobile,
      screenWidth: detector.screenWidth,
      isTablet: detector.screenWidth > 768 && detector.screenWidth <= 992,
      isDesktop: detector.screenWidth > 992,
    }),
  }
}

/**
 * 常用断点预设
 */
export const breakpoints = {
  mobile: 768,
  tablet: 992,
  desktop: 1200,
  largeDesktop: 1920,
}
