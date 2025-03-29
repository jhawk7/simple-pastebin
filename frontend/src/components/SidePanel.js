import Paste from "./Paste"

const SidePanel = ({pastedata}) => {

  return (
    <div>
     <ul>
        {pastedata.map((paste, index) => (
          <Paste paste={paste} key={index}></Paste>
        ))}
      </ul>
    </div>
  )
}

export default SidePanel