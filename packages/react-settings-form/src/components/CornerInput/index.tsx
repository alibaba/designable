import React, { useState, useEffect } from 'react'
import { usePrefix } from '@designable/react'
import cls from 'classnames'
import './styles.less'

export interface ICornerInputProps {
  className?: string
  style?: React.CSSProperties
  value?: string
  onChange?: (value: string) => void
}

export const CornerInput: React.FC<ICornerInputProps> = (props) => {
  const prefix = usePrefix('corner-input')
  const [current, setCurrent] = useState(props.value)
  useEffect(() => {
    if (!props.value) {
      setCurrent('all')
    }
  }, [props.value])
  const createCellProps = (type: string) => ({
    className: cls(prefix + '-cell', { active: current === type }),
    onClick() {
      setCurrent(type)
      props.onChange?.(type)
    },
  })
  return (
    <div className={cls(prefix, props.className)} style={props.style}>
      <div className={prefix + '-column'}>
        <div {...createCellProps('topLeft')}>┏</div>
        <div {...createCellProps('bottomLeft')}>┗</div>
      </div>
      <div className={prefix + '-column'}>
        <div {...createCellProps('all')}>╋</div>
      </div>
      <div className={prefix + '-column'}>
        <div {...createCellProps('topRight')}>┓</div>
        <div {...createCellProps('bottomRight')}>┛</div>
      </div>
    </div>
  )
}
