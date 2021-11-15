import { createLocales } from '@designable/core'

export const Upload = {
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
  'en-US': {
    title: 'Upload',
    settings: {
      'x-component-props': {
        accept: 'Accept',
        action: 'Upload Address',
        data: 'Data',
        directory: 'Support Upload Directory',
        headers: 'Headers',
        listType: { title: 'List Type', dataSource: ['Text', 'Image', 'Card'] },
        multiple: 'Multiple',
        name: 'Name',
        openFileDialogOnClick: 'Open File Dialog On Click',
        showUploadList: 'Show Upload List',
        withCredentials: 'withCredentials',
        maxCount: 'Max Count',
        method: 'Method',
        textContent: 'Text Content',
      },
    },
  },
  'ko-KR': {
    title: '업로드',
    settings: {
      'x-component-props': {
        accept: '승인',
        action: '업로드 주소',
        data: '데이터',
        directory: '디렉터리 업로드 지원',
        headers: '헤더',
        listType: {
          title: '리스트 타입',
          dataSource: ['텍스트', '이미지', '카드'],
        },
        multiple: '여러개',
        name: '이름',
        openFileDialogOnClick: '눌러서 파일 다이얼로그 열기',
        showUploadList: '업로드 목록 표시',
        withCredentials: '자격 증명 포함',
        maxCount: '최대 개수',
        method: '메서드',
        textContent: '텍스트 내용',
      },
    },
  },
}

export const UploadDragger = createLocales(Upload, {
  'zh-CN': {
    title: '拖拽上传',
    settings: {
      'x-component-props': {},
    },
  },
  'en-US': {
    title: 'UploadDragger',
    settings: {
      'x-component-props': {},
    },
  },
  'ko-KR': {
    title: '드래그로 업로드',
    settings: {
      'x-component-props': {},
    },
  },
})
