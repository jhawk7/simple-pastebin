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
      <text>somekey</text>
      {isOpen && (
        <div>
          <ul>
            <li>some_value<br/>2025-03-28 16:06</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default Paste