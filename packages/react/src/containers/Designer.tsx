import React, { useEffect, useRef } from 'react'
import { Engine, GlobalRegistry } from '@designable/core'
import { DesignerEngineContext } from '../context'
import { IDesignerProps } from '../types'
import { GhostWidget } from '../widgets'
import { useDesigner } from '../hooks'
import { Layout } from './Layout'
import * as icons from '../icons'

GlobalRegistry.registerDesignerIcons(icons)

export const Designer: React.FC<IDesignerProps> = (props) => {
  const engine = useDesigner()
  const ref = useRef<Engine>()
  useEffect(() => {
    if (props.engine) {
      if (props.engine && ref.current) {
        if (props.engine !== ref.current) {
          ref.current.unmount()
        }
      }
      props.engine.mount()
      ref.current = props.engine
    }
    return () => {
      if (props.engine) {
        props.engine.unmount()
      }
    }
  }, [props.engine])

  if (engine)
    throw new Error(
      'There can only be one Designable Engine Context in the React Tree'
    )

  return (
    <Layout {...props}>
      <DesignerEngineContext.Provider value={props.engine}>
        {props.children}
        <GhostWidget />
      </DesignerEngineContext.Provider>
    </Layout>
  )
}

Designer.defaultProps = {
  prefixCls: 'dn-',
  theme: 'light',
}
