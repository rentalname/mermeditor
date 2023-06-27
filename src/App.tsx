import { save } from '@tauri-apps/api/dialog';
import { writeBinaryFile } from '@tauri-apps/api/fs';
import mermaid from "mermaid";
import { useRef, useState } from "react";
import dedent from 'ts-dedent';
import styles from "./App.module.css";

import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';

import { Panel, PanelGroup } from "react-resizable-panels";

import { svg2png } from './converter';
import ResizeHandle from './ResizeHandle';

const api = mermaid.mermaidAPI

api.initialize({ startOnLoad: false })

function App() {
  const [error, setError] = useState({
    parseError: false,
  })
  const source = useRef<HTMLTextAreaElement>(null)
  const svgDOM = useRef<HTMLDivElement>(null)

  const renderHandler = async () => {
    if (!source.current) return

    const code = source.current.value

    const valid = await api.parse(code, { suppressErrors: true })

    setError((error) => ({ ...error, parseError: !valid }))

    if (valid) {
      const { svg, bindFunctions } = await api.render('theGraph', code)
      const dom = svgDOM.current!
      dom.innerHTML = svg
      bindFunctions?.(dom)
    }
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

            <TransformWrapper initialScale={4} wheel={{ activationKeys: ['Meta'], step: 0.1 }} >
              <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ width: '100%' }}>
                <div className={styles.renderArea} ref={svgDOM}></div>
              </TransformComponent>
            </TransformWrapper>
          </Panel>
        </PanelGroup>
      </div>
    </div >
  );
}

export default App;
