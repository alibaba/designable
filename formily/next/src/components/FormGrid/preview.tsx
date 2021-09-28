import React from 'react'
import { FormGrid as FormilyGird } from '@formily/next'
import { TreeNode, createBehavior, createResource } from '@designable/core'
import {
  DnFC,
  DroppableWidget,
  useTreeNode,
  useNodeIdProps,
} from '@designable/react'
import { observer } from '@formily/reactive-react'
import { LoadTemplate } from '../../common/LoadTemplate'
import { createFieldSchema } from '../Field'
import { AllSchemas } from '../../schemas'
import { AllLocales } from '../../locales'
import './styles.less'

type formilyGrid = typeof FormilyGird

export const FormGrid: DnFC<React.ComponentProps<formilyGrid>> & {
  GridColumn?: React.FC<React.ComponentProps<formilyGrid['GridColumn']>>
} = observer((props) => {
  const node = useTreeNode()
  const nodeId = useNodeIdProps()
  if (node.children.length === 0) return <DroppableWidget {...props} />
  const totalColumns = node.children.reduce(
    (buf, child) => buf + (child.props?.['x-component-props']?.gridSpan ?? 1),
    0
  )
  return (
    <div {...nodeId} className="dn-grid">
      <FormilyGird {...props} key={totalColumns}>
        {props.children}
      </FormilyGird>
      <LoadTemplate
        actions={[
          {
            title: node.getMessage('addGridColumn'),
            onClick: () => {
              const column = new TreeNode({
                componentName: 'Field',
                props: {
                  type: 'void',
                  'x-component': 'FormGrid.GridColumn',
                },
              })
              node.append(column)
            },
          },
        ]}
      />
    </div>
  )
})

FormGrid.GridColumn = observer((props) => {
  return (
    <DroppableWidget>
      <div
        {...props}
        data-span={props.gridSpan}
        style={{
          ...props['style'],
          gridColumnStart: `span ${props.gridSpan || 1}`,
        }}
      >
        {props.children}
      </div>
    </DroppableWidget>
  )
})

FormGrid.Behavior = createBehavior(
  {
    name: 'FormGrid',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'FormGrid',
    designerProps: {
      droppable: true,
      allowDrop: (node) => node.props['x-component'] !== 'FormGrid',
      propsSchema: createFieldSchema(AllSchemas.FormGrid),
    },
    designerLocales: AllLocales.FormGrid,
  },
  {
    name: 'FormGrid.GridColumn',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'FormGrid.GridColumn',
    designerProps: {
      droppable: true,
      allowDrop: (node) => node.props['x-component'] === 'FormGrid',
      propsSchema: createFieldSchema(AllSchemas.FormGrid.GridColumn),
    },
    designerLocales: AllLocales.FormGridColumn,
  }
)

FormGrid.Resource = createResource({
  icon: 'GridSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'void',
        'x-component': 'FormGrid',
      },
      children: [
        {
          componentName: 'Field',
          props: {
            type: 'void',
            'x-component': 'FormGrid.GridColumn',
          },
        },
        {
          componentName: 'Field',
          props: {
            type: 'void',
            'x-component': 'FormGrid.GridColumn',
          },
        },
        {
          componentName: 'Field',
          props: {
            type: 'void',
            'x-component': 'FormGrid.GridColumn',
          },
        },
      ],
    },
  ],
})
