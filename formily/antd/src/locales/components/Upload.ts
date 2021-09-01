import { createLocales } from '@designable/core'
import { Field } from './Field'

export const Upload = createLocales(Field, {
  'zh-CN': {
    title: '上传',
    settings: {
      'x-component-props': {
        accept: '可接受类型',
        action: '上传地址',
        data: '数据/参数',
        directory: '支持上传目录',
        headers: '请求头',
        listType: { title: '列表类型', dataSource: ['文本', '图片', '卡片'] },
        multiple: '多选模式',
        name: '字段标识',
        openFileDialogOnClick: {
          title: '点击打开文件对话框',
          tooltip: '点击打开文件对话框',
        },
        showUploadList: '是否展示文件列表',
        withCredentials: '携带Cookie',
        maxCount: '最大数量',
        method: '方法',
        textContent: '上传文案',
      },
    },
  },
  'en-US': {},
})

export const UploadDragger = createLocales(Upload, {
  'zh-CN': {
    title: '上传',
    settings: {
      'x-component-props': {},
    },
  },
  'en-US': {},
})
