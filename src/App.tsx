import { save } from '@tauri-apps/plugin-dialog';
import { writeFile } from '@tauri-apps/plugin-fs';
import mermaid from "mermaid";
import { useEffect, useRef, useState } from "react";
import styles from "./App.module.css";

import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { blurReductionTransformer } from "./customTransformer.js";

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';

import { styled, Theme } from '@mui/material';

import Popper from '@mui/material/Popper';
import SourceOutlinedIcon from '@mui/icons-material/SourceOutlined';
import Button from '@mui/material/Button';

import { FileTabs } from './FileTabs.js';

import { Panel, PanelGroup } from "react-resizable-panels";

import { svg2png } from './converter.js';
import ResizeHandle from './ResizeHandle.js';

import Editor from './Editor.js';
import { mermaidTemplates } from './instructions.js';
import { MermaidFile, newMermeidFile } from './MermaidFile.js';
import { useDebounce } from './hooks/useDebounce.js';
import { deleteFile, loadFiles, storeFile } from './storage.js';


mermaid.initialize({ startOnLoad: false })

function App() {
  const { parse, render } = mermaid
  // start with a single new file, then try to load persisted files
  const [files, setFiles] = useState<MermaidFile[]>([newMermeidFile()])
  const [activeFile, setActiveFile] = useState<MermaidFile>(files[0])

  useEffect(() => {
    let mounted = true
    loadFiles()
      .then((loaded) => {
        if (!mounted) return
        if (loaded && loaded.length > 0) {
          setFiles(loaded)
          setActiveFile(loaded[0])
        }
      })
      .catch(console.log)

    return () => {
      mounted = false
    }
  }, [])

  const switchTabHandler = (id: string) => {
    const nextFile = files.find((f) => (f.id == id))
    if (nextFile) setActiveFile(nextFile)
  }

  const newTabHandler = () => {
    setFiles((oldFiles) => [...oldFiles, newMermeidFile()])
  }

  const closeTabHandler = (closeFile: MermaidFile) => {
    if (closeFile.id == activeFile.id) {
      const pos = files.findIndex((f) => (f.id == closeFile.id))
      if (pos < 0) {
        setActiveFile(files[0])
      } else if (files[pos + 1]) {
        setActiveFile(files[pos + 1])
      } else {
        setActiveFile(files[pos - 1])
      }
    }
    setFiles((oldFiles) => {
      if (oldFiles.length <= 1) {
        const newFile = newMermeidFile()
        setActiveFile(newFile)
        return [newFile]
      }

      return oldFiles.filter((f) => (f.id != closeFile.id))
    })

    deleteFile(closeFile).catch(console.log)
  }

  const [watch, watchedFile] = useState<{ code: string, file: MermaidFile }>()
  const changeFile = useDebounce(watch, 2000)

  useEffect(() => {
    if (changeFile) {
      storeFile(changeFile.file).catch(console.log)
    }
  }, [changeFile])

  const [error, setError] = useState({
    parseError: false,
  })

  const svgDOM = useRef<HTMLDivElement>(null)

  const renderHandler = async () => {
    const code = activeFile.content

    const valid = await parse(code, { suppressErrors: true })

    setError((error) => ({ ...error, parseError: !valid }))

    if (valid) {
      const { svg, bindFunctions } = await render('theGraph', code)
      const dom = svgDOM.current!
      dom.innerHTML = svg
      bindFunctions?.(dom)
    }
  }

  const renderHandlerWithCode = async (code: string | undefined) => {
    if (code === undefined) return

    const valid = await parse(code, { suppressErrors: true })

    setError((error) => ({ ...error, parseError: !valid }))

    if (valid) {
      const { svg, bindFunctions } = await render('theGraph', code)
      const dom = svgDOM.current!
      dom.innerHTML = svg
      bindFunctions?.(dom)
      activeFile.content = code
      watchedFile(
        {
          code,
          file: activeFile
        }
      )
    }
  }

  const saveHandler = async () => {
    const code = activeFile.content

    const valid = await parse(code, { suppressErrors: true })

    if (!valid) return

    const filePath = await save({ filters: [{ name: 'mermaid', extensions: ['png', 'svg', 'pdf'] }], defaultPath: 'graph' })

    if (filePath === null || filePath.length === 0) return

    const { svg } = await render('theGraph', code)

    const blob = await svg2png(svg)
    if (blob) await writeFile({ path: filePath, contents: blob })
  }

  const [popperAnchor, setPopperAnchor] = useState<null | HTMLElement | SVGSVGElement>(null)
  const popperHandleClick = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    setPopperAnchor(popperAnchor ? null : event.currentTarget);
  }
  const open = Boolean(popperAnchor);
  const id = open ? 'simple-popper' : undefined;
  const loadTemplateHandler = (instruction: string) => {
    setActiveFile((oldFile) => {
      oldFile.content = instruction
      return { ...oldFile }
    })
    setPopperAnchor(null)
  }

  useEffect(() => {
    renderHandlerWithCode(activeFile.content)
  }, [activeFile])

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
              {mermaidTemplates.map((template) => (
                <Button key={template.type} onClick={() => { loadTemplateHandler(template.code) }}>{template.type}</Button>
              ))}
            </StyledPopperDiv>
          </Popper>
        </div>
      </div>
      <FileTabs
        activeFile={activeFile}
        files={files}
        onChangeTab={switchTabHandler}
        onNewTab={newTabHandler}
        onCloseTab={closeTabHandler}
      />

      <div className={styles.main}>
        <PanelGroup autoSaveId="example" direction="vertical">
          <Panel
            className={styles.panel}
            collapsible={true}
            defaultSize={10}
            order={1}
          >
            <Editor template={activeFile.content} onChangeHook={renderHandlerWithCode} />
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
              <TransformComponent wrapperStyle={{ width: "100%", height: "100%" }} contentStyle={{ width: '100%', willChange: "transform" }}>
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
