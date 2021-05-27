import React from 'react'
import { IconWidget } from '@designable/react'
import { BoxStyleSetter } from '../BoxStyleSetter'
export interface IBorderRadiusStyleSetterProps {
  value?: string
  onChange?: (value: string) => void
}

export const BorderRadiusStyleSetter: React.FC<IBorderRadiusStyleSetterProps> =
  (props) => {
    return (
      <BoxStyleSetter
        {...props}
        labels={[
          <IconWidget infer="TopLeft" size={16} key="1" />,
          <IconWidget infer="TopRight" size={16} key="2" />,
          <IconWidget infer="BottomRight" size={16} key="3" />,
          <IconWidget infer="BottomLeft" size={16} key="4" />,
        ]}
      />
    )
  }
