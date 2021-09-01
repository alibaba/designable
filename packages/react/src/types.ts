import { Engine } from '@designable/core'
export interface IDesignerProps {
  engine: Engine
  prefixCls?: string
  theme?: 'dark' | 'light' | (string & {})
}

export interface IDesignerComponents {
  [key: string]: React.JSXElementConstructor<any>
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
