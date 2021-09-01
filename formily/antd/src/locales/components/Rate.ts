import { createLocales } from '@designable/core'
import { Field } from './Field'

export const Rate = createLocales(Field, {
  'zh-CN': {
    title: '评分器',
    settings: {
      'x-component-props': {
        allowHalf: '允许半选',
        tooltips: { title: '提示信息', tooltip: '格式：string[]' },
        count: '总数',
      },
    },
  },
  'en-US': {},
})
