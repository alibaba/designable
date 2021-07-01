import { parseExpression, parse } from '@babel/parser'
import { loadScript } from '../../shared/loadScript'

loadScript({
  package: 'prettier@2.3.2',
  entry: 'standalone.min.js',
  root: 'prettier',
})

export const loadPrettier = () =>
  loadScript({
    package: 'prettier@2.3.2',
    entry: 'standalone.min.js',
    root: 'prettier',
  })

export const format = async (code: string, language: string) => {
  const lang = String(language).toLocaleLowerCase()
  if (lang === 'json') {
    return JSON.stringify(JSON.parse(code), null, 2)
  }
  if (lang === 'javascript' || lang === 'typescript') {
    return loadPrettier().then(({ format }) => {
      return format(code, {
        semi: false,
        parser(text) {
          return parse(text, {
            plugins: ['jsx'],
          })
        },
      })
    })
  }
  if (lang === 'javascript.expression' || lang === 'typescript.expression') {
    return loadPrettier().then(({ format }) => {
      return format(code, {
        semi: false,
        parser(text) {
          return parseExpression(text, {
            plugins: ['jsx'],
          })
        },
      })
    })
  }
  return code
}
