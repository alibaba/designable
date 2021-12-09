import { createContext } from 'react'
import { TreeNode, Designer } from '@designable/core'
import {
  IDesignerLayoutContext,
  IWorkspaceContext,
  IDesignerComponents,
} from './types'

export const DesignerComponentsContext = createContext<IDesignerComponents>({})

export const DesignerLayoutContext = createContext<IDesignerLayoutContext>(null)

export const DesignerDesignerContext = createContext<Designer>(null)

export const TreeNodeContext = createContext<TreeNode>(null)

export const WorkspaceContext = createContext<IWorkspaceContext>(null)
