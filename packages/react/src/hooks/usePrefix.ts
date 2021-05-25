import { useContext } from 'react'
import { DesignerContext } from '../context'

export const usePrefix = (after = '') => {
  return useContext(DesignerContext)?.prefixCls + after
}
