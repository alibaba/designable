import React, { useMemo } from 'react'
import { createBehavior, createResource } from '@designable/core'
import { createForm } from '@formily/core'
import { observer } from '@formily/react'
import { Form as FormilyForm } from '@formily/antd-v5'
import { usePrefix, useDesigner } from '@designable/react'
import { AllSchemas } from '../../schemas/index.js'
import { AllLocales } from '../../locales/index.js'


import './styles.less'


export const Form: React.FC<React.ComponentProps<typeof FormilyForm>> = observer(
  (props) => {
    const prefix = usePrefix('designable-form')
    const engine = useDesigner()
    if ( engine != undefined) {
      console.log("Get engine");
      const tree = engine.getCurrentTree()
      console.log('Tree structure:', tree.serialize())

    }
    const form = useMemo(
      () =>
        createForm({
          designable: true,
        }),
      []
    )
    console.log('formily.antd.Form:  props', props)
    return (
      <FormilyForm
        {...props}
        style={{ ...props.style }}
        className={prefix}
        form={form}
      >
        {props.children}
      </FormilyForm>
    )
  }
)

;(Form as any).Behavior = createBehavior({
  name: 'Form',
  selector: (node) => node.componentName === 'Form',
  designerProps(node) {
    return {
      draggable: !node.isRoot,
      cloneable: !node.isRoot,
      deletable: !node.isRoot,
      droppable: true,
      propsSchema: {
        type: 'object',
        properties: {
          ...(AllSchemas.FormLayout.properties as any),
          style: AllSchemas.CSSStyle,
        },
      },
    }
  },
  designerLocales: AllLocales.Form,
})

;(Form as any).Resource = createResource({
  title: { 'zh-CN': '表单', 'en-US': 'Form' },
  icon: 'FormLayoutSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'object',
        'x-component': 'Form',
      },
    },
  ],
})
