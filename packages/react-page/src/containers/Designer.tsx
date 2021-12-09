import React, { useEffect, useRef } from 'react'
import { Designer as DesignerType, GlobalRegistry } from '@designable/core'
import { DesignerDesignerContext } from '../context'
import { IDesignerProps } from '../types'
import { GhostWidget } from '../widgets'
import { useDesigner } from '../hooks'
import { Layout } from './Layout'
import * as icons from '../icons'

GlobalRegistry.registerDesignerIcons(icons)

export const Designer: React.FC<IDesignerProps> = (props) => {
  const designer = useDesigner()
  const ref = useRef<DesignerType>()
  useEffect(() => {
    if (props.designer) {
      if (props.designer && ref.current) {
        if (props.designer !== ref.current) {
          ref.current.unmount()
        }
      }
      props.designer.mount()
      ref.current = props.designer
    }
    return () => {
      if (props.designer) {
        props.designer.unmount()
      }
    }
  }, [props.designer])

  if (designer)
    throw new Error(
      'There can only be one Designable Designer Context in the React Tree'
    )

  return (
    <Layout {...props}>
      <DesignerDesignerContext.Provider value={props.designer}>
        {props.children}
        <GhostWidget />
      </DesignerDesignerContext.Provider>
    </Layout>
  )
}

Designer.defaultProps = {
  prefixCls: 'dn-',
  theme: 'light',
}
