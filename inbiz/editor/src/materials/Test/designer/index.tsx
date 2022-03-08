import { DnFC } from '@inbiz/react';
import { createBehavior, createResource } from '@inbiz/core';
import { Test as PreviewTest } from '../preview';
import { Test as TestLocale } from './locale';

export const Test: DnFC<any> = (props) => {
  return <PreviewTest {...props}></PreviewTest>;
};
Test.Behavior = createBehavior({
  name: 'Test',
  selector: 'Test',
  designerLocales: TestLocale,
});

Test.Resource = createResource({
  icon: 'CardSource',
  title: {
    'zh-CN': ' 测试组件',
    'en-US': 'test',
  },
  elements: [
    {
      componentName: 'Field',
      props: {
        type: 'void',
        'x-component': 'Test',
      },
    },
  ],
});
