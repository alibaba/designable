import { Operation } from '@designable/core'
import { onFieldInputValueChange } from '@formily/core'

let timeRequest: NodeJS.Timeout | null = null

export const useSnapshot = (operation: Operation) => {
  onFieldInputValueChange('*', () => {
    if (timeRequest !== null) clearTimeout(timeRequest)
    timeRequest = setTimeout(() => {
      operation.snapshot('update:node:props')
    }, 1000)
  })
}
