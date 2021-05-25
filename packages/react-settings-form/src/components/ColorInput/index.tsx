import React, { useRef } from 'react'
import { InputProps } from 'antd/lib/input'
import { Input, Popover } from 'antd'
import { usePrefix } from '@designable/react'
import { SketchPicker } from 'react-color'
import './styles.less'

export const ColorInput: React.FC<InputProps> = (props) => {
  const container = useRef<HTMLDivElement>()
  const prefix = usePrefix('color-input')
  const color = props.value as string
  return (
    <div ref={container} className={prefix}>
      <Input
        {...props}
        placeholder="#EFEFEF"
        prefix={
          <Popover
            autoAdjustOverflow
            trigger="click"
            overlayInnerStyle={{ padding: 0 }}
            getPopupContainer={() => container.current}
            content={
              <SketchPicker
                color={color}
                onChange={({ hex }) => props.onChange?.(hex)}
              />
            }
          >
            <div
              className={prefix + '-color-tips'}
              style={{
                backgroundColor: color,
              }}
            ></div>
          </Popover>
        }
      />
    </div>
  )
}
