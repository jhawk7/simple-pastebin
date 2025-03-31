import { useState } from "react"
import Paste from "./Paste"

const SidePanel = ({pastedata, deleteHandler}) => {

  return (
    <div>
     <ul>
        {pastedata.map((paste, index) => (
          <div>
            <Paste paste={paste} key={index}></Paste>
            <button>Copy</button>
            <button onClick={() => deleteHandler(paste.key)}>X</button>
          </div>
        ))}
      </ul>
    </div>
  )
}

export default SidePanel