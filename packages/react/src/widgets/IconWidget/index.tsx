import React from 'react'
import { registry } from '@designable/core'
import { isStr, isFn, isPlainObj } from '@designable/shared'
import { usePrefix, useRegistry, useTheme } from '../../hooks'
import cls from 'classnames'
import * as icons from '../../icons'
import './styles.less'

if (window['__DESIGNER_REGISTRY__']) {
  window['__DESIGNER_REGISTRY__'].registerDesignerIcons(icons)
} else {
  registry.registerDesignerIcons(icons)
}

export interface IIconWidgetProps extends React.HTMLAttributes<HTMLElement> {
  infer: React.ReactNode
  size?: number | string
}

export const IconWidget: React.FC<IIconWidgetProps> = (props) => {
  const theme = useTheme()
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
      } else if (infer.type === 'path') {
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
  return (
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
}
