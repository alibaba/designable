import { readdir, mkdir, copyFile } from 'fs/promises'
import { join } from 'path'

async function copyLess(src, dest) {
  await mkdir(dest, { recursive: true })
  const entries = await readdir(src, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = join(src, entry.name)
    const destPath = join(dest, entry.name)

    if (entry.isDirectory()) {
      await copyLess(srcPath, destPath)
    } else if (entry.name.endsWith('.less')) {
      await copyFile(srcPath, destPath)
    }
  }
}

copyLess('src', 'dist')
  .then(() => console.log('✓ LESS files copied'))
