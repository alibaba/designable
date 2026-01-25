import React, { Fragment, useState, useMemo } from 'react'
import { observer } from '@formily/react'
import { Collapse } from 'antd'
import type { CollapseProps } from 'antd'
import { TreeNode, createBehavior, createResource } from '@sulesky/next-core'
import {
  useTreeNode,
  useNodeIdProps,
  DroppableWidget,
  TreeNodeWidget,
  DnFC,
} from '@sulesky/next-react'
import { toArr } from '@formily/shared'
import { LoadTemplate } from '../../common/LoadTemplate'
import { useDropTemplate } from '../../hooks'
import { createVoidFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'
import { matchComponent } from '../../shared'

const parseCollapse = (parent: TreeNode) => {
  const tabs: TreeNode[] = []
  parent.children.forEach((node) => {
    if (matchComponent(node, 'FormCollapse.CollapsePanel')) {
      tabs.push(node)
    }
  })
  return tabs
}

export const FormCollapse: DnFC<CollapseProps> & {
  CollapsePanel?: React.FC<{
    header?: React.ReactNode
    children?: React.ReactNode
  }>
} = observer((props) => {
  const [activeKey, setActiveKey] = useState<string | string[]>([])
  const node = useTreeNode()
  const nodeId = useNodeIdProps()
  const designer = useDropTemplate('FormCollapse', (source) => {
    const panelNode = new TreeNode({
      componentName: 'Field',
      props: {
        type: 'void',
        'x-component': 'FormCollapse.CollapsePanel',
        'x-component-props': {
          header: `Unnamed Title`,
        },
      },
      children: source,
    })

    setActiveKey(toArr(activeKey).concat(panelNode.id))
    return [panelNode]
  })
  const panels = parseCollapse(node)

  const collapseItems = useMemo(() => {
    return panels.map((panel) => {
      const panelProps = panel.props['x-component-props'] || {}
      return {
        key: panel.id,
        label: (
          <span
            data-content-editable="x-component-props.header"
            data-content-editable-node-id={panel.id}
          >
            {panelProps.header}
          </span>
        ),
        style: panelProps.style,
        children: React.createElement(
          'div',
          {
            [designer.props.nodeIdAttrName]: panel.id,
            style: {
              padding: '20px 0',
            },
          },
          panel.children.length ? (
            <TreeNodeWidget node={panel} />
          ) : (
            <DroppableWidget />
          ),
        ),
      }
    })
  }, [panels, designer.props.nodeIdAttrName])

  const renderCollapse = () => {
    if (!node.children?.length) return <DroppableWidget />
    return (
      <Collapse
        {...props}
        activeKey={panels.map((tab) => tab.id)}
        items={collapseItems}
      />
    )
  }
  return (
    <div {...nodeId}>
      {renderCollapse()}
      <LoadTemplate
        actions={[
          {
            title: node.getMessage('addCollapsePanel'),
            icon: 'AddPanel',
            onClick: () => {
              const tabPane = new TreeNode({
                componentName: 'Field',
                props: {
                  type: 'void',
                  'x-component': 'FormCollapse.CollapsePanel',
                  'x-component-props': {
                    header: `Unnamed Title`,
                  },
                },
              })
              node.append(tabPane)
              const keys = toArr(activeKey)
              setActiveKey(keys.concat(tabPane.id))
            },
          },
        ]}
      />
    </div>
  )
})

FormCollapse.CollapsePanel = (props) => {
  return <Fragment>{props.children}</Fragment>
}

FormCollapse.Behavior = createBehavior(
  {
    name: 'FormCollapse',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'FormCollapse',
    designerProps: {
      droppable: true,
      allowAppend: (target, source) =>
        target.children.length === 0 ||
        source.every(
          (node) => node.props['x-component'] === 'FormCollapse.CollapsePanel',
        ),
      propsSchema: createVoidFieldSchema(AllSchemas.FormCollapse),
    },
    designerLocales: AllLocales.FormCollapse,
  },
  {
    name: 'FormCollapse.CollapsePanel',
    extends: ['Field'],
    selector: (node) =>
      node.props['x-component'] === 'FormCollapse.CollapsePanel',
    designerProps: {
      droppable: true,
      allowDrop: (node) => node.props['x-component'] === 'FormCollapse',
      propsSchema: createVoidFieldSchema(AllSchemas.FormCollapse.CollapsePanel),
    },
    designerLocales: AllLocales.FormCollapsePanel,
  },
)

FormCollapse.Resource = createResource({
  icon: 'CollapseSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'void',
        'x-component': 'FormCollapse',
      },
    },
  ],
})
