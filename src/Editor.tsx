import MonacoEditor from "@monaco-editor/react"
import loader from '@monaco-editor/loader';
import initEditor from 'monaco-mermaid'
import * as monaco from "monaco-editor"
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import styles from "./Editor.module.css"
import { classDiagramInstruction } from './instructions.js'
import { useEffect, useState } from 'react'

type Props = {
  template?: string;
  onChangeHook?: (text: string | undefined) => void;
}

// MonacoEditor has some incompatible JSX typing in @monaco-editor/react; use `any` wrapper for JSX usage
const MonacoEditorAny: any = MonacoEditor

const Editor: React.FC<Props> = ({ template = classDiagramInstruction, onChangeHook }) => {
  const [monacoAvailable, setMonacoAvailable] = useState<boolean | null>(null)
  useEffect(() => {
    // initialize the monaco loader defensively at mount time
    ;(async () => {
      try {
        // loader may be a namespace object with a `.default` property depending on bundler
        const l: any = (loader as any).default ?? loader

        // debug helper: log loader shape to help diagnose runtime issues
        // eslint-disable-next-line no-console
        console.debug('monaco loader shape', {
          isFunction: typeof l === 'function',
          hasDefault: !!(loader as any).default,
          keys: Object.keys(l || {})
        })

        // if config is available, pass our monaco import
        if (typeof l.config === 'function') {
          l.config({ monaco })
        }

        // init may return a cancelable promise; await it if present
        let m: any
        if (typeof l.init === 'function') {
          // some loader implementations return a cancelable wrapper; unwrap `.promise` if present
          const initResult = l.init()
          m = initResult && initResult.promise ? await initResult.promise : await initResult
        } else if (typeof l.__getMonacoInstance === 'function') {
          m = l.__getMonacoInstance()
        }

        if (m) {
          setMonacoAvailable(true)
          try {
            initEditor(m)
            m.editor.addKeybindingRules([
              {
                keybinding: m.KeyMod.Shift | m.KeyMod.CtrlCmd | m.KeyCode.KeyD,
                command: "editor.action.copyLinesDownAction"
              },
              {
                keybinding: m.KeyMod.WinCtrl | m.KeyMod.Shift | m.KeyCode.UpArrow,
                command: "cursorColumnSelectUp"
              },
              {
                keybinding: m.KeyMod.WinCtrl | m.KeyMod.Shift | m.KeyCode.DownArrow,
                command: "cursorColumnSelectDown"
              },
              {
                keybinding: m.KeyMod.WinCtrl | m.KeyMod.CtrlCmd | m.KeyCode.UpArrow,
                command: "editor.action.moveLinesUpAction"
              },
              {
                keybinding: m.KeyMod.WinCtrl | m.KeyMod.CtrlCmd | m.KeyCode.DownArrow,
                command: "editor.action.moveLinesDownAction"
              },
            ])
          } catch (e) {
            // non-fatal: keybindings or mermaid init may fail on some environments
            console.warn('monaco post-init hook failed', e)
          }
        }
      } catch (err) {
        // avoid letting loader init failure crash the app
        // log for later debugging
        // eslint-disable-next-line no-console
        console.error('Monaco loader init failed:', err)
        setMonacoAvailable(false)
      }
    })()

    // provide the MonacoEnvironment worker factory used by monaco-editor
    // set on window/self so the editor can create workers
    self.MonacoEnvironment = {
      getWorker() {
        return new (editorWorker as any)()
      }
    }
  }, [])

  return (
    monacoAvailable === false ? (
      <textarea
        className={styles.monacoEditor}
        value={template}
        onChange={(e) => onChangeHook?.(e.target.value)}
      />
    ) : (
      <MonacoEditorAny
        className={styles.monacoEditor}
        defaultLanguage="mermaid"
        onChange={onChangeHook}
        value={template}
      />
    )
  )
}

export default Editor
