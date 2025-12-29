import React from 'react'
import {
  CompositePanel,
  ResourceWidget,
  OutlineTreeWidget,
  HistoryWidget,
} from '@designable/react'
import { Input, Card } from '../designer-setup'

export const CompositePanelSection: React.FC = () => (
  <CompositePanel>
    <CompositePanel.Item title="panels.Component" icon="Component">
      <ResourceWidget title="sources.Inputs" sources={[Input, Card]} />
      <ResourceWidget title="sources.Displays" sources={[Input, Card]} />
      <ResourceWidget title="sources.Feedbacks" sources={[Input, Card]} />
    </CompositePanel.Item>
    <CompositePanel.Item title="panels.OutlinedTree" icon="Outline">
      <OutlineTreeWidget />
    </CompositePanel.Item>
    <CompositePanel.Item title="panels.History" icon="History">
      <HistoryWidget />
    </CompositePanel.Item>
  </CompositePanel>
)
