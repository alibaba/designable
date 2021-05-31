import React from 'react'
import { Field, useField } from '@formily/react'
import { Radio } from '@formily/antd'
import { usePrefix, IconWidget } from '@designable/react'
import { InputItems } from '../InpuItems'
import cls from 'classnames'
import './styles.less'
export interface IFlexStyleSetterProps {
  className?: string
  style?: React.CSSProperties
}

export const FlexStyleSetter: React.FC<IFlexStyleSetterProps> = (props) => {
  const field = useField()
  const prefix = usePrefix('flex-style-setter')
  return (
    <div className={cls(prefix, props.className)} style={props.style}>
      <InputItems vertical>
        <Field
          name="flex-direction"
          basePath={field.address.parent()}
          dataSource={[
            {
              label: <IconWidget infer="FlexDirectionRow" />,
              value: 'row',
            },
            {
              label: <IconWidget infer="FlexDirectionColumn" />,
              value: 'column',
            },
          ]}
          reactions={(field) => {
            field.decorator[1].title = `Flex Direction : ${field.value || ''}`
          }}
          decorator={[InputItems.Item]}
          component={[Radio.Group, { optionType: 'button' }]}
        />
        <Field
          name="flex-wrap"
          basePath={field.address.parent()}
          dataSource={[
            {
              label: <IconWidget infer="FlexNoWrap" />,
              value: 'nowrap',
            },
            {
              label: <IconWidget infer="FlexWrap" />,
              value: 'wrap',
            },
          ]}
          reactions={(field) => {
            field.decorator[1].title = `Flex Wrap : ${field.value || ''}`
          }}
          decorator={[InputItems.Item]}
          component={[Radio.Group, { optionType: 'button' }]}
        />
        <Field
          name="align-content"
          basePath={field.address.parent()}
          dataSource={[
            {
              label: <IconWidget infer="FlexAlignContentCenter" />,
              value: 'center',
            },
            {
              label: <IconWidget infer="FlexAlignContentStart" />,
              value: 'flex-start',
            },
            {
              label: <IconWidget infer="FlexAlignContentEnd" />,
              value: 'flex-end',
            },
            {
              label: <IconWidget infer="FlexAlignContentSpaceAround" />,
              value: 'space-around',
            },
            {
              label: <IconWidget infer="FlexAlignContentSpaceBetween" />,
              value: 'space-between',
            },
            {
              label: <IconWidget infer="FlexAlignContentStretch" />,
              value: 'stretch',
            },
          ]}
          reactions={(field) => {
            field.decorator[1].title = `Align Content : ${field.value || ''}`
          }}
          decorator={[InputItems.Item]}
          component={[Radio.Group, { optionType: 'button' }]}
        />
        <Field
          name="justify-content"
          basePath={field.address.parent()}
          dataSource={[
            {
              label: <IconWidget infer="FlexJustifyCenter" />,
              value: 'center',
            },
            {
              label: <IconWidget infer="FlexJustifyStart" />,
              value: 'flex-start',
            },
            {
              label: <IconWidget infer="FlexJustifyEnd" />,
              value: 'flex-end',
            },
            {
              label: <IconWidget infer="FlexJustifySpaceAround" />,
              value: 'space-around',
            },
            {
              label: <IconWidget infer="FlexJustifySpaceBetween" />,
              value: 'space-between',
            },
            {
              label: <IconWidget infer="FlexJustifySpaceEvenly" />,
              value: 'space-evenly',
            },
          ]}
          reactions={(field) => {
            field.decorator[1].title = `Justify Content : ${field.value || ''}`
          }}
          decorator={[InputItems.Item]}
          component={[Radio.Group, { optionType: 'button' }]}
        />
        <Field
          name="align-items"
          basePath={field.address.parent()}
          dataSource={[
            {
              label: <IconWidget infer="FlexAlignItemsCenter" />,
              value: 'center',
            },
            {
              label: <IconWidget infer="FlexAlignItemsStart" />,
              value: 'flex-start',
            },
            {
              label: <IconWidget infer="FlexAlignItemsEnd" />,
              value: 'flex-end',
            },
            {
              label: <IconWidget infer="FlexAlignItemsStretch" />,
              value: 'stretch',
            },
            {
              label: <IconWidget infer="FlexAlignItemsBaseline" />,
              value: 'baseline',
            },
          ]}
          reactions={(field) => {
            field.decorator[1].title = `Align Items : ${field.value || ''}`
          }}
          decorator={[InputItems.Item]}
          component={[Radio.Group, { optionType: 'button' }]}
        />
      </InputItems>
    </div>
  )
}
