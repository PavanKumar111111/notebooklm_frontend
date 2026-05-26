import React, { useState, useEffect } from "react";
import ChatBox from "./components/ChatBox";
import "./styles.css";

export default function App() {
  const [file, setFile] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const [pdfText, setPdfText] = useState("");  
  const [page, setPage] = useState(1);

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL ||
    "https://notebooklm-backend-ekfo.onrender.com";

  // Fetch PDF text for given page
  const loadPage = async (pg) => {
    const res = await fetch(`${backendUrl}/pdf/${pg}`);
    if (!res.ok) {
      setPdfText("Page not found");
      return;
    }
    const text = await res.text();
    setPdfText(text);
  };

  // Handle upload
  const handleUpload = async () => {
    if (!file) return alert("Select a PDF first");

    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch(`${backendUrl}/upload`, {
      method: "POST",
      body: fd,
    });

    const data = await res.json();

    if (data.ok) {
      setUploaded(true);
      loadPage(1); // Load first page after upload
    } else {
      alert("Upload failed: " + JSON.stringify(data));
    }
  };

  return (
    <div className="app">
      <header>
        <h1>NotebookLM Clone (PDF Demo)</h1>
      </header>

      <div className="controls">
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button onClick={handleUpload}>Upload PDF</button>
      </div>

      <div className="main">
        {/* LEFT SIDE – PDF TEXT */}
        <div className="left">
          <h2>PDF Content</h2>

          {!uploaded && <p>Upload a PDF to view its text here.</p>}

          {uploaded && (
            <>
              <div className="page-controls">
                <button
                  onClick={() => {
                    const newPage = Math.max(1, page - 1);
                    setPage(newPage);
                    loadPage(newPage);
                  }}
                >
                  ⬅ Prev
                </button>

                <span>Page {page}</span>

                <button
                  onClick={() => {
                    const newPage = page + 1;
                    setPage(newPage);
                    loadPage(newPage);
                  }}
                >
                  Next ➡
                </button>
              </div>

              <div className="pdf-box">
                <pre>{pdfText}</pre>
              </div>
            </>
          )}
        </div>

        {/* RIGHT SIDE – CHAT */}
        <div className="right">
          <ChatBox />
        </div>
      </div>
    </div>
  );
}
