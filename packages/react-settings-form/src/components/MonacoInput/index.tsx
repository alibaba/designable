import React, { useState, useRef, useEffect } from 'react'
import Editor, { EditorProps, loader } from '@monaco-editor/react'
import { TextWidget, IconWidget, usePrefix, useTheme } from '@designable/react'
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import { Tooltip } from 'antd'
import { parseExpression, parse } from '@babel/parser'
import { uid } from '@designable/shared'
import { format } from './format'
import cls from 'classnames'
import './config'
import { initMonaco } from './config'

export type Monaco = typeof monaco
export interface MonacoInputProps extends Omit<EditorProps, 'onChange'> {
  helpLink?: string | boolean
  helpCode?: string
  helpCodeViewWidth?: number | string
  extraLib?: string
  onChange?: (value: string) => void
}

export const MonacoInput: React.FC<MonacoInputProps> & {
  loader?: typeof loader
} = ({
  className,
  language,
  defaultLanguage,
  width,
  helpLink,
  helpCode,
  helpCodeViewWidth,
  height,
  onMount,
  onChange,
  ...props
}) => {
  const [loaded, setLoaded] = useState(false)
  const theme = useTheme()
  const valueRef = useRef('')
  const validateRef = useRef<NodeJS.Timeout | null>(null)
  const submitRef = useRef<NodeJS.Timeout | null>(null)
  const declarationRef = useRef<string[]>([])
  const extraLibRef = useRef<monaco.IDisposable | null>(null)
  const monacoRef = useRef<Monaco | null>(null)
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
  const computedLanguage = useRef<string | undefined>(language || defaultLanguage)
  const realLanguage = useRef<string>('')
  const unmountedRef = useRef(false)
  const changedRef = useRef(false)
  const uidRef = useRef(uid())
  const prefix = usePrefix('monaco-input')
  const input = props.value || props.defaultValue

  useEffect(() => {
    unmountedRef.current = false
    initMonaco()
    return () => {
      if (extraLibRef.current) {
        extraLibRef.current.dispose()
      }
      unmountedRef.current = true
    }
  }, [])

  useEffect(() => {
    if (monacoRef.current && props.extraLib) {
      updateExtraLib()
    }
  }, [props.extraLib])

  const updateExtraLib = () => {
    if (extraLibRef.current) {
      extraLibRef.current.dispose()
    }
    if (!monacoRef.current || !props.extraLib) return
    extraLibRef.current =
      monacoRef.current.languages.typescript.typescriptDefaults.addExtraLib(
        props.extraLib,
        `${uidRef.current}.d.ts`
      )
  }

  const isFileLanguage = () => {
    const lang = computedLanguage.current
    return lang === 'javascript' || lang === 'typescript'
  }

  const isExpLanguage = () => {
    const lang = computedLanguage.current
    return lang === 'javascript.expression' || lang === 'typescript.expression'
  }

  const renderHelper = () => {
    const getHref = () => {
      if (typeof helpLink === 'string') return helpLink
      if (isFileLanguage()) {
        return 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript'
      }
      if (isExpLanguage()) {
        return 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators'
      }
    }
    if (helpLink === false) return null
    const href = getHref()
    return (
      href && (
        <Tooltip
          title={
            <TextWidget token="SettingComponents.MonacoInput.helpDocument" />
          }
        >
          <div className={prefix + '-helper'}>
            <a target="_blank" href={href} rel="noreferrer">
              <IconWidget infer="Help" />
            </a>
          </div>
        </Tooltip>
      )
    )
  }

  const onMountHandler = (
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    editorRef.current = editor
    monacoRef.current = monaco
    onMount?.(editor, monaco)
    const model = editor.getModel()
    if (!model) return
    const currentValue = editor.getValue()
    ;(model as any)['getDesignerLanguage'] = () => computedLanguage.current
    if (currentValue && computedLanguage.current) {
      format(computedLanguage.current, currentValue)
        .then((content) => {
          editor.setValue(content)
          setLoaded(true)
        })
        .catch(() => {
          setLoaded(true)
        })
    } else {
      setLoaded(true)
    }
    if (props.extraLib) {
      updateExtraLib()
    }
    editor.onDidChangeModelContent(() => {
      onChangeHandler(editor.getValue())
    })
  }

  const submit = () => {
    if (submitRef.current !== null) clearTimeout(submitRef.current)
    submitRef.current = setTimeout(() => {
      onChange?.(valueRef.current)
    }, 1000)
  }

  const validate = () => {
    if (realLanguage.current === 'typescript') {
      if (validateRef.current !== null) clearTimeout(validateRef.current)
      validateRef.current = setTimeout(() => {
        try {
          if (valueRef.current) {
            if (isFileLanguage()) {
              parse(valueRef.current, {
                sourceType: 'module',
                plugins: ['typescript', 'jsx'],
              })
            } else if (isExpLanguage()) {
              parseExpression(valueRef.current, {
                plugins: ['typescript', 'jsx'],
              })
            }
          }
          if (!monacoRef.current || !editorRef.current) return
          monacoRef.current.editor.setModelMarkers(
            editorRef.current.getModel()!,
            computedLanguage.current || '',
            []
          )
          declarationRef.current = editorRef.current.deltaDecorations(
            declarationRef.current,
            [
              {
                range: new monacoRef.current.Range(1, 1, 1, 1),
                options: {},
              },
            ]
          )
          submit()
        } catch (err) {
          const e = err as any
          if (!monacoRef.current || !editorRef.current) return
          declarationRef.current = editorRef.current.deltaDecorations(
            declarationRef.current,
            [
              {
                range: new monacoRef.current.Range(
                  e.loc?.line || 1,
                  e.loc?.column || 1,
                  e.loc?.line || 1,
                  e.loc?.column || 1
                ),
                options: {
                  isWholeLine: true,
                  glyphMarginClassName: 'monaco-error-highline',
                },
              },
            ]
          )
          monacoRef.current.editor.setModelMarkers(
            editorRef.current.getModel()!,
            computedLanguage.current || '',
            [
              {
                code: '1003',
                severity: 8,
                startLineNumber: e.loc?.line || 1,
                startColumn: e.loc?.column || 1,
                endLineNumber: e.loc?.line || 1,
                endColumn: e.loc?.column || 1,
                message: e.message || 'Parse error',
              },
            ]
          )
        }
      }, 240)
    } else {
      submit()
      if (editorRef.current && monacoRef.current) {
        declarationRef.current = editorRef.current.deltaDecorations(
          declarationRef.current,
          [
            {
              range: new monacoRef.current.Range(1, 1, 1, 1),
              options: {},
            },
          ]
        )
      }
    }
  }

  const onChangeHandler = (value: string) => {
    changedRef.current = true
    valueRef.current = value
    validate()
  }
  computedLanguage.current = language || defaultLanguage
  const langTest = computedLanguage.current || ''
  realLanguage.current = /(?:javascript|typescript)/gi.test(langTest)
    ? langTest
    : 'typescript'

  const renderHelpCode = () => {
    if (!helpCode) return null
    return (
      <div
        className={prefix + '-view'}
        style={{ width: helpCodeViewWidth || '50%' }}
      >
        <Editor
          value={helpCode}
          theme={theme === 'dark' ? 'monokai' : 'chrome-devtools'}
          defaultLanguage={realLanguage.current}
          language={realLanguage.current}
          options={{
            ...props.options,
            lineNumbers: 'off',
            readOnly: true,
            glyphMargin: false,
            folding: false,
            lineDecorationsWidth: 0,
            lineNumbersMinChars: 0,
            minimap: {
              enabled: false,
            },
            tabSize: 2,
            smoothScrolling: true,
            scrollbar: {
              verticalScrollbarSize: 5,
              horizontalScrollbarSize: 5,
              alwaysConsumeMouseWheel: false,
            },
          }}
          width="100%"
          height="100%"
        />
      </div>
    )
  }

  return (
    <div
      className={cls(prefix, className, {
        loaded,
      })}
      style={{ width, height }}
    >
      {renderHelper()}
      <div className={prefix + '-view'}>
        <Editor
          {...props}
          theme={theme === 'dark' ? 'monokai' : 'chrome-devtools'}
          defaultLanguage={realLanguage.current}
          language={realLanguage.current}
          options={{
            glyphMargin: true,
            ...props.options,
            tabSize: 2,
            smoothScrolling: true,
            scrollbar: {
              verticalScrollbarSize: 5,
              horizontalScrollbarSize: 5,
              alwaysConsumeMouseWheel: false,
            },
          }}
          value={input}
          width="100%"
          height="100%"
          onMount={onMountHandler}
        />
      </div>
      {renderHelpCode()}
    </div>
  )
}

MonacoInput.loader = loader
