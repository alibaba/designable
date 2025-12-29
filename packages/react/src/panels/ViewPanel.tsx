import React, { useEffect, useState } from 'react'
import { TreeNode, ITreeNode, WorkbenchTypes } from '@designable/core'
import { observer } from '@formily/reactive-react'
import { useTree, useWorkbench } from '../hooks'
import { Viewport } from '../containers'
import { requestIdle } from '@designable/shared'

export interface IViewPanelProps {
  type: WorkbenchTypes
  children: (
    tree: TreeNode,
    onChange: (tree: ITreeNode) => void
  ) => React.ReactElement
  scrollable?: boolean
  dragTipsDirection?: 'left' | 'right'
}

export const ViewPanel: React.FC<IViewPanelProps> = observer(({ type, children, scrollable = true, dragTipsDirection }) => {
  const [visible, setVisible] = useState(true)
  const workbench = useWorkbench()
  const tree = useTree()
  console.log('ViewPanel render', type, workbench.type)
  useEffect(() => {
    if (workbench.type === type) {
      requestIdle(() => {
        requestAnimationFrame(() => {
          setVisible(true)
        })
      })
    } else {
      setVisible(false)
    }
  }, [workbench.type])
  if (workbench.type !== type) return null

  const render = () => {
    return children(tree, (payload) => {
      tree.from(payload)
      tree.takeSnapshot()
    })
  }
  if (workbench.type === 'DESIGNABLE')
    return (
      <Viewport dragTipsDirection={dragTipsDirection}>
        {render()}
      </Viewport>
    )
  return (
    <div
      style={{
        overflow: scrollable ? 'overlay' : 'hidden',
        height: '100%',
        cursor: 'auto',
        userSelect: 'text',
      }}
    >
      {visible && render()}
    </div>
  )
})
