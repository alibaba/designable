#!/usr/bin/env node
/**
 * Script to remove .js extensions from TypeScript imports in source files
 */

import { readdir, readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const srcPath = join(__dirname, '../src')

let filesProcessed = 0
let importsFixed = 0

async function removeJsExtensions(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    
    if (entry.isDirectory()) {
      await removeJsExtensions(fullPath)
    } else if (entry.isFile() && entry.name.endsWith('.ts')) {
      let content = await readFile(fullPath, 'utf-8')
      const originalContent = content
      
      // Remove .js extension from relative imports (both single and double quotes)
      content = content.replace(
        /(from\s+['"])(\.\/.+?)\.js(['"])/g,
        (match, before, path, after) => {
          importsFixed++
          return `${before}${path}${after}`
        }
      )
      
      // Remove .js extension from import statements
      content = content.replace(
        /(import\s+.*\s+from\s+['"])(\.\/.+?)\.js(['"])/g,
        (match, before, path, after) => {
          importsFixed++
          return `${before}${path}${after}`
        }
      )
      
      if (content !== originalContent) {
        await writeFile(fullPath, content, 'utf-8')
        filesProcessed++
      }
    }
  }
}

removeJsExtensions(srcPath)
  .then(() => {
    console.log(`✓ Processed ${filesProcessed} files`)
    console.log(`✓ Fixed ${importsFixed} imports`)
  })
  .catch((err) => {
    console.error('Error removing .js extensions:', err)
    process.exit(1)
  })
