import { useState } from "react"
import {ChevronDown, ChevronUp} from "lucide-react"

const Paste = ({paste}) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClick = () => {
    setIsOpen(!isOpen);
  }

  return (
    <div>
      <button onClick={handleClick} className="">
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      <text>{paste.key}</text>
      {isOpen && (
        <div>
          <ul>
            <li>{paste.value}<br/>{paste.timestamp}</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default Paste