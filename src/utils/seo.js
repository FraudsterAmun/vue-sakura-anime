/**
 * SEO 工具函数
 * 用于动态设置页面的 meta 标签和标题
 */

/**
 * 设置页面标题和meta信息
 * @param {Object} config - SEO配置对象
 * @param {string} config.title - 页面标题
 * @param {string} config.description - 页面描述
 * @param {string} config.keywords - 关键词
 * @param {string} config.image - 分享图片
 * @param {string} config.url - 当前页面URL
 */
export function setSEO(config = {}) {
  const {
    title = '樱花动漫 - 专业的动漫观看平台',
    description = '樱花动漫提供最新最全的日本动漫、国产动漫在线观看，包含热门新番、经典动漫、动漫电影等，高清流畅播放体验。',
    keywords = '动漫,日本动漫,国产动漫,在线观看,新番,动漫电影,樱花动漫',
    image = '/og-image.jpg',
    url = window.location.href,
  } = config

  // 设置页面标题
  document.title = title

  // 更新或创建 meta 标签
  updateMetaTag('description', description)
  updateMetaTag('keywords', keywords)

  // Open Graph 标签
  updateMetaTag('og:title', title, 'property')
  updateMetaTag('og:description', description, 'property')
  updateMetaTag('og:image', image, 'property')
  updateMetaTag('og:url', url, 'property')

  // Twitter 标签
  updateMetaTag('twitter:title', title, 'property')
  updateMetaTag('twitter:description', description, 'property')
  updateMetaTag('twitter:image', image, 'property')
}

/**
 * 更新或创建 meta 标签
 * @param {string} name - meta 标签的 name 或 property
 * @param {string} content - meta 标签的 content
 * @param {string} attribute - 使用的属性名 ('name' 或 'property')
 */
function updateMetaTag(name, content, attribute = 'name') {
  let metaTag = document.querySelector(`meta[${attribute}="${name}"]`)

  if (metaTag) {
    metaTag.setAttribute('content', content)
  } else {
    metaTag = document.createElement('meta')
    metaTag.setAttribute(attribute, name)
    metaTag.setAttribute('content', content)
    document.head.appendChild(metaTag)
  }
}

/**
 * 设置结构化数据
 * @param {Object} data - 结构化数据对象
 */
export function setStructuredData(data) {
  // 移除已存在的结构化数据
  const existingScript = document.querySelector(
    'script[type="application/ld+json"]#dynamic-structured-data',
  )
  if (existingScript) {
    existingScript.remove()
  }

  // 添加新的结构化数据
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.id = 'dynamic-structured-data'
  script.textContent = JSON.stringify(data)
  document.head.appendChild(script)
}

/**
 * 为动漫详情页设置SEO
 * @param {Object} animeInfo - 动漫信息
 */
export function setAnimeSEO(animeInfo) {
  const title = `${animeInfo.title} - 在线观看 - 樱花动漫`
  const description = `观看《${animeInfo.title}》在线动漫，${animeInfo.subtitle || ''}。${animeInfo.description || ''}樱花动漫提供高清流畅的观看体验。`
  const keywords = `${animeInfo.title},${animeInfo.subtitle || ''},在线观看,动漫,樱花动漫`

  setSEO({
    title,
    description,
    keywords,
    image: animeInfo.cover || '/og-image.jpg',
  })

  // 设置动漫结构化数据
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'TVSeries',
    name: animeInfo.title,
    alternateName: animeInfo.subtitle,
    description: animeInfo.description,
    image: animeInfo.cover,
    genre: animeInfo.genre || ['动画', '日本动漫'],
    datePublished: animeInfo.year,
    contentRating: 'PG-13',
    aggregateRating: animeInfo.rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: animeInfo.rating,
          ratingCount: animeInfo.ratingCount || 100,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined,
  }

  setStructuredData(structuredData)
}

/**
 * 为分类页设置SEO
 * @param {string} type - 分类类型 ('japan' | 'china')
 */
export function setTypeSEO(type) {
  const typeMap = {
    japan: {
      title: '日本动漫大全 - 最新日漫在线观看 - 樱花动漫',
      description:
        '樱花动漫日本动漫频道，提供最新最全的日本动漫在线观看，包含热门新番、经典日漫、动漫电影等，高清流畅播放。',
      keywords: '日本动漫,日漫,新番,动漫在线观看,樱花动漫',
    },
    china: {
      title: '国产动漫大全 - 最新国漫在线观看 - 樱花动漫',
      description:
        '樱花动漫国产动漫频道，提供最新最全的国产动漫在线观看，包含热门国漫、经典动画、3D动漫等，高清流畅播放。',
      keywords: '国产动漫,国漫,中国动漫,动漫在线观看,樱花动漫',
    },
  }

  const config = typeMap[type] || typeMap.japan
  setSEO(config)
}

/**
 * 为首页设置SEO
 */
export function setHomeSEO() {
  setSEO({
    title: '樱花动漫 - 专业的动漫观看平台 - 最新日漫国漫在线观看',
    description:
      '樱花动漫是专业的动漫观看平台，提供最新最全的日本动漫、国产动漫在线观看，包含热门新番、经典动漫、动漫电影等，高清流畅播放体验。',
    keywords: '动漫,日本动漫,国产动漫,在线观看,新番,动漫电影,樱花动漫,动漫网站',
  })
}
