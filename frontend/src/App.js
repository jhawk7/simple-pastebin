import React, { useState, useEffect } from "react";

const PastebinApp = () => {
  const [pastes, setPastes] = useState([]);
  const [newPaste, setNewPaste] = useState("");

  useEffect(() => {
    fetchPastes();
  }, []);

  const fetchPastes = async () => {
    const response = await fetch(process.env.REACT_APP_RETRIEVE_API);
    const data = await response.json();
    const collection = JSON.parse(data.collection)
    setPastes(collection.data);
  };

  const handleCopy = (value) => {
    navigator.clipboard.writeText(value);
  };

  const handleDelete = async (key) => {
    await fetch(`${process.env.REACT_APP_DELETE_API}?key=${key}`, { method: "DELETE" });
    fetchPastes();
  };

  const handleSubmit = async () => {
    if (!newPaste.trim()) return;
    await fetch(process.env.REACT_APP_POST_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ value: newPaste }),
    });
    setNewPaste("");
    fetchPastes();
  };

  const dataPresent = () => {
    return pastes != null && pastes.length > 0;
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>Pastebin UI</h1>
      <div style={{ marginBottom: "30px" }}>
        <input
          value={newPaste}
          onChange={(e) => setNewPaste(e.target.value)}
          placeholder="Enter text to store..."
          style={{ width: "100%", padding: "10px", fontSize: "16px" }}
        />
        <button
          onClick={handleSubmit}
          style={{ marginTop: "10px", padding: "10px", width: "100%", fontSize: "16px", cursor: "pointer" }}
        >
          Submit
        </button>
      </div>

      {dataPresent() && pastes.map(({ key, value }) => (
        <div
          key={key}
          style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "15px", marginBottom: "15px" }}
        >
          <div style={{ fontWeight: "bold" }}>Key: {key}</div>
          <div style={{ fontSize: "14px", color: "#555" }}>{value}</div>
          <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
            <button
              onClick={() => handleCopy(value)}
              style={{ padding: "5px 10px", cursor: "pointer" }}
            >
              Copy
            </button>
            <button
              onClick={() => handleDelete(key)}
              style={{ padding: "5px 10px", cursor: "pointer", color: "red" }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PastebinApp;

