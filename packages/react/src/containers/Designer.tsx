import React, { useEffect, useRef } from 'react'
import { Engine, GlobalRegistry } from '@sulesky/core'
import { DesignerEngineContext } from '../context'
import { IDesignerProps } from '../types'
import { GhostWidget } from '../widgets'
import { useDesigner } from '../hooks'
import { Layout } from './Layout'
import * as icons from '../icons'

GlobalRegistry.registerDesignerIcons(icons)

export const Designer: React.FC<IDesignerProps> = ({
  prefixCls = 'dn-',
  theme = 'light',
  children,
  engine: propsEngine,
  ...restProps
}) => {
  const engine = useDesigner(undefined)
  const ref = useRef<Engine>(null)
  useEffect(() => {
    if (propsEngine) {
      if (propsEngine && ref.current) {
        if (propsEngine !== ref.current) {
          ref.current.unmount()
        }
      }
      propsEngine.mount()
      ref.current = propsEngine
    }
    return () => {
      if (propsEngine) {
        propsEngine.unmount()
      }
    }
  }, [propsEngine])

  if (engine)
    throw new Error(
      'There can only be one Designable Engine Context in the React Tree',
    )

  return (
    <Layout prefixCls={prefixCls} theme={theme} {...restProps}>
      <DesignerEngineContext.Provider value={propsEngine}>
        {children}
        <GhostWidget />
      </DesignerEngineContext.Provider>
    </Layout>
  )
}
