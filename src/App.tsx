import { save } from '@tauri-apps/api/dialog';
import { writeBinaryFile } from '@tauri-apps/api/fs';
import { invoke } from "@tauri-apps/api/tauri";
import mermaid from "mermaid";
import { useRef, useState } from "react";
import dedent from 'ts-dedent';
import styles from "./App.module.css";

import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

import { svg2png } from './converter';
import ResizeHandle from './ResizeHandle';

const api = mermaid.mermaidAPI

api.initialize({ startOnLoad: false })

function App() {
  const [error, setError] = useState({
    parseError: false,
  })
  const [svg, setSvg] = useState("")
  const source = useRef<HTMLTextAreaElement>(null)

  const render = async (text: string) => {
    const valid = await api.parse(text, { suppressErrors: true })

    if (valid) {
      const { svg } = await api.render('theGraph', text)
      setSvg(svg)
      setError((error) => ({ ...error, parseError: false }))
    } else {
      setError((error) => ({ ...error, parseError: true }))
    }
  }

  const renderHandler = async () => {
    if (!source.current) return

    const code = source.current.value

    render(code)
  }

  const saveHandler = async () => {
    if (!source.current) return

    const code = source.current.value

    const valid = await api.parse(code, { suppressErrors: true })

    if (!valid) return

    const filePath = await save({ filters: [{ name: 'mermaid', extensions: ['png', 'svg', 'pdf'] }], defaultPath: 'graph' })

    if (filePath === null || filePath.length === 0) return

    const { svg } = await api.render('theGraph', code)
    await writeBinaryFile(filePath, svg2png(svg))
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.appTitle}>Offline Mermaid Editor</h1>
        <div className={styles.actions}>
          <RefreshOutlinedIcon className={styles.actionButton} onClick={renderHandler} />
          <SaveAltOutlinedIcon className={styles.actionButton} onClick={saveHandler} />
        </div>
      </div>

      <div className={styles.main}>
        <PanelGroup autoSaveId="example" direction="vertical">
          <Panel
            className={styles.panel}
            collapsible={true}
            defaultSize={10}
            order={1}
          >
            <div className={styles.panelContent}>
              <textarea className={styles.editorArea} ref={source} onChange={renderHandler}
                defaultValue={dedent(`
                  sequenceDiagram
                    A->> B: Query
                    B->> C: Forward query
                    Note right of C: Thinking...
                    C->> B: Response
                    B->> A: Forward response
                `)}
              />
            </div>
          </Panel>

          <div className={styles.buildStatus}>
            {error.parseError ? <ErrorOutlineOutlinedIcon color='secondary' /> : <CheckCircleOutlineIcon color='primary' />}
          </div>

          <ResizeHandle />
          <Panel
            className={styles.panel}
            collapsible={true}
            defaultSize={15}
            order={2}
          >

            <div className={styles.panelContent}>
              <div className={styles.renderArea} dangerouslySetInnerHTML={{ __html: svg }}></div>
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default App;
