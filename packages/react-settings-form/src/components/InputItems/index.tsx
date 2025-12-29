import React, { useContext } from 'react'
import { usePrefix, IconWidget } from '@designable/react'
import cls from 'classnames'

export interface IInputItemsContext {
  width?: string | number
  vertical?: boolean
}

export interface IInputItemsProps {
  className?: string
  style?: React.CSSProperties
  width?: string | number
  vertical?: boolean
  children?: React.ReactNode
}

export interface IInputItemProps {
  className?: string
  style?: React.CSSProperties
  icon?: React.ReactNode
  width?: string | number
  vertical?: boolean
  title?: React.ReactNode
  children?: React.ReactNode
}

const InputItemsContext = React.createContext<IInputItemsContext>(null as any)

export const InputItems: React.FC<IInputItemsProps> & {
  Item: React.FC<IInputItemProps>
} = ({ width = '100%', vertical, className, style, children }) => {
  const prefix = usePrefix('input-items')
  return (
    <InputItemsContext.Provider value={{ width, vertical }}>
      <div className={cls(prefix, className)} style={style}>
        {children}
      </div>
    </InputItemsContext.Provider>
  )
}

InputItems.Item = (props) => {
  const prefix = usePrefix('input-items-item')
  const ctx = useContext(InputItemsContext)
  return (
    <div
      className={cls(prefix, props.className, {
        vertical: props.vertical || ctx.vertical,
      })}
      style={{ width: props.width || ctx.width, ...props.style }}
    >
      {props.icon && (
        <div className={prefix + '-icon'}>
          <IconWidget infer={props.icon} size={16} />
        </div>
      )}
      {props.title && <div className={prefix + '-title'}>{props.title}</div>}
      <div className={prefix + '-controller'}>{props.children}</div>
    </div>
  )
}
