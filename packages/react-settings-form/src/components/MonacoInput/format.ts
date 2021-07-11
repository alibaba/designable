import { parse } from '@babel/parser'

interface IPrettierModule {
  default: {
    format(
      source: string,
      options: {
        semi?: boolean
        parser?: (code: string) => any
      }
    ): string
  }
}

const prettier: Promise<IPrettierModule> = new Function(
  'return import("https://cdn.jsdelivr.net/npm/prettier@2.3.2/esm/standalone.mjs")'
)()

export const format = async (language: string, source: string) => {
  return prettier.then((module) => {
    if (
      language === 'javascript.expression' ||
      language === 'typescript.expression'
    ) {
      return source
    }
    if (/(?:javascript|typescript)/gi.test(language)) {
      return module.default.format(source, {
        semi: false,
        parser(text) {
          return parse(text, {
            sourceType: 'module',
            plugins: ['typescript', 'jsx'],
          })
        },
      })
    }
    if (language === 'json') {
      return JSON.stringify(JSON.parse(source), null, 2)
    }
    return source
  })
}
