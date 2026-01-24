import { createLocales } from '@sulesky/core'

export const Upload = {
  
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
        textContent: 'Text Content'
}
}
}
}

export const UploadDragger = createLocales(Upload, {
  
  'en-US': {
    title: 'UploadDragger',
    settings: {
      'x-component-props': {}
}
}
})
