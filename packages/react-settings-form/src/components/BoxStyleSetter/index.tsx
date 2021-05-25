import React from 'react'
import { FormItem } from '@formily/antd'
import { useField } from '@formily/react'
import { FoldItem } from '../FoldItem'
import { SizeInput } from '../SizeInput'

export interface IMarginStyleSetterProps {
  value: string
  onChange: (value: string) => void
}

const PositionMap = {
  top: 1,
  right: 2,
  bottom: 3,
  left: 4,
  all: 1,
}

const BoxRex =
  /([\d\.]+[^\d\s\.+-]+)(?:\s+([\d\.]+[^\d\s\.+-]+)(?:\s+([\d\.]+[^\d\s\.+-]+)(?:\s+([\d\.]+[^\d\s\.+-]+))?)?)?/

export const BoxStyleSetter: React.FC<IMarginStyleSetterProps> = (props) => {
  const field = useField()
  const createPositionHandler = (
    position: 'top' | 'right' | 'left' | 'bottom' | 'all',
    props: IMarginStyleSetterProps
  ) => {
    const matched = String(props.value).match(BoxRex)
    let value = undefined
    if (matched) {
      value = matched[PositionMap[position]]
    }
    return {
      ...props,
      value,
      onChange(value: string) {
        if (position === 'all') {
          props.onChange(
            `${value || '0px'} ${value || '0px'} ${value || '0px'} ${
              value || '0px'
            }`
          )
        } else {
          matched[PositionMap[position]] = value
          props.onChange(
            `${matched[1] || '0px'} ${matched[2] || '0px'} ${
              matched[3] || '0px'
            } ${matched[4] || '0px'}`
          )
        }
      },
    }
  }

  return (
    <FoldItem label={field.title}>
      <FoldItem.Base>
        <SizeInput
          {...createPositionHandler('all', props)}
          exclude={['auto']}
        />
      </FoldItem.Base>
      <FoldItem.Extra>
        <FormItem.BaseItem label="Top">
          <SizeInput
            {...createPositionHandler('top', props)}
            exclude={['auto']}
          />
        </FormItem.BaseItem>
        <FormItem.BaseItem label="Right">
          <SizeInput
            {...createPositionHandler('right', props)}
            exclude={['auto']}
          />
        </FormItem.BaseItem>
        <FormItem.BaseItem label="Bottom">
          <SizeInput
            {...createPositionHandler('bottom', props)}
            exclude={['auto']}
          />
        </FormItem.BaseItem>
        <FormItem.BaseItem label="Left">
          <SizeInput
            {...createPositionHandler('left', props)}
            exclude={['auto']}
          />
        </FormItem.BaseItem>
      </FoldItem.Extra>
    </FoldItem>
  )
}
