import { DEFAULT_DRIVERS, DEFAULT_EFFECTS, DEFAULT_SHORTCUTS } from './presets'
import { Engine } from './models/Engine'
import { IEngineProps } from './types'
export * from './registry'
export * from './models'
export * from './events'
export * from './types'

export const createDesigner = (props: IEngineProps<Engine> = {}) => {
  const drivers = props.drivers || []
  const effects = props.effects || []
  const shortcuts = props.shortcuts || []
  return new Engine({
    ...props,
    effects: [...effects, ...DEFAULT_EFFECTS],
    drivers: [...drivers, ...DEFAULT_DRIVERS],
    shortcuts: [...shortcuts, ...DEFAULT_SHORTCUTS],
  })
}
