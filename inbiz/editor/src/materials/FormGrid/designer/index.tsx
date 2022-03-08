import React, { useState } from 'react'
import { FormGrid as FormilyGird } from '../preview'
import { TreeNode, createBehavior, createResource } from '@inbiz/core'
import {
  DnFC,
  useTreeNode,
  useNodeIdProps,
  DroppableWidget,
} from '@inbiz/react'
import { observer } from '@formily/reactive-react'
import { LoadTemplate } from '../../common/LoadTemplate'
import { createFieldSchema } from '../../Field'
import { FormGrid as FormGridSchema  } from './schema'
import { FormGrid as FormGridLocale,FormGridColumn as FormGridColumnLocale } from './locale'
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

  const key = new Date().getTime()

  return (
    <div {...nodeId} className="dn-grid">
      <FormilyGird {...props} key={key}>
        {props.children}
      </FormilyGird>
      <LoadTemplate
        actions={[
          {
            title: node.getMessage('addGridColumn'),
            icon: 'AddColumn',
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
    <DroppableWidget
      {...props}
      data-span={props.gridSpan}
      style={{
        ...props['style'],
        gridColumnStart: `span ${props.gridSpan || 1}`,
      }}
    >
      {props.children}
    </DroppableWidget>
  )
})

export const FormGridBehavior=createBehavior(
  {
    name: 'FormGrid',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'FormGrid',
    designerProps: {
      droppable: true,
      allowDrop: (node) => node.props['x-component'] !== 'FormGrid',
      propsSchema: createFieldSchema(FormGridSchema),
    },
    designerLocales: FormGridLocale,
  },
  {
    name: 'FormGrid.GridColumn',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'FormGrid.GridColumn',
    designerProps: {
      droppable: true,
      resizable: {
        width(node) {
          const span = Number(node.props['x-component-props']?.gridSpan ?? 1)
          return {
            plus: () => {
              if (span + 1 > 12) return
              node.props['x-component-props'] =
                node.props['x-component-props'] || {}
              node.props['x-component-props'].gridSpan = span + 1
            },
            minus: () => {
              if (span - 1 < 1) return
              node.props['x-component-props'] =
                node.props['x-component-props'] || {}
              node.props['x-component-props'].gridSpan = span - 1
            },
          }
        },
      },
      resizeXPath: 'x-component-props.gridSpan',
      resizeStep: 1,
      resizeMin: 1,
      resizeMax: 12,
      allowDrop: (node) => node.props['x-component'] === 'FormGrid',
      propsSchema: createFieldSchema(FormGridSchema.GridColumn),
    },
    designerLocales: FormGridColumnLocale,
  }
)
FormGrid.Behavior = createBehavior(
  {
    name: 'FormGrid',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'FormGrid',
    designerProps: {
      droppable: true,
      allowDrop: (node) => node.props['x-component'] !== 'FormGrid',
      propsSchema: createFieldSchema(FormGridSchema),
    },
    designerLocales: FormGridLocale,
  },
  {
    name: 'FormGrid.GridColumn',
    extends: ['Field'],
    selector: (node) => node.props['x-component'] === 'FormGrid.GridColumn',
    designerProps: {
      droppable: true,
      resizable: {
        width(node) {
          const span = Number(node.props['x-component-props']?.gridSpan ?? 1)
          return {
            plus: () => {
              if (span + 1 > 12) return
              node.props['x-component-props'] =
                node.props['x-component-props'] || {}
              node.props['x-component-props'].gridSpan = span + 1
            },
            minus: () => {
              if (span - 1 < 1) return
              node.props['x-component-props'] =
                node.props['x-component-props'] || {}
              node.props['x-component-props'].gridSpan = span - 1
            },
          }
        },
      },
      resizeXPath: 'x-component-props.gridSpan',
      resizeStep: 1,
      resizeMin: 1,
      resizeMax: 12,
      allowDrop: (node) => node.props['x-component'] === 'FormGrid',
      propsSchema: createFieldSchema(FormGridSchema.GridColumn),
    },
    designerLocales: FormGridColumnLocale,
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
