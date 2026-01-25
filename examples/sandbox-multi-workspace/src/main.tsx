import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import {
  Designer,
  IconWidget,
  Workbench,
  Workspace,
  ViewPanel,
  DesignerToolsWidget,
  ViewToolsWidget,
  OutlineTreeWidget,
  ResourceWidget,
  StudioPanel,
  CompositePanel,
  WorkspacePanel,
  ToolbarPanel,
  ViewportPanel,
  SettingsPanel,
  HistoryWidget,
} from '@sulesky/next-react'
import { SettingsForm, MonacoInput } from '@sulesky/next-react-settings-form'
import { observer } from '@formily/react'
import {
  createDesigner,
  createResource,
  createBehavior,
  GlobalRegistry,
} from '@sulesky/next-core'
import { Space, Button } from 'antd'
import { GithubOutlined } from '@ant-design/icons'
import { Sandbox } from '@sulesky/next-react-sandbox'

const RootBehavior = createBehavior({
  name: 'Root',
  selector: 'Root',
  designerProps: {
    droppable: true,
  },
  designerLocales: {
    'en-US': {
      title: 'Root',
    },
  },
})

const InputBehavior = createBehavior({
  name: 'Input',
  selector: (node) =>
    node.componentName === 'Field' && node.props['x-component'] === 'Input',
  designerProps: {
    propsSchema: {
      type: 'object',
      $namespace: 'Field',
      properties: {
        'field-properties': {
          type: 'void',
          'x-component': 'CollapseItem',
          title: 'Field Properties',
          properties: {
            title: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input',
            },
            hidden: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Switch',
            },
            default: {
              'x-decorator': 'FormItem',
              'x-component': 'ValueInput',
            },
            test: {
              type: 'void',
              title: 'Test',
              'x-decorator': 'FormItem',
              'x-component': 'DrawerSetter',
              'x-component-props': {
                text: 'Open Drawer',
              },
              properties: {
                test: {
                  type: 'string',
                  title: 'Test Input',
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                },
              },
            },
          },
        },
        'component-styles': {
          type: 'void',
          title: 'Styles',
          'x-component': 'CollapseItem',
          properties: {
            'style.width': {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'SizeInput',
            },
            'style.height': {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'SizeInput',
            },
            'style.display': {
              'x-component': 'DisplayStyleSetter',
            },
            'style.background': {
              'x-component': 'BackgroundStyleSetter',
            },
            'style.boxShadow': {
              'x-component': 'BoxShadowStyleSetter',
            },
            'style.font': {
              'x-component': 'FontStyleSetter',
            },
            'style.margin': {
              'x-component': 'BoxStyleSetter',
            },
            'style.padding': {
              'x-component': 'BoxStyleSetter',
            },
            'style.borderRadius': {
              'x-component': 'BorderRadiusStyleSetter',
            },
            'style.border': {
              'x-component': 'BorderStyleSetter',
            },
          },
        },
      },
    },
  },
  designerLocales: {
    'en-US': {
      title: 'Input',
      settings: {
        title: 'Title',
        hidden: 'Hidden',
        default: 'Default Value',
        style: {
          width: 'Width',
          height: 'Height',
          display: 'Display',
          background: 'Background',
          boxShadow: 'Box Shadow',
          font: 'Font',
          margin: 'Margin',
          padding: 'Padding',
          borderRadius: 'Border Radius',
          border: 'Border',
        },
      },
    },
  },
})

const CardBehavior = createBehavior({
  name: 'Card',
  selector: 'Card',
  designerProps: {
    droppable: true,
  },
  designerLocales: {
    'en-US': {
      title: 'Card',
    },
  },
})

GlobalRegistry.setDesignerBehaviors([RootBehavior, InputBehavior, CardBehavior])

const Input = createResource({
  title: {
    'en-US': 'Input',
  },
  icon: 'InputSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        title: 'Input',
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
    },
  ],
})

const Card = createResource({
  title: {
    'en-US': 'Card',
  },
  icon: 'CardSource',
  elements: [
    {
      componentName: 'Card',
      props: {
        title: 'Card',
      },
    },
  ],
})

GlobalRegistry.registerDesignerLocales({
  'en-US': {
    sources: {
      Inputs: 'Inputs',
      Displays: 'Displays',
      Feedbacks: 'Feedbacks',
    },
  },
})

const Logo: React.FC = () => (
  <div style={{ display: 'flex', alignItems: 'center', fontSize: 14 }}>
    <IconWidget
      infer="Logo"
      style={{ margin: 10, height: 24, width: 'auto' }}
    />
  </div>
)

const Actions = observer(() => {
  useEffect(() => {
    GlobalRegistry.setDesignerLanguage('en-us')
  }, [])
  return (
    <Space style={{ marginRight: 10 }}>
      <Button href="https://github.com/kapelan/designable" target="_blank">
        <GithubOutlined />
        Github
      </Button>
      <Button>Save</Button>
      <Button type="primary">Publish</Button>
    </Space>
  )
})

const engine = createDesigner()
const App = () => {
  return (
    <Designer engine={engine}>
      <Workbench>
        <StudioPanel logo={<Logo />} actions={<Actions />}>
          <CompositePanel>
            <CompositePanel.Item title="panels.Component" icon="Component">
              <ResourceWidget title="sources.Inputs" sources={[Input, Card]} />
              <ResourceWidget
                title="sources.Displays"
                sources={[Input, Card]}
              />
              <ResourceWidget
                title="sources.Feedbacks"
                sources={[Input, Card]}
              />
            </CompositePanel.Item>
            <CompositePanel.Item title="panels.OutlinedTree" icon="Outline">
              <OutlineTreeWidget />
            </CompositePanel.Item>
            <CompositePanel.Item title="panels.History" icon="History">
              <HistoryWidget />
            </CompositePanel.Item>
          </CompositePanel>
          <Workspace id="form-1">
            <WorkspacePanel>
              <ToolbarPanel>
                <DesignerToolsWidget />
                <ViewToolsWidget />{' '}
              </ToolbarPanel>
              <ViewportPanel>
                <ViewPanel type="DESIGNABLE">
                  {() => (
                    <Sandbox
                      jsAssets={[
                        'https://unpkg.com/moment/min/moment-with-locales.js',
                        'https://unpkg.com/react@18/umd/react.production.min.js',
                        'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
                        './sandbox.bundle.js',
                      ]}
                    />
                  )}
                </ViewPanel>
                <ViewPanel type="JSONTREE">
                  {() => {
                    return (
                      <div style={{ overflow: 'hidden', height: '100%' }}>
                        <MonacoInput
                          language="javascript"
                          helpCode="//hello world"
                          defaultValue={`<div><div>123123<div>123123<div>123123<div>123123</div></div></div></div></div>`}
                        />
                      </div>
                    )
                  }}
                </ViewPanel>
              </ViewportPanel>
            </WorkspacePanel>
          </Workspace>
          <Workspace id="form-2">
            <WorkspacePanel>
              <ToolbarPanel>
                <DesignerToolsWidget />
                <ViewToolsWidget />{' '}
              </ToolbarPanel>
              <ViewportPanel>
                <ViewPanel type="DESIGNABLE">
                  {() => (
                    <Sandbox
                      jsAssets={[
                        'https://unpkg.com/moment/min/moment-with-locales.js',
                        'https://unpkg.com/react@18/umd/react.production.min.js',
                        'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
                        './sandbox.bundle.js',
                      ]}
                    />
                  )}
                </ViewPanel>
                <ViewPanel type="JSONTREE">
                  {() => {
                    return (
                      <div style={{ overflow: 'hidden', height: '100%' }}>
                        <MonacoInput
                          language="javascript"
                          helpCode="//hello world"
                          defaultValue={`<div><div>123123<div>123123<div>123123<div>123123</div></div></div></div></div>`}
                        />
                      </div>
                    )
                  }}
                </ViewPanel>
              </ViewportPanel>
            </WorkspacePanel>
          </Workspace>
          <SettingsPanel title="panels.PropertySettings">
            {/* Configure uploadAction with your own upload endpoint */}
            <SettingsForm uploadAction="" />
          </SettingsPanel>
        </StudioPanel>
      </Workbench>
    </Designer>
  )
}

createRoot(document.getElementById('root')!).render(<App />)
