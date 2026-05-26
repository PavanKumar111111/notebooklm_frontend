import React, { useState } from "react";

export default function ChatBox({ viewerRef }) {
  const [messages, setMessages] = useState([]);
  const [q, setQ] = useState("");

  const send = async () => {
    if (!q.trim()) return;
    setMessages(m=>[...m, { role: "user", text: q }]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    const res = await fetch(`${backendUrl}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: q })
    });
    const data = await res.json();
    setMessages(m=>[...m, { role: "user", text: q }, { role: "bot", text: data.answer, citations: data.citations }]);
    setQ("");
  };

  return (
    <div className="chatbox">
      <div className="messages">
        {messages.map((m, i) => (
          <div key={i} className={m.role}>
            <div className="bubble">{m.text}</div>
            {m.citations && (
              <div className="citations">
                {m.citations.map((p)=>(
                  <button key={p} onClick={()=>viewerRef?.current?.scrollToPage(p)}>Page {p}</button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="composer">
        <input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Ask about the PDF..." />
        <button onClick={send}>Send</button>
      </div>
    </div>
  );
}
