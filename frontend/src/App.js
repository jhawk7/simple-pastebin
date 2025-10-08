import React, { useState, useEffect } from "react";

const PastebinApp = () => {
  const [pastes, setPastes] = useState([]);
  const [newPaste, setNewPaste] = useState("");
  const [copyStatus, setCopyStatus] = useState({});

  useEffect(() => {
    fetchPastes();
  }, []);

  const fetchPastes = async () => {
    const response = await fetch(process.env.REACT_APP_RETRIEVE_API);
    const data = await response.json();
    const collection = JSON.parse(data.collection)
    setPastes(collection.data);
  };

  const handleCopy = async (value, key) => {
    const markCopied = (k) => {
      setCopyStatus((s) => ({ ...s, [k]: true }));
      setTimeout(() => setCopyStatus((s) => ({ ...s, [k]: false })), 1500);
    };

    // Try modern async clipboard API first
    if (navigator && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      try {
        await navigator.clipboard.writeText(value);
        markCopied(key || value);
        return;
      } catch (err) {
        // fall through to legacy fallback
        console.warn('Clipboard API failed, falling back to execCommand', err);
      }
    }

    // Fallback: create a temporary textarea, select and copy
    try {
      const textarea = document.createElement('textarea');
      textarea.value = value;
      // Prevent scrolling to bottom
      textarea.style.position = 'fixed';
      textarea.style.top = '0';
      textarea.style.left = '0';
      textarea.style.width = '1px';
      textarea.style.height = '1px';
      textarea.style.padding = '0';
      textarea.style.border = 'none';
      textarea.style.outline = 'none';
      textarea.style.boxShadow = 'none';
      textarea.style.background = 'transparent';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);

      if (successful) {
        markCopied(key || value);
        return;
      }
    } catch (err) {
      // ignore
    }

    // If we reach here, show a simple prompt fallback
    // (user can manually copy)
    try {
      // eslint-disable-next-line no-alert
      window.prompt('Copy to clipboard: Ctrl+C, Enter', value);
    } catch (e) {
      // nothing else we can do
    }
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
              onClick={() => handleCopy(value, key)}
              style={{ padding: "5px 10px", cursor: "pointer" }}
            >
              {copyStatus[key] ? 'Copied!' : 'Copy'}
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

