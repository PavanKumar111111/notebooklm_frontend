import React, { useEffect, useState } from "react";

export default function PDFViewer({ uploaded }) {
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    if (!uploaded) return;

    const backendUrl =
      import.meta.env.VITE_BACKEND_URL ||
      "https://notebooklm-backend-ekfo.onrender.com";

    // Append a timestamp to force reload (important)
    setPdfUrl(`${backendUrl}/pdf-file?t=${Date.now()}`);
  }, [uploaded]);

  if (!uploaded) {
    return (
      <div style={{ padding: "20px", fontSize: "16px" }}>
        Upload a PDF to view it here.
      </div>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        borderRadius: "10px",
        border: "1px solid #ddd",
      }}
    >
      <iframe
        src={pdfUrl}
        width="100%"
        height="100%"
        style={{ border: "none" }}
        title="PDF Viewer"
      />
    </div>
  );
}
