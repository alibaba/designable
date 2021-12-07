import { useLayout } from './useLayout'

export const usePrefix = (after = '') => {
  return useLayout()?.prefixCls + after
}
