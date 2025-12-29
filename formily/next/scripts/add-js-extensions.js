#!/usr/bin/env node
/**
 * Post-build script to add .js extensions to relative imports in compiled output
 * This is needed because:
 * - TypeScript source files use imports without extensions (for Vite compatibility)
 * - But Node.js ES modules require .js extensions in the compiled output
 */

import { readdir, readFile, writeFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distPath = join(__dirname, '../dist')

async function addJsExtensions(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    
    if (entry.isDirectory()) {
      await addJsExtensions(fullPath)
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      let content = await readFile(fullPath, 'utf-8')
      
      // Add .js extension to relative imports without extension
      content = content.replace(
        /from ['"](\.\/.+?)(?<!\.js)['"]/g,
        (match, path) => {
          // Skip if already has .js extension
          if (path.endsWith('.js')) return match
          return `from '${path}.js'`
        }
      )
      
      await writeFile(fullPath, content, 'utf-8')
    }
  }
}

addJsExtensions(distPath)
  .then(() => console.log('✓ Added .js extensions to compiled output'))
  .catch((err) => {
    console.error('Error adding .js extensions:', err)
    process.exit(1)
  })
