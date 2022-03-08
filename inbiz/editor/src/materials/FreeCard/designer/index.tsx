import { DnFC } from '@inbiz/react';
import { createBehavior, createResource } from '@inbiz/core';
import { FreeCard as PreviewCard } from '../preview';
import { FreeCard as FreeCardLocale } from './locale';

export const FreeCard: DnFC<any> = (props) => {
  return <PreviewCard {...props}></PreviewCard>;
};
FreeCard.Behavior = createBehavior({
  name: 'FreeCard',
  selector: 'FreeCard',
  designerProps: {
    droppable: true,
    resizable: {
      width(node, element) {
        const width = Number(node.props?.style?.width ?? element.getBoundingClientRect().width);
        return {
          plus: () => {
            node.props = node.props || {};
            node.props.style = node.props.style || {};
            node.props.style.width = width + 10;
          },
          minus: () => {
            node.props = node.props || {};
            node.props.style = node.props.style || {};
            node.props.style.width = width - 10;
          },
        };
      },
      height(node, element) {
        const height = Number(node.props?.style?.height ?? element.getBoundingClientRect().height);
        return {
          plus: () => {
            node.props = node.props || {};
            node.props.style = node.props.style || {};
            node.props.style.height = height + 10;
          },
          minus: () => {
            node.props = node.props || {};
            node.props.style = node.props.style || {};
            node.props.style.height = height - 10;
          },
        };
      },
    },
    translatable: {
      x(node, element, diffX) {
        const left = parseInt(node.props?.style?.left ?? element?.style.left) || 0;
        const rect = element.getBoundingClientRect();
        return {
          translate: () => {
            node.props = node.props || {};
            node.props.style = node.props.style || {};
            node.props.style.position = 'absolute';
            node.props.style.width = rect.width;
            node.props.style.height = rect.height;
            node.props.style.left = left + parseInt(String(diffX)) + 'px';
          },
        };
      },
      y(node, element, diffY) {
        const top = parseInt(node.props?.style?.top ?? element?.style.top) || 0;
        const rect = element.getBoundingClientRect();
        return {
          translate: () => {
            node.props = node.props || {};
            node.props.style = node.props.style || {};
            node.props.style.position = 'absolute';
            node.props.style.width = rect.width;
            node.props.style.height = rect.height;
            node.props.style.top = top + parseInt(String(diffY)) + 'px';
          },
        };
      },
    },
  },
  designerLocales: FreeCardLocale,
});

FreeCard.Resource = createResource({
  icon: 'CardSource',
  title: {
    'zh-CN': '自由卡片',
    'en-US': 'FreeCard',
  },
  elements: [
    {
      componentName: 'FreeCard',
      props: {
        type: 'void',
        'x-component': 'Field',
      },
    },
  ],
  // elements: [
  //     {
  //         componentName: 'FreeCard'
  //     },
  // ],
});
