import React, { useContext } from 'react'
import { usePrefix, IconWidget } from '@sulesky/next-react'
import cls from 'classnames'
import './styles.less'

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

const InputItemsContext = React.createContext<IInputItemsContext>(null)

export const InputItems: React.FC<IInputItemsProps> & {
  Item: React.FC<IInputItemProps>
} = ({ className, style, width = '100%', vertical, children }) => {
  const prefix = usePrefix('input-items')
  const contextValue = { width, vertical }
  return (
    <InputItemsContext.Provider value={contextValue}>
      <div className={cls(prefix, className)} style={style}>
        {children}
      </div>
    </InputItemsContext.Provider>
  )
}

InputItems.Item = ({
  className,
  style,
  icon,
  width,
  vertical,
  title,
  children,
}) => {
  const prefix = usePrefix('input-items-item')
  const ctx = useContext(InputItemsContext)
  return (
    <div
      className={cls(prefix, className, {
        vertical: vertical || ctx.vertical,
      })}
      style={{ width: width || ctx.width, ...style }}
    >
      {icon && (
        <div className={prefix + '-icon'}>
          <IconWidget infer={icon} size={16} />
        </div>
      )}
      {title && <div className={prefix + '-title'}>{title}</div>}
      <div className={prefix + '-controller'}>{children}</div>
    </div>
  )
}
