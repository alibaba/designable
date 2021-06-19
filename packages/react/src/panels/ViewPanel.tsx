import React, { useEffect, useState } from 'react'
import { TreeNode, WorkbenchTypes } from '@designable/core'
import { observer } from '@formily/reactive-react'
import { useTree, useWorkbench } from '../hooks'
import { Viewport } from '../containers'
import { requestIdle } from '@designable/shared'

export interface IViewPanelProps {
  type: WorkbenchTypes
  children: (
    tree: TreeNode,
    onChange: (tree: TreeNode) => void
  ) => React.ReactElement
}

export const ViewPanel: React.FC<IViewPanelProps> = observer((props) => {
  const [visible, setVisible] = useState(true)
  const workbench = useWorkbench()
  const tree = useTree()
  useEffect(() => {
    if (workbench.type === props.type) {
      requestIdle(() => {
        requestAnimationFrame(() => {
          setVisible(true)
        })
      })
    } else {
      setVisible(false)
    }
  }, [workbench.type])
  if (workbench.type !== props.type) return null
  const render = () => {
    return props.children(tree, (payload) => {
      tree.from(payload)
    })
  }
  if (workbench.type === 'DESIGNABLE') return <Viewport>{render()}</Viewport>
  return (
    <div
      style={{
        overflow: 'overlay',
        minHeight: '100%',
        cursor: 'auto',
        userSelect: 'text',
      }}
    >
      {visible && render()}
    </div>
  )
})
