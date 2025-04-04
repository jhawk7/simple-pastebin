import { useState } from "react"
import Paste from "./Paste"

const SidePanel = ({pastedata, deleteHandler}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text); //only works for https and localhost
    setIsCopied(true)

    setTimeout(() => {
      setIsCopied(false);
    }, 2000)
  }

  return (
    <div class="d-flex flex-column justify-content-center align-items-center" style={{marginTop: 20}}>
      <div class="p-2">
        <ul>
          {pastedata.map((paste, index) => (
            <div>
              <Paste paste={paste} key={index}></Paste>
              { isCopied ? <button>check</button> :
                <button onClick={() => handleCopy(paste.value)}>Copy</button>
              }
              <button style={{color: "red"}} onClick={() => deleteHandler(paste.key)}>X</button>
            </div>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default SidePanel