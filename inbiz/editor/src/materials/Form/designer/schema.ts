import { ISchema } from '@formily/react'
import { AllSchemas } from '../../schemas'
import { CSSStyle } from '../../common/CSSStyle'

export const Form: ISchema = {
  type: 'object',
  properties: {
    ...(AllSchemas.FormLayout.properties as any),
    style: CSSStyle,
  },
}
