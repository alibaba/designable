import { createContext } from 'react'
import { TreeNode } from '@designable/core'
import {
  IDesignerContext,
  IWorkspaceContext,
  IDesignerComponents,
} from './types'

export const DesignerComponentsContext = createContext<IDesignerComponents>({})

export const DesignerContext = createContext<IDesignerContext>(null)

export const TreeNodeContext = createContext<TreeNode>(null)

export const WorkspaceContext = createContext<IWorkspaceContext>(null)
