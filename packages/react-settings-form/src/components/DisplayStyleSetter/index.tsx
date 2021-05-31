import React from 'react'
import { useField, Field } from '@formily/react'
import { FormItem } from '@formily/antd'
import { Radio } from 'antd'
import { usePrefix, IconWidget } from '@designable/react'
import { FlexStyleSetter } from '../FlexStyleSetter'
import cls from 'classnames'
import './styles.less'
export interface IDisplayStyleSetterProps {
  className?: string
  style?: React.CSSProperties
  value?: string
  onChange?: (value: string) => void
}

export const DisplayStyleSetter: React.FC<IDisplayStyleSetterProps> = (
  props
) => {
  const field = useField<Formily.Core.Models.Field>()
  const prefix = usePrefix('display-style-setter')
  return (
    <>
      <FormItem.BaseItem
        label={field.title}
        className={cls(prefix, props.className)}
        style={props.style}
      >
        <Radio.Group
          className={prefix + '-radio'}
          options={[
            {
              label: <IconWidget infer="DisplayBlock" />,
              value: 'block',
            },
            {
              label: <IconWidget infer="DisplayInlineBlock" />,
              value: 'inline-block',
            },
            {
              label: <IconWidget infer="DisplayInline" />,
              value: 'inline',
            },
            {
              label: <IconWidget infer="DisplayFlex" />,
              value: 'flex',
            },
          ]}
          value={props.value}
          onChange={(e) => {
            props.onChange?.(e.target.value)
          }}
          optionType="button"
        />
      </FormItem.BaseItem>
      <Field
        name="flex"
        basePath={field.address.parent()}
        reactions={(flexField) => {
          flexField.visible = field.value === 'flex'
        }}
        component={[FlexStyleSetter]}
      />
    </>
  )
}
