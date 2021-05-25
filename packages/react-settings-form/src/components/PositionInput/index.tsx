import React, { useState, useEffect } from 'react'
import { usePrefix } from '@designable/react'
import cls from 'classnames'
import './styles.less'

export interface IPositionInputProps {
  className?: string
  style?: React.CSSProperties
  value?: string
  onChange?: (value: string) => void
}

export const PositionInput: React.FC<IPositionInputProps> = (props) => {
  const prefix = usePrefix('position-input')
  const [current, setCurrent] = useState(props.value)
  useEffect(() => {
    if (!props.value) {
      setCurrent('center')
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
      <div className={prefix + '-row'}>
        <div {...createCellProps('top')}>┳</div>
      </div>
      <div className={prefix + '-row'}>
        <div {...createCellProps('left')}>┣</div>
        <div {...createCellProps('center')}>╋</div>
        <div {...createCellProps('right')}>┫</div>
      </div>
      <div className={prefix + '-row'}>
        <div {...createCellProps('bottom')}>┻</div>
      </div>
    </div>
  )
}
