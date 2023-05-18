import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import mmd from "mermaid"; 
import dedent from 'ts-dedent'
import "./App.css";

const api = mmd.mermaidAPI

api.initialize({ startOnLoad: false})

function App() {
  const [svg, setSvg] = useState("")

  const reload = async (text: string) => {
    api.render('theGraph', text).then((result) => {
      setSvg(result.svg)
    })
  }

  return (
    <div className="container">
      <h1>Offline Mermaid Editor</h1>

      <div className="row">
        <textarea cols={30} rows={10} onChange={(e) => reload(e.target.value)}>
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
        <div className="graph" dangerouslySetInnerHTML={{__html: svg}}></div>
      </div>
    </div>
  );
}

export default App;
