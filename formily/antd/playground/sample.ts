import { ISchema } from '@formily/json-schema'


export const formSchema: ISchema = {
  type: 'object',
  'x-component': 'Form',  
  properties: {
    collapse: {
      type: 'void',
      'x-component': 'FormCollapse',
      properties: {
        base: {
          type: 'void',
          'x-component': 'FormCollapse.CollapsePanel',
          properties: {
            title: {
              type: 'string',
              'x-decorator': 'FormItem',
              'x-component': 'Input'
            }
          }
        }
      }
    }
  }
}
