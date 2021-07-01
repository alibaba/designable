import * as Monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { parseExpression } from '@babel/parser'
import { language } from './highlight'
import { loadPrettier } from './format'

export const registerExpression = (
  languageId: 'javascript.expression' | 'typescript.expression' | (string & {}),
  editor: Monaco.editor.IStandaloneCodeEditor,
  monaco: typeof Monaco
) => {
  if (
    languageId !== 'javascript.expression' &&
    languageId !== 'typescript.expression'
  )
    return
  monaco.languages.register({ id: languageId })
  monaco.languages.setMonarchTokensProvider(
    languageId,
    language as Monaco.languages.IMonarchLanguage
  )

  loadPrettier().then(({ format }) => {
    monaco.languages.registerDocumentFormattingEditProvider(languageId, {
      provideDocumentFormattingEdits(model) {
        return [
          {
            text: format?.(model.getValue(), {
              semi: false,
              parser(text) {
                return parseExpression(text)
              },
            }),
            range: model.getFullModelRange(),
          },
        ]
      },
    })
  })

  const validate = () => {
    const currentLanguage = editor.getModel()['_languageIdentifier'].language
    if (currentLanguage !== languageId) return
    try {
      parseExpression(editor.getValue(), {
        plugins: ['typescript'],
      })
      monaco.editor.setModelMarkers(editor.getModel(), languageId, [])
    } catch (e) {
      monaco.editor.setModelMarkers(editor.getModel(), languageId, [
        {
          code: '1003',
          severity: 8,
          startLineNumber: e.loc.line,
          startColumn: e.loc.column,
          endLineNumber: e.loc.line,
          endColumn: e.loc.column,
          message: e.message,
        },
      ])
    }
  }

  let requestId = null
  editor.onDidChangeModelContent(() => {
    clearTimeout(requestId)
    requestId = setTimeout(validate, 1000)
  })
}
