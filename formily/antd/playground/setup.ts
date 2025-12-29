import { GlobalRegistry } from '@designable/core';
import { Engine } from '@designable/core'
import { createDesigner, Shortcut, KeyCode} from '@designable/core';
import { saveSchema } from "./service"

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

export const components = {
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
};

const locales = {
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
  }

export const inputs = [
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
              // ObjectContainer,
            ]

export const layouts =[
              Card,
              FormGrid,
              FormTab,
              FormLayout,
              FormCollapse,
              Space,
            ]
export const arrays = [
              ArrayCards,
              ArrayTable,
            ]
export const displays = [
              Text,
            ]

            GlobalRegistry.registerDesignerLocales(locales);
GlobalRegistry.registerDesignerBehaviors(components)

const  designer = createDesigner({
        rootComponentName: 'Form',
        // designableFormName: 'Form',
        shortcuts: [
          new Shortcut({
            codes: [
              [KeyCode.Meta, KeyCode.S],
              [KeyCode.Control, KeyCode.S],
            ],
            handler(ctx) {
              console.log('Shortcut: Save Schema');
              saveSchema(ctx.engine);
            },
          }),
        ],
})
     
export { designer };
