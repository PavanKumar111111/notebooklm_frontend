import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import ChatBox from "./components/ChatBox";
import "./styles.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function App() {
  const [file, setFile] = useState(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [page, setPage] = useState(1);

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL ||
    "https://notebooklm-backend-ekfo.onrender.com";

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
      const pdfUrl = `${backendUrl}/${data.file}`; // backend must send file path
      setUploadedFileUrl(pdfUrl);
      setPage(1);
    } else {
      alert("Upload failed: " + JSON.stringify(data));
    }
  };

  function onLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div className="app">
      <header>
        <h1>NotebookLM PDF Viewer</h1>
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
        {/* LEFT SIDE — PDF VIEW */}
        <div className="left">
          <h2>PDF Preview</h2>

          {!uploadedFileUrl && <p>No PDF uploaded yet</p>}

          {uploadedFileUrl && (
            <>
              <Document file={uploadedFileUrl} onLoadSuccess={onLoadSuccess}>
                <Page pageNumber={page} />
              </Document>

              <div className="page-controls">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  ⬅ Prev
                </button>

                <span>
                  Page {page} of {numPages}
                </span>

                <button
                  disabled={page >= numPages}
                  onClick={() => setPage(page + 1)}
                >
                  Next ➡
                </button>
              </div>
            </>
          )}
        </div>

        {/* RIGHT SIDE — CHAT */}
        <div className="right">
          <ChatBox />
        </div>
      </div>
    </div>
  );
}
