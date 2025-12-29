#!/usr/bin/env node

import { readdir, readFile, writeFile, stat } from 'fs/promises'
import { join, dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distPath = join(__dirname, '../dist')

async function pathExists(p) {
  try {
    await stat(p)
    return true
  } catch {
    return false
  }
}

async function addJsExtensions(dir) {
  const entries = await readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)

    if (entry.isDirectory()) {
      await addJsExtensions(fullPath)
      continue
    }

    if (!entry.isFile() || !entry.name.endsWith('.js')) continue

    let content = await readFile(fullPath, 'utf-8')

    content = await replaceAsync(
      content,
      /from\s+['"](\.\/[^'"]+)['"]/g,
      async (match, importPath) => {
        if (importPath.endsWith('.js')) return match

        const resolved = resolve(dirname(fullPath), importPath)
        const fileJs = `${resolved}.js`
        const indexJs = join(resolved, 'index.js')

        if (await pathExists(fileJs)) {
          return `from '${importPath}.js'`
        }

        if (await pathExists(indexJs)) {
          return `from '${importPath}/index.js'`
        }

        return match
      }
    )

    await writeFile(fullPath, content, 'utf-8')
  }
}

/**
 * Async replace helper
 */
async function replaceAsync(str, regex, asyncFn) {
  const matches = []
  str.replace(regex, (...args) => {
    matches.push(asyncFn(...args))
    return ''
  })

  const replacements = await Promise.all(matches)
  let i = 0

  return str.replace(regex, () => replacements[i++])
}

addJsExtensions(distPath)
  .then(() => console.log('✓ Added correct ESM .js extensions'))
  .catch((err) => {
    console.error('Error adding .js extensions:', err)
    process.exit(1)
  })
