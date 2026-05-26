import React, { useEffect, useState } from "react";

export default function PDFViewer({ uploaded }) {
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    if (!uploaded) return;

    const backendUrl =
      import.meta.env.VITE_BACKEND_URL ||
      "https://notebooklm-backend-ekfo.onrender.com";

    // The backend now serves the original PDF file
    setPdfUrl(`${backendUrl}/pdf-file`);
  }, [uploaded]);

  if (!uploaded) {
    return <div style={{ padding: 20 }}>Upload a PDF to view it here.</div>;
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <iframe
        src={pdfUrl}
        width="100%"
        height="100%"
        style={{ border: "none" }}
        title="PDF Viewer"
      ></iframe>
    </div>
  );
}
