import React from 'react'
import { Engine, IResource, IBehavior } from '@designable/core'
export interface IDesignerProps {
  engine: Engine
  prefixCls?: string
  theme?: 'dark' | 'light' | (string & {})
}

export interface IDesignerComponents {
  [key: string]: DnFC<any>
}

export interface IDesignerContext {
  engine: Engine
  theme?: 'dark' | 'light' | (string & {})
  prefixCls: string
}

export interface IWorkspaceContext {
  id: string
  title?: string
  description?: string
}

export type DnFC<P = {}> = React.FC<P> & {
  Resource?: IResource[]
  Behavior?: IBehavior[]
}
