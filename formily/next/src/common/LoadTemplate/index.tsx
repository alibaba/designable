import React from 'react'
import { NodeActionsWidget } from '@designable/react'

export interface ITemplateAction {
  title: React.ReactNode
  tooltip?: React.ReactNode
  icon?: string | React.ReactNode
  onClick: () => void
}

export interface ILoadTemplateProps {
  className?: string
  style?: React.CSSProperties
  actions?: ITemplateAction[]
}

export const LoadTemplate: React.FC<ILoadTemplateProps> = (props) => {
  return (
    <NodeActionsWidget>
      {props.actions?.map((action, key) => {
        return <NodeActionsWidget.Action {...action} key={key} />
      })}
    </NodeActionsWidget>
  )
}
