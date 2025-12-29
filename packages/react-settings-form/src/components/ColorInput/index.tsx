import React, { useRef } from 'react'
import { Input, Popover } from 'antd'
import { usePrefix } from '@designable/react'
// @ts-ignore - react-color doesn't have type definitions
import { SketchPicker, ColorResult } from 'react-color'

export interface IColorInputProps {
  value?: string
  onChange?: (color: string) => void
}

export const ColorInput: React.FC<IColorInputProps> = (props) => {
  const container = useRef<HTMLDivElement>(null)
  const prefix = usePrefix('color-input')
  const color = props.value as string
  return (
    <div ref={container} className={prefix}>
      <Input
        value={props.value}
        onChange={(e) => {
          props.onChange?.(e.target.value)
        }}
        placeholder="Color"
        prefix={
          <Popover
            autoAdjustOverflow
            trigger="click"
            overlayInnerStyle={{ padding: 0 }}
            getPopupContainer={() => container.current!}
            content={
              <SketchPicker
                color={color}
                onChange={(color: ColorResult) => {
                  const { rgb } = color
                  props.onChange?.(`rgba(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`)
                }}
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
