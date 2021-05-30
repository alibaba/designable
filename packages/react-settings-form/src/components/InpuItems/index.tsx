import React, { useContext } from 'react'
import { usePrefix, IconWidget } from '@designable/react'
import cls from 'classnames'
import './styles.less'

export interface IInputItemsContext {
  width?: string | number
}

export interface IInputItemsProps {
  className?: string
  style?: React.CSSProperties
  width?: string | number
}

export interface IInputItemProps {
  className?: string
  style?: React.CSSProperties
  icon?: React.ReactNode
  width?: string | number
}

const InputItemsContext = React.createContext<IInputItemsContext>(null)

export const InputItems: React.FC<IInputItemsProps> & {
  Item: React.FC<IInputItemProps>
} = (props) => {
  const prefix = usePrefix('input-items')
  return (
    <InputItemsContext.Provider value={props}>
      <div className={cls(prefix, props.className)} style={props.style}>
        {props.children}
      </div>
    </InputItemsContext.Provider>
  )
}

InputItems.defaultProps = {
  width: '100%',
}

InputItems.Item = (props) => {
  const prefix = usePrefix('input-items-item')
  const ctx = useContext(InputItemsContext)
  return (
    <div
      className={cls(prefix, props.className)}
      style={{ width: props.width || ctx.width, ...props.style }}
    >
      {props.icon && (
        <div className={prefix + '-icon'}>
          <IconWidget infer={props.icon} size={16} />
        </div>
      )}
      <div className={prefix + '-controller'}>{props.children}</div>
    </div>
  )
}
