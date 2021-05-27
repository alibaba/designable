import React from 'react'
import { useField, Field } from '@formily/react'
import { usePrefix, IconWidget } from '@designable/react'
import { Select, Input } from '@formily/antd'
import { FoldItem } from '../FoldItem'
import { ColorInput } from '../ColorInput'
import { BackgroundSizeInput } from '../SizeInput'
import { BackgroundImageInput } from '../ImageInput'
import cls from 'classnames'
import './styles.less'

export interface IBackgroundStyleSetterProps {
  className?: string
  style?: React.CSSProperties
}

export const BackgroundStyleSetter: React.FC<IBackgroundStyleSetterProps> = (
  props
) => {
  const field = useField()
  const prefix = usePrefix('background-style-setter')
  return (
    <FoldItem className={cls(prefix, props.className)} label={field.title}>
      <FoldItem.Base>
        <Field
          name="backgroundColor"
          basePath={field.address.parent()}
          component={[ColorInput]}
        />
      </FoldItem.Base>
      <FoldItem.Extra>
        <div className={prefix + '-inputs'}>
          <div className={prefix + '-input-item'}>
            <IconWidget
              infer="Image"
              className={prefix + '-input-icon'}
              size={16}
            />
            <Field
              name="backgroundImage"
              basePath={field.address.parent()}
              component={[BackgroundImageInput]}
            />
          </div>
          <div className={prefix + '-input-item'}>
            <IconWidget
              infer="ImageSize"
              className={prefix + '-input-icon'}
              size={16}
            />
            <Field
              name="backgroundSize"
              basePath={field.address.parent()}
              component={[BackgroundSizeInput]}
            />
          </div>
          <div className={prefix + '-input-item'}>
            <IconWidget
              infer="Repeat"
              className={prefix + '-input-icon'}
              size={16}
            />
            <Field
              name="backgroundRepeat"
              basePath={field.address.parent()}
              component={[
                Select,
                { style: { width: '100%' }, placeholder: 'Please Select' },
              ]}
              dataSource={[
                {
                  label: 'No Repeat',
                  value: 'no-repeat',
                },
                {
                  label: 'Repeat',
                  value: 'repeat',
                },
                {
                  label: 'Repeat X',
                  value: 'repeat-x',
                },
                {
                  label: 'Repeat Y',
                  value: 'repeat-y',
                },
                {
                  label: 'Space',
                  value: 'space',
                },
                {
                  label: 'Round',
                  value: 'round',
                },
              ]}
            />
          </div>
          <div className={prefix + '-input-item'}>
            <IconWidget
              infer="Position"
              className={prefix + '-input-icon'}
              size={16}
            />
            <Field
              name="backgroundPosition"
              basePath={field.address.parent()}
              component={[Input, { placeholder: 'center center' }]}
            />
          </div>
        </div>
      </FoldItem.Extra>
    </FoldItem>
  )
}
