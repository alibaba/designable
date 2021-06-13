import React from 'react'
import { TreeNode } from '@designable/core'
import { observer } from '@formily/reactive-react'
import { IconWidget } from '../IconWidget'
import { useOperation, usePrefix } from '../../hooks'
import { Button } from 'antd'

export interface IDragFocusProps {
  node: TreeNode
  style?: React.CSSProperties
}

export const DragFocus: React.FC<IDragFocusProps> = observer(
  ({ node, style }) => {
    const operation = useOperation()
    const prefix = usePrefix('aux-focus')
    if (node === node.root) return null
    return (
      <Button
        className={prefix}
        style={style}
        type="primary"
        onClick={() => {
          operation.switchFocusNode(node)
        }}
      >
        <IconWidget infer={operation.focusNode === node ? 'Move' : 'Focus'} />
      </Button>
    )
  }
)

DragFocus.displayName = 'DragFocus'
