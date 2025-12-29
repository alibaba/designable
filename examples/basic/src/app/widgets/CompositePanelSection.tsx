import React from 'react'
import { CompositePanel, ResourceWidget, OutlineTreeWidget, HistoryWidget } from '@designable/react'

import { resources } from '../setup'

export const CompositePanelSection: React.FC = () => (
  <CompositePanel>
    <CompositePanel.Item title="panels.Component" icon="Component">
      <ResourceWidget title="sources.Inputs" sources={resources} />
      <ResourceWidget title="sources.Displays" sources={resources} />
      <ResourceWidget title="sources.Feedbacks" sources={resources} />
    </CompositePanel.Item>
    <CompositePanel.Item title="panels.OutlinedTree" icon="Outline">
      <OutlineTreeWidget />
    </CompositePanel.Item>
    <CompositePanel.Item title="panels.History" icon="History">
      <HistoryWidget />
    </CompositePanel.Item>
  </CompositePanel>
)
