/**
 * 动漫筛选配置
 */

// 类型筛选选项
export const typeOptions = [
  '全部',
  '搞笑',
  '运动',
  '励志',
  '武侠',
  '特摄',
  '热血',
  '战斗',
  '竞技',
  '校园',
  '青春',
  '爱情',
  '冒险',
  '后宫',
  '百合',
  '治愈',
  '梦幻',
  '魔法',
  '悬疑',
  '推理',
  '奇幻',
  '神魔',
  '恐怖',
  '血腥',
  '机战',
  '战争',
  '犯罪',
  '社会',
  '职场',
  '剧情',
  '伪娘',
  '耽美',
  '腐女',
  '内涵',
  '美少女',
  '吸血鬼',
  '泡面番',
  '欢乐向',
]

// 地区筛选选项
export const regionOptions = [
  '全部',
  '大陆',
  '香港',
  '台湾',
  '美国',
  '法国',
  '英国',
  '日本',
  '韩国',
  '德国',
  '泰国',
  '印度',
  '意大利',
  '西班牙',
  '加拿大',
  '其他',
]

// 年份筛选选项
export const yearOptions = [
  '全部',
  '2024',
  '2023',
  '2022',
  '2021',
  '2020',
  '2019',
  '2018',
  '2017',
  '2016',
  '2015',
  '2014',
  '2013',
  '2012',
  '2011',
  '2010',
  '2009',
  '2008',
  '2007',
  '2006',
  '2005',
  '2004',
  '2003',
  '2002',
  '更早',
]

// 字母筛选选项
export const letterOptions = [
  '全部',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  '0-9',
]

// 筛选器配置
export const filterConfig = [
  {
    key: 'type',
    label: '类型',
    options: typeOptions,
  },
  {
    key: 'region',
    label: '地区',
    options: regionOptions,
  },
  {
    key: 'year',
    label: '年份',
    options: yearOptions,
  },
  {
    key: 'letter',
    label: '字母',
    options: letterOptions,
  },
]

// 默认筛选状态
export const defaultFilters = {
  type: '全部',
  region: '全部',
  year: '全部',
  letter: '全部',
}
