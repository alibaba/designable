import { useContext } from 'react'
import { DesignerContext } from '../context'
import { IDesignerContext } from '../types'

export const useTheme = (): IDesignerContext['theme'] => {
  return window['__DESINGER_THEME__'] || useContext(DesignerContext)?.theme
}
