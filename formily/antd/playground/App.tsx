import React, { useMemo, useEffect } from 'react';
import { createDesigner, Shortcut, KeyCode} from '@designable/core';
import { Designer, StudioPanel, CompositePanel, Workspace, WorkspacePanel, ToolbarPanel, ViewportPanel, ViewPanel, SettingsPanel, ComponentTreeWidget, DesignerToolsWidget, ViewToolsWidget, OutlineTreeWidget, ResourceWidget, HistoryWidget } from '@designable/react';
import { SettingsForm } from '@designable/react-settings-form';
import { LogoWidget, ActionsWidget, PreviewWidget, SchemaEditorWidget, MarkupSchemaWidget } from './widgets';

import {
  transformToTreeNode,
} from '@designable/formily-transformer'
import { GlobalRegistry } from '@designable/core';


import { formSchema } from './sample';
import { designer, components} from './setup';


import {
  Form,
  Field,
  Input,
  Select,
  TreeSelect,
  Cascader,
  Radio,
  Checkbox,
  Slider,
  Rate,
  NumberPicker,
  Transfer,
  Password,
  DatePicker,
  TimePicker,
  Upload,
  Switch,
  Text,
  Card,
  ArrayCards,
  ArrayTable,
  Space,
  FormTab,
  FormCollapse,
  FormLayout,
  FormGrid,
} from '../src';
import { inputs , layouts, arrays, displays} from './setup';

import '@designable/react-settings-form/style';

export const App = () => {

  const engine = useMemo(
    () => { return designer;},
    []
  );
  useEffect(() => {
    const tree = transformToTreeNode(
        { schema: formSchema },
        { 
          designableFormName: 'Form',
          designableFieldName: 'Field',
        }
      )
    console.log('Initial Tree:', JSON.stringify(tree, null, 2)  )
    engine.setCurrentTree(tree)
  }, [engine])

  return (
    <Designer engine={engine}>
      <StudioPanel logo={<LogoWidget />} actions={<ActionsWidget />}>
        <CompositePanel>
          <CompositePanel.Item title="panels.Component" icon="Component">
            <ResourceWidget title="sources.Inputs" sources={inputs} />
            <ResourceWidget title="sources.Layouts" sources={layouts} />
            <ResourceWidget title="sources.Arrays" sources={arrays} />
            <ResourceWidget title="sources.Displays" sources={displays} />
          </CompositePanel.Item>
          <CompositePanel.Item title="panels.OutlinedTree" icon="Outline">
            <OutlineTreeWidget />
          </CompositePanel.Item>
          <CompositePanel.Item title="panels.History" icon="History">
            <HistoryWidget />
          </CompositePanel.Item>
        </CompositePanel>
        <Workspace id="form">
          <WorkspacePanel>
            <ToolbarPanel>
              <DesignerToolsWidget />
              <ViewToolsWidget use={['DESIGNABLE', 'JSONTREE', 'MARKUP', 'PREVIEW']} />
            </ToolbarPanel>
            <ViewportPanel style={{ height: '100%' }}>
              <ViewPanel type="DESIGNABLE">
                {() => <ComponentTreeWidget components={components} />}
              </ViewPanel>
              <ViewPanel type="JSONTREE" scrollable={false}>
                {(tree, onChange) => <SchemaEditorWidget tree={tree} onChange={onChange} />}
              </ViewPanel>
              <ViewPanel type="MARKUP" scrollable={false}>
                {(tree) => <MarkupSchemaWidget tree={tree} />}
              </ViewPanel>
              <ViewPanel type="PREVIEW">
                {(tree) => <PreviewWidget tree={tree} />}
              </ViewPanel>
            </ViewportPanel>
          </WorkspacePanel>
        </Workspace>
        <SettingsPanel title="panels.PropertySettings">
          <SettingsForm uploadAction="https://www.mocky.io/v2/5cc8019d300000980a055e76" />
        </SettingsPanel>
      </StudioPanel>
    </Designer>
  );
};
