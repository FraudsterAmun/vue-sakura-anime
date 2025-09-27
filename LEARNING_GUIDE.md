# 🚀 Vue3 动漫网站 - 初学者学习指南

## 📖 项目简介

这是一个基于 Vue3 + Pinia + Vue Router 构建的动漫展示网站，适合 Vue3 初学者学习。

## 🎯 学习路径

### 第一阶段：基础概念 (1-2周)

1. **Vue3 基础语法**
   - 组合式API (`<script setup>`)
   - 响应式数据 (`ref`, `reactive`)
   - 生命周期钩子 (`onMounted`, `onUnmounted`)

2. **项目结构理解**
   ```
   src/
   ├── main.js          # 应用入口
   ├── App.vue          # 根组件
   ├── views/           # 页面组件 (学习重点)
   ├── components/      # 可复用组件
   ├── router/          # 路由配置
   └── stores/          # 状态管理
   ```

### 第二阶段：核心功能 (2-3周)

1. **路由系统** - `src/router/index.js`
2. **状态管理** - `src/stores/`
3. **API调用** - `src/api/`
4. **组件通信** - props, emit, provide/inject

### 第三阶段：样式和优化 (1-2周)

1. **CSS模块化** - `<style scoped>`
2. **响应式设计** - 媒体查询
3. **性能优化** - 懒加载、防抖

## 🔧 推荐学习顺序

### 先看这些简单文件：

1. `src/main.js` - 应用配置
2. `src/router/index.js` - 路由设置
3. `src/stores/modules/home.js` - 状态管理示例
4. `src/components/WeekItem.vue` - 简单组件示例

### 然后学习核心页面：

1. `src/views/home/index.vue` - 首页逻辑
2. `src/views/detail/index.vue` - 详情页逻辑

### 最后研究复杂组件：

1. `src/views/layout/index.vue` - 布局组件
2. `src/components/AnimeCard.vue` - 卡片组件

## 💡 学习技巧

### 阅读代码时：

1. **先看注释** - 每个文件都有详细注释
2. **关注结构** - 代码按功能分块组织
3. **查看导入** - 了解组件依赖关系
4. **运行调试** - 在浏览器中观察效果

### 实践建议：

1. **复制组件** - 创建类似的组件练习
2. **修改样式** - 尝试调整CSS看效果
3. **添加功能** - 在现有基础上添加新功能
4. **查看控制台** - 观察网络请求和错误信息

## 🚫 初学者应该跳过的复杂内容

### 暂时不要关注：

- `utilities.css` 中的大量工具类
- `@vueuse/core` 的高级用法
- 复杂的响应式设计代码
- 性能优化相关代码

### 专注核心：

- Vue3 组合式API
- 组件间通信
- 路由导航
- 状态管理基础

## 📚 推荐资源

### 官方文档：

- [Vue3 官方文档](https://cn.vuejs.org/)
- [Vue Router 文档](https://router.vuejs.org/zh/)
- [Pinia 文档](https://pinia.vuejs.org/zh/)

### 学习视频：

- Vue3 + Vite 快速上手
- 组合式API 详解
- Vue Router 路由管理

## 🎯 实践项目建议

### 简化版本练习：

1. **静态版本** - 先做静态页面，不涉及API
2. **基础交互** - 添加点击、悬停效果
3. **路由导航** - 实现页面跳转
4. **数据展示** - 使用假数据渲染列表
5. **API集成** - 最后接入真实接口

### 扩展功能：

1. **搜索功能** - 添加动漫搜索
2. **收藏功能** - 实现本地收藏
3. **主题切换** - 暗色/亮色主题
4. **分页功能** - 数据分页展示

记住：**循序渐进，不要急于求成！** 🌟
