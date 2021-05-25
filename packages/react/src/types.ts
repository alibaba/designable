import { Engine } from '@designable/core'
export interface IDesignerProps {
  engine: Engine
  prefixCls?: string
  theme?: 'dark' | 'light'
}

export interface IDesignerContext {
  engine: Engine
  theme?: 'dark' | 'light'
  prefixCls: string
}

export interface IWorkspaceContext {
  id: string
  title?: string
  description?: string
}
