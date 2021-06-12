import React from 'react'
import { Breadcrumb } from 'antd'
import {
  useCurrentNode,
  TextWidget,
  IconWidget,
  useSelection,
  usePrefix,
  useHover,
} from '@designable/react'
import './styles.less'

export const NodePath: React.FC = () => {
  const selected = useCurrentNode()
  const selection = useSelection()
  const hover = useHover()
  const prefix = usePrefix('node-path')
  if (!selected) return <React.Fragment />
  const nodes = selected.getParents().slice(0, 2).reverse().concat(selected)
  return (
    <Breadcrumb className={prefix}>
      {nodes.map((node, key) => {
        return (
          <Breadcrumb.Item key={key}>
            {key === 0 && (
              <IconWidget infer="Position" style={{ marginRight: 3 }} />
            )}
            <a
              href=""
              onMouseEnter={() => {
                hover.setHover(node)
              }}
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                selection.select(node)
              }}
            >
              <TextWidget>{node.designerProps.title}</TextWidget>
            </a>
          </Breadcrumb.Item>
        )
      })}
    </Breadcrumb>
  )
}
