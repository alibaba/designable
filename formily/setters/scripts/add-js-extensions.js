#!/usr/bin/env node

import { readdir, readFile, writeFile, stat } from 'fs/promises'
import { join, dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distPath = join(__dirname, '../dist')

async function exists(p) {
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
      /(import|export)\s+[^'"]*from\s+['"](\.\/[^'"]+)['"]/g,
      async (match, stmt, importPath) => {
        if (importPath.endsWith('.js')) return match

        const abs = resolve(dirname(fullPath), importPath)

        if (await exists(abs + '.js')) {
          return match.replace(importPath, `${importPath}.js`)
        }

        if (await exists(join(abs, 'index.js'))) {
          return match.replace(importPath, `${importPath}/index.js`)
        }

        return match
      }
    )

    await writeFile(fullPath, content, 'utf-8')
  }
}

async function replaceAsync(str, regex, fn) {
  const promises = []
  str.replace(regex, (...args) => {
    promises.push(fn(...args))
    return ''
  })
  const results = await Promise.all(promises)
  let i = 0
  return str.replace(regex, () => results[i++])
}

addJsExtensions(distPath)
  .then(() => console.log('✓ Fixed import/export ESM paths'))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
