import { useState, useRef, useEffect } from "react";
import { Download, Link, HelpCircle } from "lucide-react";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("Aguardando...");
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:8000/ws");

    ws.current.onmessage = (event) => {
      const msg = event.data;
      setStatus(msg);

      if (msg.startsWith("Download concluído::")) {
        const nomeArquivo = msg.split("::")[1];
        window.location.href = `http://localhost:8000/baixar-arquivo?nome=${encodeURIComponent(nomeArquivo)}`;
      }
    };

    return () => ws.current?.close();
  }, []);

  const baixar = () => {
    if (!url) return;
    ws.current?.send(JSON.stringify({ url, qualidade: "best" }));
  };

  return (
    <div className="container">
      {/* HEADER */}
      <header className="topbar">
        <div className="logo">
          <Download size={20} />
          <span>BoltClip</span>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <h1>Baixador de Vídeos do YouTube gratuito</h1>
        <p>Cole uma URL do YouTube para baixar instantaneamente.</p>

        <div className="search-box">
          <input
            type="text"
            placeholder="Cole aqui seu link do vídeo do YouTube"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <button onClick={baixar}>
            <Download size={16} />
            Baixar
          </button>
        </div>

        <small className="alert">
          Conteúdo protegido por direitos autorais não está disponível para download
        </small>

        <p className="status">{status}</p>
      </section>

      {/* INFO */}
      <section className="info">
        <div className="info-left">
          <img src="/assets/Baixando vídeo do YouTube.png" alt="preview" />
        </div>

        <div className="info-right">
          <h3>O melhor downloader do YouTube</h3>
          <p>
           O BoltClip é um dos melhores baixadores de vídeos do YouTube nos formatos MP3 e MP4. Ele oferece uma ferramenta gratuita e fácil de usar que permite salvar vídeos (até 1080p), Shorts e imagens do YouTube com apenas um clique. Seja para baixar um vídeo em alta resolução, um clipe do YouTube Shorts ou simplesmente salvar uma foto de uma publicação, o BoltClip torna todo o processo rápido e direto. Basta inserir o link do YouTube, escolher a qualidade desejada e fazer o download diretamente no seu dispositivo.
          </p>
        </div>
      </section>

      {/* FAQ */}
     <section className="faq">
  <h3>Perguntas frequentes (FAQ)</h3>

  <div className="faq-item">
    <h4>Como baixar vídeos do YouTube rapidamente?</h4>
    <p>
      Baixar vídeos do YouTube nunca foi tão rápido com o BoltClip. Em poucos segundos,
      você pode salvar seus vídeos favoritos diretamente no seu dispositivo, sem precisar
      instalar aplicativos ou criar uma conta.
    </p>
  </div>

  <div className="faq-item">
    <h4>Funciona em Android e iPhone?</h4>
    <p>
      Seja no Android ou no iPhone, o BoltClip facilita o download de vídeos do YouTube.
      Basta colar o link do vídeo, escolher o formato desejado e salvar tudo no seu
      dispositivo com apenas alguns cliques.
    </p>
  </div>

  <div className="faq-item">
    <h4>É possível baixar vídeos em qualidade HD?</h4>
    <p>
      O BoltClip permite baixar vídeos do YouTube em qualidade HD em questão de segundos.
      Assim, você pode assistir a conteúdos com imagem nítida e alta qualidade a qualquer
      momento, mesmo sem conexão com a internet.
    </p>
  </div>
</section>

      {/* FOOTER */}
    <footer className="footer">
        <div>
          <h4>BoltClip</h4>
          <a href="/sobre">Sobre</a>
          <a href="/contato">Entre em contato</a>
        </div>

        <div>
          <h4>Legal</h4>
          <a href="/como-usar">Como usar?</a>
          <a href="/privacidade">Política de privacidade</a>
        </div>

        <div>
          <h4>Ferramentas</h4>
          <a href="/youtube">Baixar vídeos do YTB</a>
          <a href="/instagram">Baixar vídeos do Instagram</a>
        </div>

        <div className="footer-bottom">
          <p>
            BoltClip.com o melhor baixador de vídeos do YouTube © 2026
          </p>
          <p>
            Este serviço não é afiliado ao YouTube. Este site NÃO hospeda nem armazena vídeos em seus servidores.
          </p>
        </div>
    </footer>
    </div>
  );
}

export default App;