import 'antd/dist/antd.less'
import React, { useMemo } from 'react'
import ReactDOM from 'react-dom'
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
  Workbench,
  WorkspacePanel,
  ToolbarPanel,
  ViewportPanel,
  ViewPanel,
  SettingsPanel,
  ComponentTreeWidget,
} from '@inbiz/react'
import { SettingsForm, setNpmCDNRegistry } from '@inbiz/react-settings-form'
import { createDesigner, GlobalRegistry, Shortcut, KeyCode } from '@inbiz/core'
import {
  LogoWidget,
  ActionsWidget,
  PreviewWidget,
  SchemaEditorWidget,
  MarkupSchemaWidget,
} from './widgets'
import { saveSchema } from './service'
import {
  Form,
  Field,
  FormTab,
  FormCollapse,
  FormGrid,
  Test,
} from '../src/materials'
import { TopBottomFixed, TopLeftBottomFixed } from './layout'
setNpmCDNRegistry('//unpkg.com')

GlobalRegistry.registerDesignerLocales({
  'zh-CN': {
    sources: {
      Inputs: '输入控件',
      Layouts: '布局组件',
      Arrays: '自增组件',
      Displays: '展示组件',
    },
  },
  'en-US': {
    sources: {
      Inputs: 'Inputs',
      Layouts: 'Layouts',
      Arrays: 'Arrays',
      Displays: 'Displays',
    },
  },
  'ko-KR': {
    sources: {
      Inputs: '입력',
      Layouts: '레이아웃',
      Arrays: '배열',
      Displays: '디스플레이',
    },
  },
})

const components = {
  Field,
  Form,
  FormGrid,
  FormTab,
  FormCollapse,
  Test,
}
const componentIcon = {}
Object.values(components).reduce((pre, next) => {
  const name = next.Behavior?.[0].name
  const icon = next.Resource?.[0].icon
  if (name && icon) {
    pre[name] = icon
  }
  return pre
}, componentIcon)
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
              saveSchema(ctx.engine)
            },
          }),
        ],
        rootComponentName: 'Form',
      }),
    []
  )

  return (
    <Designer engine={engine}>
      <StudioPanel logo={<LogoWidget />} actions={<ActionsWidget />}>
        <CompositePanel>
          <CompositePanel.Item title="panels.Component" icon="Component">
            <ResourceWidget title="sources.Inputs" sources={[Test]} />
            <ResourceWidget
              title="sources.Layouts"
              sources={[FormGrid, FormTab, FormCollapse]}
            />
            <ResourceWidget title="sources.Arrays" sources={[]} />
            <ResourceWidget title="sources.Displays" sources={[Text]} />
          </CompositePanel.Item>
          <CompositePanel.Item title="panels.OutlinedTree" icon="Outline">
            <OutlineTreeWidget />
          </CompositePanel.Item>
          <CompositePanel.Item title="panels.History" icon="History">
            <HistoryWidget />
          </CompositePanel.Item>
        </CompositePanel>
        <TopLeftBottomFixed components={components} />
        <SettingsPanel title="panels.PropertySettings">
          <SettingsForm
            componentIcon={componentIcon}
            appInfo={{ appId: '22222' }}
          />
        </SettingsPanel>
      </StudioPanel>
    </Designer>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
