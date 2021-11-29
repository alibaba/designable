import { useContext } from 'react'
import { DesignerLayoutContext } from '../context'
import { IDesignerLayoutContext } from '../types'

export const usePosition = (): IDesignerLayoutContext['position'] => {
  return useContext(DesignerLayoutContext)?.position
}
