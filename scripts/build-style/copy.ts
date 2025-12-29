/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { existsSync } from 'fs'
import * as fsExtra from 'fs-extra'
import * as glob from 'glob'

export type CopyBaseOptions = Record<'esStr' | 'libStr', string>

const importLibToEs = async ({
  libStr,
  esStr,
  filename,
}: CopyBaseOptions & { filename: string }) => {
  if (!existsSync(filename)) {
    return Promise.resolve()
  }

  const fileContent: string = (await fsExtra.readFile(filename)).toString()

  return fsExtra.writeFile(
    filename,
    fileContent.replace(new RegExp(libStr, 'g'), esStr)
  )
}

export const runCopy = ({
  resolveForItem,
  ...lastOpts
}: CopyBaseOptions & { resolveForItem?: (filename: string) => unknown }) => {
  return new Promise((resolve, reject) => {
    glob(`./src/**/*`, (err, files) => {
      if (err) {
        return reject(err)
      }

      const all = [] as Promise<unknown>[]

      for (let i = 0; i < files.length; i += 1) {
        const filename = files[i]

        resolveForItem?.(filename)

        if (/\.(less|scss)$/.test(filename)) {
          all.push(fsExtra.copy(filename, filename.replace(/src\//, 'esm/')))
          all.push(fsExtra.copy(filename, filename.replace(/src\//, 'lib/')))

          continue
        }

        if (/\/style.ts$/.test(filename)) {
          importLibToEs({
            ...lastOpts,
            filename: filename.replace(/src\//, 'esm/').replace(/\.ts$/, '.js'),
          })

          continue
        }
      }
    })
  })
}
