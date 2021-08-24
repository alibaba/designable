import React, { createContext, useContext } from 'react'
import { GlobalRegistry } from '@designable/core'
import { isStr, isFn, isPlainObj } from '@designable/shared'
import { observer } from '@formily/reactive-react'
import { Tooltip } from 'antd'
import { usePrefix, useRegistry, useTheme } from '../../hooks'
import cls from 'classnames'
import * as icons from '../../icons'
import './styles.less'

GlobalRegistry.registerDesignerIcons(icons)

const IconContext = createContext<IconProviderProps>(null)

export interface IconProviderProps {
  tooltip?: boolean
}
export interface IIconWidgetProps extends React.HTMLAttributes<HTMLElement> {
  tooltip?: React.ReactNode
  infer: React.ReactNode
  size?: number | string
}

export const IconWidget: React.FC<IIconWidgetProps> & {
  Provider?: React.FC<IconProviderProps>
} = observer((props: React.PropsWithChildren<IIconWidgetProps>) => {
  const theme = useTheme()
  const context = useContext(IconContext)
  const registry = useRegistry()
  const prefix = usePrefix('icon')
  const size = props.size || '1em'
  const height = props.style?.height || size
  const width = props.style?.width || size
  const takeIcon = (infer: React.ReactNode) => {
    if (isStr(infer)) {
      const finded = registry.getDesignerIcon(infer)
      if (finded) {
        return takeIcon(finded)
      }
      return <img src={infer} height={height} width={width} />
    } else if (isFn(infer)) {
      return React.createElement(infer, {
        height,
        width,
        fill: 'currentColor',
      })
    } else if (React.isValidElement(infer)) {
      if (infer.type === 'svg') {
        return React.cloneElement(infer, {
          height,
          width,
          fill: 'currentColor',
          viewBox: infer.props.viewBox || '0 0 1024 1024',
          focusable: 'false',
          'aria-hidden': 'true',
        })
      } else if (infer.type === 'path' || infer.type === 'g') {
        return (
          <svg
            viewBox="0 0 1024 1024"
            height={height}
            width={width}
            fill="currentColor"
            focusable="false"
            aria-hidden="true"
          >
            {infer}
          </svg>
        )
      }
      return infer
    } else if (isPlainObj(infer)) {
      if (infer[theme]) {
        return takeIcon(infer[theme])
      }
    }
  }
  const renderTooltips = (children: React.ReactElement): React.ReactElement => {
    if (!context) return children
    if (!isStr(props.infer) && context.tooltip) return children as any
    const tooltip =
      props.tooltip || registry.getDesignerMessage(`icons.${props.infer}`)
    if (tooltip) {
      return <Tooltip title={tooltip}>{children}</Tooltip>
    }
    return children
  }
  return renderTooltips(
    <span
      {...props}
      className={cls(prefix, props.className)}
      style={{
        ...props.style,
        cursor: props.onClick ? 'pointer' : props.style?.cursor,
      }}
    >
      {takeIcon(props.infer)}
    </span>
  )
})

IconWidget.Provider = (props) => {
  return (
    <IconContext.Provider value={props}>{props.children}</IconContext.Provider>
  )
}
