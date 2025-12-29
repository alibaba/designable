import { each, isPlainObj } from '@designable/shared'
import { globalThisPolyfill } from '@designable/shared'

export const lowerSnake = (str: string) => {
  return String(str).replace(/\s+/g, '_').toLocaleLowerCase()
}

export const mergeLocales = (target: { [key: string]: any } | any, source: any): any => {
  if (isPlainObj(target) && isPlainObj(source)) {
    each(source, function (value: any, key: string) {
      const token = lowerSnake(key)
      const targetObj = target as { [key: string]: any }
      const messages = mergeLocales(targetObj[key] || targetObj[token], value)
      targetObj[token] = messages
    })
    return target
  } else if (isPlainObj(source)) {
    const result: { [key: string]: any } = Array.isArray(source) ? [] : {}
    each(source, function (value: any, key: string) {
      const messages = mergeLocales(undefined, value)
      result[lowerSnake(key)] = messages
    })
    return result
  }
  return source
}

export const getBrowserLanguage = () => {
  /* istanbul ignore next */
  if (!globalThisPolyfill.navigator) {
    return 'en'
  }
  return (
    (globalThisPolyfill.navigator as any)['browserlanguage'] ||
    globalThisPolyfill.navigator?.language ||
    'en'
  )
}
