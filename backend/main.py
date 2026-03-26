from fastapi import FastAPI, WebSocket
import yt_dlp
import threading
import os
import asyncio
from fastapi.responses import FileResponse
from fastapi import HTTPException
main_loop = None

app = FastAPI()

connections = []

async def send(ws, msg):
    try:
        await ws.send_text(msg)
    except:
        pass

def broadcast(msg):
    if main_loop is None:
        return

    for ws in connections:
        asyncio.run_coroutine_threadsafe(send(ws, msg), main_loop)

def hook_progresso(d):
    if d["status"] == "downloading":
        percent = d.get("_percent_str", "").strip()
        speed = d.get("_speed_str", "")
        eta = d.get("_eta_str", "")
        broadcast(f"{percent} | {speed} | ETA: {eta}")

    elif d["status"] == "finished":
        broadcast("Processando arquivo...")

def baixar(url, qualidade):
    try:
        os.makedirs("videos", exist_ok=True)

        ydl_opts = {
            "outtmpl": "videos/%(title)s.%(ext)s",
            "format": "bestvideo+bestaudio/best",
            "progress_hooks": [hook_progresso],
            "merge_output_format": "mp4",
            "extractor_args": {
                "youtube": {
                    "player_client": ["android"]
                }
            },
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            nome_arquivo = ydl.prepare_filename(info)

        nome_arquivo = os.path.basename(nome_arquivo)

        broadcast(f"Download concluído::{nome_arquivo}")

    except Exception as e:
        broadcast(f"Erro: {str(e)}")

@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    global main_loop

    await ws.accept()
    connections.append(ws)

    # 👇 salva o loop principal
    main_loop = asyncio.get_running_loop()

    try:
        while True:
            data = await ws.receive_text()
            import json
            payload = json.loads(data)

            url = payload["url"]
            qualidade = payload["qualidade"]

            threading.Thread(target=baixar, args=(url, qualidade)).start()

    except:
        connections.remove(ws)

@app.get("/baixar-arquivo")
def baixar_arquivo(nome: str):
    caminho = f"videos/{nome}"

    if not os.path.exists(caminho):
        raise HTTPException(status_code=404, detail="Arquivo não encontrado")

    return FileResponse(caminho, media_type="application/octet-stream", filename=nome)


@app.websocket("/ws")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    connections.append(ws)

    try:
        while True:
            data = await ws.receive_text()
            import json
            payload = json.loads(data)

            url = payload["url"]
            qualidade = payload["qualidade"]

            threading.Thread(target=baixar, args=(url, qualidade)).start()

    except:
        connections.remove(ws)