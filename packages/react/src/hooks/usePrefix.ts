import { useContext } from 'react'
import { DesignerLayoutContext } from '../context'

export const usePrefix = (after = '') => {
  return useContext(DesignerLayoutContext)?.prefixCls + after
}
