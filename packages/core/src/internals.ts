import { each, isPlainObj } from '@designable/shared'
import { globalThisPolyfill } from '@designable/shared'

export const lowerSnake = (str: string) => {
  return String(str).replace(/\s+/g, '_').toLocaleLowerCase()
}

export const mergeLocales = (target: any, source: any) => {
  if (isPlainObj(target) && isPlainObj(source)) {
    each(source, function (value, key) {
      const token = lowerSnake(key)
      const messages = mergeLocales(target[key] || target[token], value)
      target[token] = messages
    })
    return target
  } else if (isPlainObj(source)) {
    const result = Array.isArray(source) ? [] : {}
    each(source, function (value, key) {
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
    globalThisPolyfill.navigator['browserlanguage'] ||
    globalThisPolyfill.navigator?.language ||
    'en'
  )
}
