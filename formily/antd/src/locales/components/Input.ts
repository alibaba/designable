import { createLocales } from '@designable/core'
import { Field } from './Field'

export const Input = createLocales(Field, {
  'zh-CN': {
    title: '输入框',
    settings: {
      'x-component-props': {
        addonAfter: '后缀标签',
        addonBefore: '前缀标签',
        maxLength: '最大长度',
        prefix: '前缀',
        suffix: '后缀',
        autoSize: {
          title: '自适应高度',
          tooltip: '可设置为 true | false 或对象：{ minRows: 2, maxRows: 6 }',
        },
        showCount: '是否展示字数',
        checkStrength: '检测强度',
      },
    },
  },
  'en-US': {},
})
