import { createLocales } from '@designable/core'
import { Card } from './Card'

export const ArrayCards = createLocales(Card, {
  'zh-CN': {
    title: '自增卡片',
    addIndex: '添加索引',
    addOperation: '添加操作',
  },
  'en-US': {
    title: 'Array Cards',
    addIndex: 'Add Index',
    addOperation: 'Add Operations',
  },
})
