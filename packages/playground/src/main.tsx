import React, { useMemo, useState } from 'react'
import ReactDOM from 'react-dom'
import {
  Designer,
  IconWidget,
  ToolbarWidget,
  Workspace,
  Viewport,
  OutlineTreeWidget,
  DragSourceWidget,
  MainPanel,
  CompositePanel,
  WorkspacePanel,
  ToolbarPanel,
  ViewportPanel,
  SettingsPanel,
} from '@designable/react'
import { SettingsForm } from '@designable/react-settings-form'
import { observer } from '@formily/react'
import { createDesigner, registry } from '@designable/core'
import { Content } from './content'
import { Space, Button, Radio } from 'antd'
import { GithubOutlined } from '@ant-design/icons'
//import { Sandbox } from '@designable/react-sandbox'
import 'antd/dist/antd.less'
import './theme.less'

registry.registerDesignerProps({
  Root: {
    title: 'components.Root',
  },
  Field: (node) => ({
    title: `components.${node.props['x-component']}`,
    draggable: true,
    inlineLayout: true,
    propsSchema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Input',
        },
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
        hidden: {
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
        },
        default: {
          'x-decorator': 'FormItem',
          'x-component': 'ValueInput',
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
  }),
  Card: {
    title: 'components.Card',
    droppable: true,
    inlineChildrenLayout: true,
    allowAppend: (target, sources) =>
      sources.every((node) => node.componentName === 'Field'),
  },
})

registry.registerSourcesByGroup('form', [
  {
    componentName: 'Field',
    props: {
      title: '输入框',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
    },
  },
  {
    componentName: 'Card',
    props: {
      title: '卡片',
      type: 'void',
      'x-decorator': 'FormItem',
      'x-component': 'Card',
    },
  },
])

registry.registerDesignerLocales({
  'zh-CN': {
    sources: {
      Inputs: '输入控件',
      Displays: '展示控件',
      Feedbacks: '反馈控件',
    },
    components: {
      Root: '表单',
      Input: '输入框',
      Card: '卡片',
    },
    settings: {
      title: '标题',
      hidden: '是否隐藏',
      default: '默认值',
      style: {
        width: '宽度',
        height: '高度',
        display: '展示',
        background: '背景',
        boxShadow: '阴影',
        font: '字体',
        margin: '外边距',
        padding: '内边距',
        borderRadius: '圆角',
        border: '边框',
      },
    },
  },
  'en-US': {
    sources: {
      Inputs: 'Inputs',
      Displays: 'Displays',
      Feedbacks: 'Feedbacks',
    },
    components: {
      Root: 'Form',
      Input: 'Input',
      Card: 'Card',
    },
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
})

const Logo: React.FC = () => (
  <div style={{ display: 'flex', alignItems: 'center', fontSize: 14 }}>
    <IconWidget
      infer="Logo"
      style={{ margin: 10, height: 24, width: 'auto' }}
    />
  </div>
)

const Actions = observer(() => (
  <Space style={{ marginRight: 10 }}>
    <Radio.Group
      value={registry.getDesignerLanguage()}
      optionType="button"
      options={[
        { label: 'Engligh', value: 'en-US' },
        { label: '简体中文', value: 'zh-CN' },
      ]}
      onChange={(e) => {
        registry.setDesignerLanguage(e.target.value)
      }}
    />
    <Button href="https://github.com/alibaba/designable" target="_blank">
      <GithubOutlined />
      Github
    </Button>
    <Button>保存</Button>
    <Button type="primary">发布</Button>
  </Space>
))

const App = () => {
  const [view, setView] = useState('design')
  const engine = useMemo(() => createDesigner(), [])

  return (
    <Designer engine={engine}>
      <MainPanel logo={<Logo />} actions={<Actions />}>
        <CompositePanel>
          <CompositePanel.Item
            title="panels.Component"
            icon={<IconWidget infer="Component" />}
          >
            <DragSourceWidget title="sources.Inputs" name="form" />
            <DragSourceWidget title="sources.Displays" name="form" />
            <DragSourceWidget title="sources.Feedbacks" name="form" />
          </CompositePanel.Item>
          <CompositePanel.Item
            title="panels.OutlinedTree"
            icon={<IconWidget infer="Outline" />}
          >
            <OutlineTreeWidget />
          </CompositePanel.Item>
        </CompositePanel>
        <Workspace id="form">
          <WorkspacePanel>
            <ToolbarPanel>
              <ToolbarWidget />
              <Button.Group>
                <Button
                  disabled={view === 'design'}
                  onClick={() => {
                    setView('design')
                  }}
                  size="small"
                >
                  <IconWidget infer="Design" />
                </Button>
                <Button
                  disabled={view === 'json'}
                  onClick={() => {
                    setView('json')
                  }}
                  size="small"
                >
                  <IconWidget infer="JSON" />
                </Button>
                <Button
                  disabled={view === 'code'}
                  onClick={() => {
                    setView('code')
                  }}
                  size="small"
                >
                  <IconWidget infer="Code" />
                </Button>
              </Button.Group>
            </ToolbarPanel>
            <ViewportPanel>
              {view === 'json' && <div>JSON 输入</div>}
              {view === 'design' && (
                <Viewport>
                  {/* <Sandbox
                    jsAssets={['./runtime.bundle.js', './sandbox.bundle.js']}
                  /> */}
                  <Content />
                </Viewport>
              )}
            </ViewportPanel>
          </WorkspacePanel>
        </Workspace>
        <SettingsPanel title="panels.PropertySettings">
          <SettingsForm uploadAction="https://www.mocky.io/v2/5cc8019d300000980a055e76" />
        </SettingsPanel>
      </MainPanel>
    </Designer>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
