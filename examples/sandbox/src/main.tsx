import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import {
  Designer,
  IconWidget,
  Workbench,
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
} from '@designable/react'
import { SettingsForm, MonacoInput } from '@designable/react-settings-form'
import { observer } from '@formily/react'
import {
  createDesigner,
  createResource,
  createBehavior,
  GlobalRegistry,
} from '@designable/core'
import { Space, Button, Radio } from 'antd'
import { GithubOutlined } from '@ant-design/icons'
import { Sandbox } from '@designable/react-sandbox'
import 'antd/dist/antd.less'

const RootBehavior = createBehavior({
  name: 'Root',
  selector: 'Root',
  designerProps: {
    droppable: true,
  },
  designerLocales: {
    'zh-CN': {
      title: '根组件',
    },
    'en-US': {
      title: 'Root',
    },
    'ko-KR': {
      title: '루트',
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
          title: '字段属性',
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
              title: '测试',
              'x-decorator': 'FormItem',
              'x-component': 'DrawerSetter',
              'x-component-props': {
                text: '打开抽屉',
              },
              properties: {
                test: {
                  type: 'string',
                  title: '测试输入',
                  'x-decorator': 'FormItem',
                  'x-component': 'Input',
                },
              },
            },
          },
        },

        'component-styles': {
          type: 'void',
          title: '样式',
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
    'zh-CN': {
      title: '输入框',
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
    'ko-KR': {
      title: '입력',
      settings: {
        title: '텍스트',
        hidden: '숨김 여부',
        default: '기본 설정 값',
        style: {
          width: '너비',
          height: '높이',
          display: '디스플레이',
          background: '배경',
          boxShadow: '그림자 박스',
          font: '폰트',
          margin: '마진',
          padding: '패딩',
          borderRadius: '테두리 굴곡',
          border: '테두리',
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
    'zh-CN': {
      title: '卡片',
    },
    'en-US': {
      title: 'Card',
    },
    'ko-KR': {
      title: '카드',
    },
  },
})

GlobalRegistry.setDesignerBehaviors([RootBehavior, InputBehavior, CardBehavior])

const Input = createResource({
  title: {
    'zh-CN': '输入框',
    'en-US': 'Input',
    'ko-KR': '입력 상자',
  },
  icon: 'InputSource',
  elements: [
    {
      componentName: 'Field',
      props: {
        title: '输入框',
        type: 'string',
        'x-decorator': 'FormItem',
        'x-component': 'Input',
      },
    },
  ],
})

const Card = createResource({
  title: {
    'zh-CN': '卡片',
    'en-US': 'Card',
    'ko-KR': '카드 상자',
  },
  icon: 'CardSource',
  elements: [
    {
      componentName: 'Card',
      props: {
        title: '卡片',
      },
    },
  ],
})

GlobalRegistry.registerDesignerLocales({
  'zh-CN': {
    sources: {
      Inputs: '输入控件',
      Displays: '展示控件',
      Feedbacks: '反馈控件',
    },
  },
  'en-US': {
    sources: {
      Inputs: 'Inputs',
      Displays: 'Displays',
      Feedbacks: 'Feedbacks',
    },
  },
  'ko-KR': {
    sources: {
      Inputs: '입력',
      Displays: '디스플레이',
      Feedbacks: '피드백',
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
  const supportLocales = ['zh-cn', 'en-us', 'ko-kr']
  useEffect(() => {
    if (!supportLocales.includes(GlobalRegistry.getDesignerLanguage())) {
      GlobalRegistry.setDesignerLanguage('zh-cn')
    }
  }, [])
  return (
    <Space style={{ marginRight: 10 }}>
      <Radio.Group
        value={GlobalRegistry.getDesignerLanguage()}
        optionType="button"
        options={[
          { label: 'English', value: 'en-us' },
          { label: '简体中文', value: 'zh-cn' },
          { label: '한국어', value: 'ko-kr' },
        ]}
        onChange={(e) => {
          GlobalRegistry.setDesignerLanguage(e.target.value)
        }}
      />
      <Button href="https://github.com/alibaba/designable" target="_blank">
        <GithubOutlined />
        Github
      </Button>
      <Button>保存</Button>
      <Button type="primary">发布</Button>
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
          <WorkspacePanel>
            <ToolbarPanel>
              <DesignerToolsWidget />
              <ViewToolsWidget />
            </ToolbarPanel>
            <ViewportPanel>
              <ViewPanel type="DESIGNABLE">
                {() => (
                  <Sandbox
                    jsAssets={[
                      'https://unpkg.com/moment/min/moment-with-locales.js',
                      'https://unpkg.com/react/umd/react.production.min.js',
                      'https://unpkg.com/react-dom/umd/react-dom.production.min.js',
                      'https://unpkg.com/antd/dist/antd-with-locales.min.js',
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
          <SettingsPanel title="panels.PropertySettings">
            <SettingsForm uploadAction="https://www.mocky.io/v2/5cc8019d300000980a055e76" />
          </SettingsPanel>
        </StudioPanel>
      </Workbench>
    </Designer>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
