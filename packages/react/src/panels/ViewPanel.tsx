import React from 'react'
import { TreeNode, WorkbenchTypes } from '@designable/core'
import { observer } from '@formily/reactive-react'
import { useTree, useWorkbench } from '../hooks'
import { Viewport } from '../containers'

export interface IViewPanelProps {
  type: WorkbenchTypes
  children: (
    tree: TreeNode,
    onChange: (tree: TreeNode) => void
  ) => React.ReactElement
}

export const ViewPanel: React.FC<IViewPanelProps> = observer((props) => {
  const workbench = useWorkbench()
  const tree = useTree()
  if (workbench.type !== props.type) return null
  const render = () => {
    return props.children(tree, (payload) => {
      tree.from(payload)
    })
  }
  if (workbench.type === 'DESIGNABLE') return <Viewport>{render()}</Viewport>
  return render()
})
