import React, { useState, useRef } from "react";
import PDFViewer from "./components/PDFViewer";
import ChatBox from "./components/ChatBox";
import "./styles.css";

export default function App() {
  const [file, setFile] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const viewerRef = useRef();

  const handleUpload = async () => {
    if (!file) return alert("Select a PDF first");
    const fd = new FormData();
    fd.append("file", file);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    const res = await fetch(`${backendUrl}/upload`, { method: "POST", body: fd });
    const data = await res.json();
    if (data.ok) setUploaded(true);
    else alert("Upload failed: " + JSON.stringify(data));
  };

  return (
    <div className="app">
      <header>
        <h1>NotebookLM Clone (demo)</h1>
      </header>

      <div className="controls">
        <input type="file" accept="application/pdf" onChange={(e)=>setFile(e.target.files[0])} />
        <button onClick={handleUpload}>Upload PDF</button>
      </div>

      <div className="main">
        <div className="left">
          <PDFViewer ref={viewerRef} uploaded={uploaded} />
        </div>
        <div className="right">
          <ChatBox viewerRef={viewerRef} />
        </div>
      </div>
    </div>
  );
}
