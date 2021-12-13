import React from 'react'
import { Designer, IResource, IFeature } from '@designable/core'

export interface IDesignerLayoutProps {
  prefixCls?: string
  theme?: 'dark' | 'light' | (string & {})
  variables?: Record<string, string>
  position?: 'fixed' | 'absolute' | 'relative'
}
export interface IDesignerProps extends IDesignerLayoutProps {
  designer: Designer
}

export interface IDesignerComponents {
  [key: string]: DnFC<any>
}

export interface IDesignerLayoutContext {
  theme?: 'dark' | 'light' | (string & {})
  prefixCls: string
  position: 'fixed' | 'absolute' | 'relative'
}

export interface IWorkspaceContext {
  id: string
  title?: string
  description?: string
}

export type DnFC<P = {}> = React.FC<P> & {
  Resource?: IResource[]
  Feature?: IFeature[]
}

export type DnComponent<P = {}> = React.ComponentType<P> & {
  Resource?: IResource[]
  Feature?: IFeature[]
}
