import { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("Aguardando...");
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8000/ws");

    ws.current.onopen = () => {
      console.log("Conectado");
    };

    ws.current.onmessage = (event) => {
      const msg = event.data;
      setStatus(msg);

      if (msg.startsWith("Download concluído::")) {
        const nomeArquivo = msg.split("::")[1];

        if (nomeArquivo) {
          window.location.href = `http://localhost:8000/baixar-arquivo?nome=${encodeURIComponent(nomeArquivo)}`;
        }
      }
    };

    ws.current.onerror = () => {
      setStatus("Erro na conexão");
    };

    ws.current.onclose = () => {
      setStatus("Conexão encerrada");
    };

    return () => ws.current?.close();
  }, []);

  const baixar = () => {
    if (!url) return;
    ws.current?.send(JSON.stringify({ url, qualidade: "best" }));
  };

  return (
    <div className="container">
      <header className="topbar">
        <h3 className="logo">Downloader</h3>
      </header>

      <div className="card">
        <h1>YouTube Video Downloader</h1>
        <p>Download vídeos em MP4 ou MP3 com alta qualidade</p>

        <div className="search-box">
          <input
            type="text"
            placeholder="Cole o link do YouTube aqui..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button onClick={baixar}>Buscar</button>
        </div>

        <p className="status">{status}</p>
      </div>
    </div>
  );
}

export default App;
