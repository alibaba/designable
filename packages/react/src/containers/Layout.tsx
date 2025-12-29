import React, { useContext, Fragment, useRef, useLayoutEffect } from 'react'
import { each } from '@designable/shared'
import { DesignerLayoutContext } from '../context'
import { IDesignerLayoutProps } from '../types'
import cls from 'classnames'

export const Layout: React.FC<IDesignerLayoutProps> = ({ theme = 'light', prefixCls = 'dn-', position = 'fixed', variables, children }) => {
  const layout = useContext(DesignerLayoutContext)
  const ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (variables && ref.current) {
      each(variables, (value, key) => {
        ref.current!.style.setProperty(`--${key}`, value)
      })
    }
  }, [])

  if (layout) {
    return <Fragment>{children}</Fragment>
  }
  return (
    <div
      ref={ref}
      className={cls({
        [`${prefixCls}app`]: true,
        [`${prefixCls}${theme}`]: theme,
      })}
    >
      <DesignerLayoutContext.Provider
        value={{
          theme: theme,
          prefixCls: prefixCls,
          position: position,
        }}
      >
        {children}
      </DesignerLayoutContext.Provider>
    </div>
  )
}
