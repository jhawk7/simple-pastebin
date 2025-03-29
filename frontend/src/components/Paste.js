import { useState } from "react"
import {ChevronDown, ChevronUp} from "lucide-react"

const Paste = ({paste}) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleClick = () => {
    setIsOpen(!isOpen);
  }

  const handleDelete = async (paste) => {
    const url = process.env.REACT_APP_DELETE_API + paste.key
    const res = await fetch(url, {
      method: "DELETE",
    })
    .then((res) => {
      res.json()
      console.log(res.status)
      return res.json
    })
    .catch((e) => {
      console.log(e)
    })

    if (res && res.status === 204) {
      //await getPasteData()
    }
  }

  return (
    <div>
      <button onClick={handleClick} className="">
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      <text>{paste.key}</text>
      <button>Copy</button>
      <button onClick={handleDelete}>X</button>

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