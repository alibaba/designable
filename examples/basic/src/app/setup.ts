import { createBehavior } from '@designable/core'
import { GlobalRegistry, createDesigner } from '@designable/core'


import { Card } from './components/Card'
import { Input } from './components/Input'
import { Field } from './components/Field'

export const components = {Field, Input, Card}
export const resources = [Input, Card]

const RootBehavior = createBehavior({
  name: 'Root',
  selector: 'Root',
  designerProps: {
    droppable: true,
  },
  designerLocales: {
    'zh-CN': {
      title: '根组件',
    },
    'en-US': {
      title: 'Root',
    },
    'ko-KR': {
      title: '루트',
    },
  },
})
const behaviors = [
  RootBehavior,
  Card,
  Input,
]
const locales = {
  // 'zh-CN': {
  //   sources: {
  //     Inputs: '输入控件',
  //     Displays: '展示控件',
  //     Feedbacks: '反馈控件',
  //   },
  // },
  'en-US': {
    sources: {
      Inputs: 'Inputs',
      Displays: 'Displays',
      Feedbacks: 'Feedbacks',
    },
  },
  // 'ko-KR': {
  //   sources: {
  //     Inputs: '입력',
  //     Displays: '디스플레이',
  //     Feedbacks: '피드백',
  //   },
  // },
}
console.log('behaviors', behaviors)
GlobalRegistry.setDesignerBehaviors(behaviors)


GlobalRegistry.registerDesignerLocales(locales)
const engine = createDesigner()
export { engine, behaviors }
