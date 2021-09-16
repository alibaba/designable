import { createLocales } from '@designable/core'
import { DatePicker } from './DatePicker'

export const TimePicker = createLocales(DatePicker, {
  'zh-CN': {
    title: '时间选择',
    settings: {
      'x-component-props': {
        format: {
          title: '格式化',
          placeholder: '如 HH:mm:ss',
        },
        hourStep: '小时步长',
        minuteStep: '分钟步长',
        secondStep: '秒钟步长',
      },
    },
  },
  'en-US': {
    title: 'Time Picker',
    settings: {
      'x-component-props': {
        format: {
          title: 'Format',
          placeholder: 'e.g. HH:mm:ss',
        },
        hourStep: 'Hour Step',
        minuteStep: 'Minute Step',
        secondStep: 'Second Step',
      },
    },
  },
})
