import { createLocales } from '@designable/core'

export const DatePicker = {
  'zh-CN': {
    title: '日期选择',
    settings: {
      'x-component-props': {
        disabledDate: {
          title: '不可选日期',
          tooltip: '格式 (currentDate: moment) => boolean',
        },
        disabledTime: {
          title: '不可选时间',
          tooltip: '格式 (currentDate: moment) => boolean',
        },
        inputReadOnly: '输入框只读',
        format: '格式',
        picker: {
          title: '选择器类型',
          dataSource: ['时间', '日期', '月份', '年', '季度', '财年'],
        },
        showNow: '显示此刻',
        showTime: '时间选择',
        showToday: '显示今天',
      },
    },
  },
  'en-US': {
    title: 'DatePicker',
    settings: {
      'x-component-props': {
        disabledDate: {
          title: 'Disabled Date',
          tooltip: 'Format (currentDate: moment) => boolean',
        },
        disabledTime: {
          title: 'Disabled Time',
          tooltip: 'Format (currentDate: moment) => boolean',
        },
        inputReadOnly: 'Input ReadOnly',
        format: 'Format',
        picker: {
          title: 'Picker Type',
          dataSource: ['Time', 'Date', 'Month', 'Year', 'Quarter', 'Decade'],
        },
        showNow: 'Show Now',
        showTime: 'Show Time',
        showToday: 'Show Today',
      },
    },
  },
  'ko-KR': {
    title: '날짜 선택 상자',
    settings: {
      'x-component-props': {
        disabledDate: {
          title: '비활성화 된 날짜',
          tooltip: '형식 (currentDate: moment) => boolean',
        },
        disabledTime: {
          title: '비활성화 된 시간',
          tooltip: '형식 (currentDate: moment) => boolean',
        },
        inputReadOnly: 'ReadOnly',
        format: '포맷',
        picker: {
          title: '타입',
          dataSource: ['시간', '날짜', '월', '년', '분기', '십년 단위'],
        },
        showNow: '현재 시각 보기',
        showTime: '시간 보기',
        showToday: '오늘 보기',
      },
    },
  },
}

export const DateRangePicker = createLocales(DatePicker, {
  'zh-CN': {
    title: '日期范围',
  },
  'en-US': {
    title: 'DateRange',
  },
  'ko-KR': {
    title: '날짜범위 선택 상자',
  },
})
