import * as Monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { parseExpression } from '@babel/parser'
import { format } from 'prettier/standalone'
import { language } from './highlight'

export const registerExpression = (
  editor: Monaco.editor.IStandaloneCodeEditor,
  monaco: typeof Monaco
) => {
  const languangeId = 'javascript.expression'

  monaco.languages.register({ id: languangeId })
  monaco.languages.setMonarchTokensProvider(
    languangeId,
    language as Monaco.languages.IMonarchLanguage
  )

  monaco.languages.registerDocumentFormattingEditProvider(languangeId, {
    provideDocumentFormattingEdits(model) {
      return [
        {
          text: format(model.getValue(), {
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

  const validate = () => {
    const currentLangunage = editor.getModel()['_languageIdentifier'].language
    if (currentLangunage !== languangeId) return
    try {
      parseExpression(editor.getValue(), {
        plugins: ['typescript'],
      })
      monaco.editor.setModelMarkers(editor.getModel(), languangeId, [])
    } catch (e) {
      monaco.editor.setModelMarkers(editor.getModel(), languangeId, [
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
