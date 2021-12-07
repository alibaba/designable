import { useContext } from 'react'
import { DesignerLayoutContext } from '../context'
import { IDesignerLayoutContext } from '../types'

export const useLayout = (): IDesignerLayoutContext => {
  return window['__DESIGNABLE_LAYOUT__'] || useContext(DesignerLayoutContext)
}
