import { useContext, useEffect } from 'react'
import { Engine } from '@designable/core'
import { DesignerContext } from '../context'
import { isFn } from '@designable/shared'
export interface IEffects {
  (engine: Engine): void
}

export const useDesigner = (effects?: IEffects): Engine => {
  const designer: Engine =
    window['__DESINGER_ENGINE__'] || useContext(DesignerContext)?.engine
  useEffect(() => {
    if (isFn(effects)) {
      return effects(designer)
    }
  }, [])
  return designer
}
