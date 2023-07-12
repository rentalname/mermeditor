import MonacoEditor from "@monaco-editor/react"
import loader from '@monaco-editor/loader';
import initEditor from 'monaco-mermaid'
import * as monaco from "monaco-editor"
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import styles from "./Editor.module.css"
import { classDiagramInstruction } from './instructions'

loader.config({ monaco })
loader.init().then((monaco) => {
  initEditor(monaco)
  monaco.editor.addKeybindingRules(
    [
      {
        keybinding: monaco.KeyMod.Shift | monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyD,
        command: "editor.action.copyLinesDownAction"
      }
    ]
  )
})

self.MonacoEnvironment = {
  getWorker() {
    return new editorWorker()
  }
}

type Props = {
  template?: string;
  onChangeHook?: (text: string | undefined) => void;
}

const Editor: React.FC<Props> = ({ template = classDiagramInstruction, onChangeHook }) => {
  return (
    <MonacoEditor
      className={styles.monacoEditor}
      defaultLanguage="mermaid"
      onChange={onChangeHook}
      value={template}
    />
  )
}

export default Editor
