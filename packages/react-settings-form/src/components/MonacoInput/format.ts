import { parse } from '@babel/parser'
import { getNpmCDNRegistry } from '../../registry'
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

const cache: { prettier: Promise<IPrettierModule> } = {
  prettier: null,
}

export const format = async (language: string, source: string) => {
  cache.prettier =
    cache.prettier ||
    new Function(
      `return import("${getNpmCDNRegistry()}/prettier@2.x/esm/standalone.mjs")`
    )()
  return cache.prettier.then((module) => {
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
