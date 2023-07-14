import { save } from '@tauri-apps/api/dialog';
import { writeBinaryFile } from '@tauri-apps/api/fs';
import mermaid from "mermaid";
import { useEffect, useRef, useState } from "react";
import styles from "./App.module.css";

import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { blurReductionTransformer } from "./customTransformer";

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';

import Popper from '@mui/base/Popper';
import SourceOutlinedIcon from '@mui/icons-material/SourceOutlined';
import Button from '@mui/base/Button';

import { Panel, PanelGroup } from "react-resizable-panels";

import { svg2png } from './converter';
import ResizeHandle from './ResizeHandle';

import Editor from './Editor';
import { styled, Theme } from '@mui/material';
import { classDiagramInstruction, erDiagramInstruction, flowchartInstruction, sequenceInstruction, timelineInstruction, zenumlInstruction } from './instructions';

const api = mermaid.mermaidAPI

api.initialize({ startOnLoad: false })

function App() {
  const [error, setError] = useState({
    parseError: false,
  })
  const source = useRef<string>("")
  const svgDOM = useRef<HTMLDivElement>(null)

  const renderHandler = async () => {
    const code = source.current

    const valid = await api.parse(code, { suppressErrors: true })

    setError((error) => ({ ...error, parseError: !valid }))

    if (valid) {
      const { svg, bindFunctions } = await api.render('theGraph', code)
      const dom = svgDOM.current!
      dom.innerHTML = svg
      bindFunctions?.(dom)
    }
  }

  const renderHandlerWithCode = async (code: string | undefined) => {
    if (code === undefined) return

    const valid = await api.parse(code, { suppressErrors: true })

    setError((error) => ({ ...error, parseError: !valid }))

    if (valid) {
      const { svg, bindFunctions } = await api.render('theGraph', code)
      const dom = svgDOM.current!
      dom.innerHTML = svg
      bindFunctions?.(dom)
      source.current = code
    }
  }

  const saveHandler = async () => {
    const code = source.current

    const valid = await api.parse(code, { suppressErrors: true })

    if (!valid) return

    const filePath = await save({ filters: [{ name: 'mermaid', extensions: ['png', 'svg', 'pdf'] }], defaultPath: 'graph' })

    if (filePath === null || filePath.length === 0) return

    const { svg } = await api.render('theGraph', code)

    const blob = await svg2png(svg)
    if (blob) await writeBinaryFile(filePath, blob)
  }

  const [template, setTemplate] = useState("")
  const [popperAnchor, setPopperAnchor] = useState<null | HTMLElement | SVGSVGElement>(null)
  const popperHandleClick = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    setPopperAnchor(popperAnchor ? null : event.currentTarget);
  }
  const open = Boolean(popperAnchor);
  const id = open ? 'simple-popper' : undefined;
  const loadTemplateHandler = (instruction: string) => {
    setTemplate(instruction)
    setPopperAnchor(null)
  }

  useEffect(() => {
    renderHandlerWithCode(template)
  }, [template])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.appTitle}>Offline Mermaid Editor</h1>
        <div className={styles.actions}>
          <RefreshOutlinedIcon className={styles.actionButton} onClick={renderHandler} />
          <SaveAltOutlinedIcon className={styles.actionButton} onClick={saveHandler} />
          <SourceOutlinedIcon className={styles.actionButton} onClick={(e) => popperHandleClick(e)} />
          <Popper id={id} open={open} anchorEl={popperAnchor}>
            <StyledPopperDiv>
              <p>select template(clear current content)</p>
              <Button onClick={() => { loadTemplateHandler(classDiagramInstruction) }}>classDiagram</Button>
              <Button onClick={() => { loadTemplateHandler(erDiagramInstruction) }}>erDiagram</Button>
              <Button onClick={() => { loadTemplateHandler(flowchartInstruction) }}>flowchart</Button>
              <Button onClick={() => { loadTemplateHandler(sequenceInstruction) }}>sequence</Button>
              <Button onClick={() => { loadTemplateHandler(timelineInstruction) }}>timeline</Button>
            </StyledPopperDiv>
          </Popper>
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
            <Editor template={template} onChangeHook={renderHandlerWithCode} />
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
            <TransformWrapper
              initialScale={1}
              smooth={true}
              wheel={{ activationKeys: ['Meta'], smoothStep: 0.02 }}
              customTransform={blurReductionTransformer}
              minScale={0.25}
              maxScale={4}
              disablePadding
            >
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

const StyledPopperDiv = styled('div')(
  ({ theme }: { theme: Theme }) => `
  padding: 0.5rem;
  border: 1px solid;
  background-color: ${theme.palette.mode === 'dark' ? '#121212' : '#fff'};
  opacity: 1;
  margin: 0.25rem 0px;
`,
);
