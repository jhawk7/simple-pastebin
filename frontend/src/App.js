import { useEffect, useState } from "react";
import SidePanel from "./components/SidePanel";

const App = () => {
  const [inputValue, setInputValue] = useState('')
  const [pasteData, setPasteData] = useState(null)

  const handleInputChange = (event) => {
    setInputValue(event.target.value)
  };

  useEffect(() => {
    getPasteData()
  }, [])

  const getPasteData = async() => {
    const url = process.env.REACT_APP_RETRIEVE_API
    const res = await fetch(url)
    const data = await res.json()

    if (res.status === 200 && data.collection !== null) {
      const collection = JSON.parse(data.collection)
      setPasteData(collection.data)
    }
  }

  const deleteHandler = async (key) => {
    const url = process.env.REACT_APP_DELETE_API + key
    const res = await fetch(url, {
      method: "DELETE",
    })
    .then((res) => {
      res.json()
      return res
    })
    .catch((e) => {
      console.log(e)
    })

    if (res && res.status == 204) {
      setPasteData(pasteData.filter((paste) => paste.key !== key))
    }
  }

  const dataExists = () => {
    return (pasteData !== null && pasteData.length > 0)
  }

  const sendPost = async() => {
    const url = process.env.REACT_APP_POST_API
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "value": inputValue,
      })
    })
    .then((res) => {
      res.json()
      console.log(res.status)
      return res
    })
    .catch((e) => {
      console.log(e)
    })

    setInputValue("")

    if (res && res.status === 201) {
      await getPasteData()
    }
  }

  return (
    <div>
      <div>
        <h2>pasteBin.</h2>
      </div>
      <div>
        <input type="text" value={inputValue} onChange={handleInputChange} placeholder="Enter text here" />
        <button onClick={sendPost}>Paste</button>
      </div>
      <div>
        <div>
          <text>Panel</text>
        </div>
        {dataExists() ? <SidePanel pastedata={pasteData} deleteHandler={deleteHandler}></SidePanel> : <text>no items</text>}
      </div>
    </div>
  );

}
export default App;
