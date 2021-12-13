import React, { Fragment, useState } from 'react'
import { observer } from '@formily/react'
import { Tab } from '@alifd/next'
import { TabProps, ItemProps as TabItemProps } from '@alifd/next/types/tab'
import { TreeNode, createFeature, createResource } from '@designable/core'
import {
  useNodeIdProps,
  useTreeNode,
  TreeNodeWidget,
  DroppableWidget,
  DnFC,
} from '@designable/react-page'
import { LoadTemplate } from '../../common/LoadTemplate'
import { useDropTemplate } from '../../hooks'
import { createVoidFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'
import { matchComponent } from '../../shared'

const parseTabs = (parent: TreeNode) => {
  const tabs: TreeNode[] = []
  parent.children.forEach((node) => {
    if (matchComponent(node, 'FormTab.TabPane')) {
      tabs.push(node)
    }
  })
  return tabs
}

const getCorrectActiveKey = (activeKey: string, tabs: TreeNode[]) => {
  if (tabs.length === 0) return
  if (tabs.some((node) => node.id === activeKey)) return activeKey
  return tabs[tabs.length - 1].id
}

export const FormTab: DnFC<TabProps> & {
  TabPane?: React.FC<TabItemProps>
} = observer((props) => {
  const [activeKey, setActiveKey] = useState<string>()
  const nodeId = useNodeIdProps()
  const node = useTreeNode()
  const designer = useDropTemplate('FormTab', (source) => {
    return [
      new TreeNode({
        componentName: 'Field',
        props: {
          type: 'void',
          'x-component': 'FormTab.TabPane',
          'x-component-props': {
            title: `Unnamed Title`,
          },
        },
        children: source,
      }),
    ]
  })
  const tabs = parseTabs(node)
  const renderTabs = () => {
    if (!node.children?.length) return <DroppableWidget />
    return (
      <Tab
        {...props}
        activeKey={getCorrectActiveKey(activeKey, tabs)}
        onChange={(id: string) => {
          setActiveKey(id)
        }}
      >
        {tabs.map((tab) => {
          const props = tab.props['x-component-props'] || {}
          return (
            <Tab.Item
              {...props}
              style={{ ...props.style }}
              title={
                <span
                  data-content-editable="x-component-props.title"
                  data-content-editable-node-id={tab.id}
                >
                  {props.title}
                </span>
              }
              key={tab.id}
            >
              {React.createElement(
                'div',
                {
                  [designer.props.nodeIdAttrName]: tab.id,
                  style: {
                    padding: '20px 0',
                  },
                },
                tab.children.length ? (
                  <TreeNodeWidget node={tab} />
                ) : (
                  <DroppableWidget />
                )
              )}
            </Tab.Item>
          )
        })}
      </Tab>
    )
  }
  return (
    <div {...nodeId}>
      {renderTabs()}
      <LoadTemplate
        actions={[
          {
            title: node.getMessage('addTabPane'),
            icon: 'AddPanel',
            onClick: () => {
              const tabPane = new TreeNode({
                componentName: 'Field',
                props: {
                  type: 'void',
                  'x-component': 'FormTab.TabPane',
                  'x-component-props': {
                    title: `Unnamed Title`,
                  },
                },
              })
              node.append(tabPane)
              setActiveKey(tabPane.id)
            },
          },
        ]}
      />
    </div>
  )
})

FormTab.TabPane = (props) => {
  return <Fragment>{props.children}</Fragment>
}

FormTab.Feature = createFeature(
  {
    name: 'FormTab',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'FormTab',
    descriptor: {
      droppable: true,
      allowAppend: (target, source) =>
        target.children.length === 0 ||
        source.every((node) => node.props['x-component'] === 'FormTab.TabPane'),
      propsSchema: createVoidFieldSchema(AllSchemas.FormTab),
    },
    locales: AllLocales.FormTab,
  },
  {
    name: 'FormTab.TabPane',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'FormTab.TabPane',
    descriptor: {
      droppable: true,
      allowDrop: (node) => node.props['x-component'] === 'FormTab',
      propsSchema: createVoidFieldSchema(AllSchemas.FormTab.TabPane),
    },
    locales: AllLocales.FormTabPane,
  }
)

FormTab.Resource = createResource({
  icon: 'TabSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'void',
        'x-component': 'FormTab',
      },
    },
  ],
})
