import { useState } from "react"
import {ChevronDown, ChevronUp} from "lucide-react"

const Paste = ({paste}) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClick = () => {
    setIsOpen(!isOpen);
  }

  return (
    <div class="d-flex flex-row">
      <button onClick={handleClick}>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      <text>{paste.key}</text>
      {isOpen && (
        <div>
          <ul>
            <br/><li>{paste.value}<br/>{paste.timestamp}</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default Paste