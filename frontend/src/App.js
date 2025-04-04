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
      <title>Simple PastBin</title>
      <div class="d-flex flex-column justify-content-center align-items-center">
        <div class="p-2" style={{marginTop:200, marginBottom:10}}>
          <h1 class="fw-medium">pasteBin.</h1>
        </div>
        <div class="d-flex flex-row justify-content-center align-items-center">
          <input type="text" class="form-control" style={{marginRight: 5}} value={inputValue} onChange={handleInputChange} placeholder="Enter text here" />
          <button class="btn btn-primary" onClick={sendPost}>Paste</button>
        </div>
      </div>
      {dataExists() ? <SidePanel pastedata={pasteData} deleteHandler={deleteHandler}></SidePanel> : <text>no items</text>}
    </div>
  );

}
export default App;
