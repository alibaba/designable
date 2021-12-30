import { useContext } from 'react'
import { DesignerLayoutContext } from '../context'
import { IDesignerLayoutContext } from '../types'
import { window } from '@designable/shared'

export const useLayout = (): IDesignerLayoutContext => {
  return window['__DESIGNABLE_LAYOUT__'] || useContext(DesignerLayoutContext)
}
