import { useRef, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import mermaid from "mermaid";
import dedent from 'ts-dedent'
import "./App.css";

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


  const rerender = async () => {
    if (!source.current) return

    const code = source.current.value

    render(code)
  }

  const save = async () => {
    if (!source.current) return

    const code = source.current.value

    invoke('export', { code })
  }

  console.log(error)

  return (
    <div className="container">
      <h1>Offline Mermaid Editor</h1>

      <div className="row">
        <textarea cols={80} rows={30} className="codeArea" ref={source} onChange={rerender}>
          {dedent(`
            sequenceDiagram
              A->> B: Query
              B->> C: Forward query
              Note right of C: Thinking...
              C->> B: Response
              B->> A: Forward response
          `)}
        </textarea>
      </div>
      <div className="row">
        <button onClick={rerender}><span>render</span>{error.parseError ? '⚠️' : null}</button>
        <button onClick={save}><span>save</span>{error.parseError ? '⚠️' : null}</button>
      </div>
      <div className="row">
        <div className="renderArea" dangerouslySetInnerHTML={{ __html: svg }}></div>
      </div>
    </div>
  );
}

export default App;
