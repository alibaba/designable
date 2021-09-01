import { createLocales } from '@designable/core'
import { Field } from './Field'

export const Slider = createLocales(Field, {
  'zh-CN': {
    title: '滑动条',
    settings: {
      'x-component-props': {
        sliderDots: '刻度固定',
        sliderRange: '双滑块',
        sliderReverse: '反向坐标系',
        vertical: '垂直布局',
        tooltipPlacement: {
          title: '提示位置',
          tooltip: '设置 提示 展示位置。参考 Tooltip',
        },
        tooltipVisible: {
          title: '提示显示',
          tooltip:
            '开启时，提示 将会始终显示；否则始终不显示，哪怕在拖拽及移入时',
        },
        max: '最大值',
        min: '最小值',
        step: '步长',
        marks: '刻度标签',
      },
    },
  },
  'en-US': {},
})
