import { parse } from '@babel/parser'
import { getNpmCDNRegistry, validateCDNUrl } from '../../registry'

interface IPrettierModule {
  default: {
    format(
      source: string,
      options: {
        semi?: boolean
        parser?: (code: string) => any
      },
    ): string
  }
}

const cache: { prettier: Promise<IPrettierModule> } = {
  prettier: null,
}

const loadPrettier = async (): Promise<IPrettierModule> => {
  const cdnUrl = `${getNpmCDNRegistry()}/prettier@2.x/esm/standalone.mjs`

  // Validate the URL is from an allowed CDN before loading
  if (!validateCDNUrl(cdnUrl)) {
    throw new Error(
      `Security error: CDN URL "${cdnUrl}" is not in the allowlist. ` +
        `Use setNpmCDNRegistry() with an allowed CDN host.`,
    )
  }

  // Use dynamic import - this is safe because we validated the URL
  // Note: The CDN URL must be a full URL for dynamic import to work
  return import(/* webpackIgnore: true */ cdnUrl)
}

export const format = async (language: string, source: string) => {
  cache.prettier = cache.prettier || loadPrettier()

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
