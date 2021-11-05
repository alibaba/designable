import { useContext } from 'react'
import { DesignerLayoutContext } from '../context'
import { IDesignerLayoutContext } from '../types'

export const useTheme = (): IDesignerLayoutContext['theme'] => {
  return (
    window['__DESINGER_THEME__'] || useContext(DesignerLayoutContext)?.theme
  )
}
