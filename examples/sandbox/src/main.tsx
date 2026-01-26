import React, { useMemo, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import {
  Designer,
  DesignerToolsWidget,
  ViewToolsWidget,
  Workspace,
  OutlineTreeWidget,
  ResourceWidget,
  HistoryWidget,
  StudioPanel,
  CompositePanel,
  WorkspacePanel,
  ToolbarPanel,
  ViewportPanel,
  ViewPanel,
  SettingsPanel,
  ComponentTreeWidget,
  useDesigner,
} from '@sulesky/next-react'
import { Space as AntSpace, Button, message } from 'antd'
import {
  transformToSchema,
  transformToTreeNode,
} from '@sulesky/next-formily-transformer'

import {
  SettingsForm,
  setNpmCDNRegistry,
} from '@sulesky/next-react-settings-form'
import {
  createDesigner,
  GlobalRegistry,
  Shortcut,
  KeyCode,
} from '@sulesky/next-core'

// Import components from formily-antd package
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
  ObjectContainer,
  ArrayTable,
  Space,
  FormTab,
  FormCollapse,
  FormLayout,
  FormGrid,
} from '@sulesky/next-formily-antd'

// Import widgets from formily/antd playground (shared, not duplicated)
import {
  PreviewWidget,
  SchemaEditorWidget,
  MarkupSchemaWidget,
} from '../../../formily/antd/playground/widgets'

// Custom logo
const CustomLogo = () => (
  <div
    style={{
      fontWeight: 'bold',
      color: '#1890ff',
      padding: '12px 8px',
      fontSize: 16,
    }}
  >
    Kaplan Studio
  </div>
)

// Custom actions - Save and Close only
const CustomActions = () => {
  const designer = useDesigner()

  // Initialize: load saved schema and set language
  useEffect(() => {
    try {
      const saved = localStorage.getItem('formily-schema')
      if (saved) {
        designer.setCurrentTree(transformToTreeNode(JSON.parse(saved)))
      }
    } catch {}
    GlobalRegistry.setDesignerLanguage('en-us')
  }, [])

  const handleSave = () => {
    const schema = transformToSchema(designer.getCurrentTree())
    localStorage.setItem('formily-schema', JSON.stringify(schema))
    message.success('Saved!')
  }

  const handleClose = () => {
    if (confirm('Close without saving?')) {
      window.close()
    }
  }

  return (
    <AntSpace style={{ marginRight: 10 }}>
      <Button onClick={handleSave}>Save</Button>
      <Button danger onClick={handleClose}>
        Close
      </Button>
    </AntSpace>
  )
}

setNpmCDNRegistry('//unpkg.com')

GlobalRegistry.registerDesignerLocales({
  'en-US': {
    sources: {
      Inputs: 'Inputs',
      Layouts: 'Layouts',
      Arrays: 'Arrays',
      Displays: 'Displays',
    },
  },
})

const App = () => {
  const engine = useMemo(
    () =>
      createDesigner({
        shortcuts: [
          new Shortcut({
            codes: [
              [KeyCode.Meta, KeyCode.S],
              [KeyCode.Control, KeyCode.S],
            ],
            handler(ctx) {
              const schema = transformToSchema(ctx.engine.getCurrentTree())
              localStorage.setItem('formily-schema', JSON.stringify(schema))
              message.success('Saved!')
            },
          }),
        ],
        rootComponentName: 'Form',
      }),
    [],
  )

  return (
    <Designer engine={engine}>
      <StudioPanel logo={<CustomLogo />} actions={<CustomActions />}>
        <CompositePanel>
          <CompositePanel.Item title="panels.Component" icon="Component">
            <ResourceWidget
              title="sources.Inputs"
              sources={[
                Input,
                Password,
                NumberPicker,
                Rate,
                Slider,
                Select,
                TreeSelect,
                Cascader,
                Transfer,
                Checkbox,
                Radio,
                DatePicker,
                TimePicker,
                Upload,
                Switch,
                ObjectContainer,
              ]}
            />
            <ResourceWidget
              title="sources.Layouts"
              sources={[
                Card,
                FormGrid,
                FormTab,
                FormLayout,
                FormCollapse,
                Space,
              ]}
            />
            <ResourceWidget
              title="sources.Arrays"
              sources={[ArrayCards, ArrayTable]}
            />
            <ResourceWidget title="sources.Displays" sources={[Text]} />
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
              <ViewToolsWidget
                use={['DESIGNABLE', 'JSONTREE', 'MARKUP', 'PREVIEW']}
              />
            </ToolbarPanel>
            <ViewportPanel style={{ height: '100%' }}>
              <ViewPanel type="DESIGNABLE">
                {() => (
                  <ComponentTreeWidget
                    components={{
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
                      FormGrid,
                      FormLayout,
                      ObjectContainer,
                    }}
                  />
                )}
              </ViewPanel>
              <ViewPanel type="JSONTREE" scrollable={false}>
                {(tree, onChange) => (
                  <SchemaEditorWidget tree={tree} onChange={onChange} />
                )}
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
          <SettingsForm uploadAction="" />
        </SettingsPanel>
      </StudioPanel>
    </Designer>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
