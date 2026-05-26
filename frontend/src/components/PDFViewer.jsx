import React, { forwardRef, useImperativeHandle, useState } from "react";

/**
 * Simple PDF viewer placeholder.
 * For a production app, integrate pdf.js or react-pdf to render pages and allow scrolling.
 * This demo fetches page text via backend endpoint /pdf/:page and shows it.
 */
const PDFViewer = forwardRef(({ uploaded }, ref) => {
  const [page, setPage] = useState(1);
  const [text, setText] = useState("");

  useImperativeHandle(ref, () => ({
    scrollToPage: async (p) => {
      setPage(p);
      if (uploaded) {
        const res = await fetch(`http://localhost:5000/pdf/${p}`);
        const t = await res.text();
        setText(t);
      } else {
        setText("Upload a PDF to view pages.");
      }
    }
  }));

  return (
    <div className="pdf-viewer">
      <div className="controls">
        <button onClick={()=>{const np = Math.max(1,page-1); setPage(np); ref?.current?.scrollToPage(np);}}>Prev</button>
        <span> Page {page} </span>
        <button onClick={()=>{const np = page+1; setPage(np); ref?.current?.scrollToPage(np);}}>Next</button>
      </div>
      <pre className="pdf-text">{text || "Upload a PDF and click 'Upload' to load pages."}</pre>
    </div>
  );
});

export default PDFViewer;
