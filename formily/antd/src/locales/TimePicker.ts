import { createLocales } from '@designable/core'
import { DatePicker } from './DatePicker'

export const TimePicker = createLocales(DatePicker, {
  'zh-CN': {
    title: '时间选择',
    settings: {
      'x-component-props': {
        clearText: '清除提示',
        disabledHours: '禁止小时',
        disabledMinutes: '禁止分钟',
        disabledSeconds: '禁止秒',
        hideDisabledOptions: '隐藏禁止选项',
        hourStep: '小时间隔',
        minuteStep: '分钟间隔',
        secondStep: '秒间隔',
        use12Hours: '12小时制',
        inputReadOnly: '输入框只读',
        showNow: '显示此刻',
        format: '格式',
      },
    },
  },
  'en-US': {
    title: 'Time Picker',
    settings: {
      'x-component-props': {
        clearText: 'Clear Text',
        disabledHours: 'Disbaled Hours',
        disabledMinutes: 'Disabled Minutes',
        disabledSeconds: 'Disabled Seconds',
        hideDisabledOptions: 'Hide Disabled Options',
        hourStep: 'Hour Step',
        minuteStep: 'Minute Step',
        secondStep: 'Second Step',
        use12Hours: 'Use 12-hour',
        inputReadOnly: 'Input ReadOnly',
        showNow: 'Show Now',
        format: 'Format',
      },
    },
  },
})

export const TimeRangePicker = createLocales(TimePicker, {
  'zh-CN': {
    title: '时间范围',
  },
  'en-US': {
    title: 'Time Range',
  },
})
