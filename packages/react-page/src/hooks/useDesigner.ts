import { useContext, useEffect } from 'react'
import { Designer } from '@designable/core'
import { DesignerDesignerContext } from '../context'
import { isFn } from '@designable/shared'
export interface IEffects {
  (designer: Designer): void
}

export const useDesigner = (effects?: IEffects): Designer => {
  const designer: Designer =
    window['__DESIGNABLE_ENGINE__'] || useContext(DesignerDesignerContext)
  useEffect(() => {
    if (isFn(effects)) {
      return effects(designer)
    }
  }, [])
  return designer
}
