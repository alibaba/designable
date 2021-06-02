import React, { useState } from 'react'
import { isFn, TreeNode } from '@designable/core'
import { observer } from '@formily/reactive-react'
import cls from 'classnames'
import { useDesigner, usePrefix } from '../../hooks'
import { IconWidget } from '../IconWidget'
import { TextWidget } from '../TextWidget'
import './styles.less'

export type SourceMapper = (node: TreeNode) => React.ReactChild

export interface IDragSourceWidgetProps {
  name: string
  title: React.ReactNode
  className?: string
  defaultExpand?: boolean
  children?: SourceMapper | React.ReactElement
}

export const DragSourceWidget: React.FC<IDragSourceWidgetProps> = observer(
  (props) => {
    const prefix = usePrefix('drag-source')
    const designer = useDesigner()
    const [expand, setExpand] = useState(props.defaultExpand)
    const renderNode = (node: TreeNode) => {
      return (
        <div
          className={prefix + '-item'}
          key={node.id}
          data-designer-source-id={node.id}
        >
          {node?.designerProps?.icon && (
            <IconWidget
              infer={node?.designerProps?.icon}
              size={12}
              style={{ marginRight: 3 }}
            />
          )}
          <TextWidget>{node?.designerProps?.title}</TextWidget>
        </div>
      )
    }

    return (
      <div
        className={cls(prefix, props.className, {
          expand,
        })}
      >
        <div
          className={prefix + '-header'}
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
            setExpand(!expand)
          }}
        >
          <div className={prefix + '-header-expand'}>
            <IconWidget infer="Expand" />
          </div>
          <div className={prefix + '-header-content'}>
            <TextWidget>{props.title}</TextWidget>
          </div>
        </div>
        <div className={prefix + '-content'}>
          {designer.source.mapSourcesByGroup(
            props.name,
            isFn(props.children) ? props.children : renderNode
          )}
        </div>
      </div>
    )
  }
)

DragSourceWidget.defaultProps = {
  defaultExpand: true,
}
