import { createLocales } from '@designable/core'

export const DatePicker = {
  'zh-CN': {
    title: '日期选择',
    settings: {
      'x-component-props': {
        format: {
          title: '格式',
          placeholder: 'YYYY-MM-DD',
        },
        showTime: '使用时间控件',
        resetTime: '选择时重置时间',
      },
    },
  },
  'en-US': {
    title: 'DatePicker',
    settings: {
      'x-component-props': {
        format: {
          title: 'Format',
          placeholder: 'YYYY-MM-DD',
        },
        showTime: 'Show Time',
        resetTime: 'Reset On Select',
      },
    },
  },
}

export const DateRangePicker = createLocales(DatePicker, {
  'zh-CN': {
    title: '日期范围',
    settings: {
      'x-component-props': {
        type: {
          title: '类型',
          dataSource: ['日', '月', '年'],
        },
      },
    },
  },
  'en-US': {
    title: 'DateRange',
    settings: {
      'x-component-props': {
        type: {
          title: 'Type',
          dataSource: ['Date', 'Month', 'Year'],
        },
      },
    },
  },
})
