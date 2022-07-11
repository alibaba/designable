import React from 'react'
import { observer } from '@formily/reactive-react'
import { useDesigner, usePrefix, useSelection } from '../../hooks'

export const RotateHandler: React.FC = observer(() => {
  const designer = useDesigner()
  const prefix = usePrefix('aux-node-rotate-handler')
  const selection = useSelection()
  const allowRotate = selection?.selectedNodes?.every((node) =>
    node.allowRotate()
  )
  if (!allowRotate) return null
  return (
    <div className={prefix}>
      <div
        className={prefix + '-head'}
        {...{ [designer.props.nodeRotateHandlerAttrName]: true }}
      ></div>
    </div>
  )
})
