import { useState } from "react";
import SidePanel from "./components/SidePanel";

//const App = () => {
  //const [text, setText] = useState("");
  //const [history, setHistory] = useState<String>([]);

  //const handleSave = () => {
    //if (text.trim()) {
      //setHistory([text, ...history]);
      //setText("");
    //}
  //};

  //return (
    //<div className="flex h-screen p-4 gap-4">
      //{/* Input Section */}
      //<div className="w-2/3 flex flex-col gap-4">
        //<Textarea
          //value={text}
          //onChange={(e) => setText(e.target.value)}
          //placeholder="Enter your text here..."
          //className="p-2 border rounded-lg w-full h-40"
        ///>
        //<Button onClick={handleSave} className="w-fit">Save</Button>
      //</div>
      
      //{/* Side Panel */}
      //<div className="w-1/3 overflow-y-auto border rounded-lg p-2 bg-gray-50">
        //<h2 className="text-lg font-bold mb-2">Previous Entries</h2>
        //{history.length === 0 ? (
          //<p className="text-gray-500">No previous entries.</p>
        //) : (
          //history.map((entry, index) => (
            //<Card key={index} className="mb-2">
              //<CardContent className="p-2">{entry}</CardContent>
            //</Card>
          //))
        //)}
      //</div>
    //</div>
  //);
//}

const App = () => {
  const [inputValue, setInputValue] = useState('');
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <div>
      <div>
        <input type="text" value={inputValue} onChange={handleInputChange} placeholder="Enter text here" />
        <button>Paste</button>
      </div>
      <div>
        <SidePanel pastedata={""}></SidePanel>
      </div>
    </div>
  );

}
export default App;
