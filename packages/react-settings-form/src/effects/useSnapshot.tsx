import { Operation } from '@designable/core'
import { onFieldInputValueChange } from '@formily/core'

export const useSnapshot = (operation: Operation) => {
  let timeRequest = null
  onFieldInputValueChange('*', () => {
    clearTimeout(timeRequest)
    timeRequest = setTimeout(() => {
      operation.snapshot()
    }, 1000)
  })
}
