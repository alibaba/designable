import { Engine } from './Engine'
import { action, define, observable } from '@formily/reactive'

export enum ScreenType {
  PC = 'PC',
  Responsive = 'Responsive',
  Mobile = 'Mobile',
}

export class Screen {
  type: ScreenType
  scale = 1
  width: number | string = '100%'
  height: number | string = '100%'
  engine: Engine
  background = ''
  flip = false
  constructor(engine: Engine) {
    this.engine = engine
    this.type = engine.props.defaultScreenType
    this.makeObservable()
  }

  makeObservable() {
    define(this, {
      type: observable.ref,
      scale: observable.ref,
      width: observable.ref,
      height: observable.ref,
      flip: observable.ref,
      background: observable.ref,
      setType: action,
      setScale: action,
      setSize: action,
      resetSize: action,
      setBackground: action,
      setFlip: action,
    })
  }

  setType(type: ScreenType) {
    this.type = type
  }

  setScale(scale: number) {
    this.scale = scale
  }

  setSize(width?: number | string, height?: number | string) {
    if (width) {
      this.width = width
    }
    if (height) {
      this.height = height
    }
  }

  resetSize() {
    this.width = '100%'
    this.height = '100%'
  }

  setBackground(background: string) {
    this.background = background
  }

  setFlip(flip: boolean) {
    this.flip = flip
  }
}
