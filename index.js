import express from "express";
import { readFile } from "fs/promises";
import { resolve, join } from "path";
import qrcode from "qrcode-terminal"; // Solo si usas Baileys u otro sistema
// import { startBot } from "./bot"; // ← Tu función original de conexión del bot aquí

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(join(resolve(), "public")));

app.get("/", async (req, res) => {
  try {
    const filePath = join(resolve(), "archivo.txt");
    const content = await readFile(filePath, "utf8");

    const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Servidor Local</title>
      <style>
        body {
          margin: 0;
          font-family: 'Segoe UI', sans-serif;
          background: #121212;
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          text-align: center;
        }
        .card {
          background: #1e1e1e;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 10px 20px rgba(0,0,0,0.4);
          max-width: 600px;
          animation: fadeIn 0.8s ease;
        }
        h1 {
          color: #00ffcc;
          margin-bottom: 1rem;
        }
        pre {
          text-align: left;
          background: #272727;
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
          max-height: 300px;
          color: #9cdcfe;
        }
        button {
          background: #00ffcc;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          color: #000;
          font-weight: bold;
          cursor: pointer;
          margin-top: 20px;
        }
        button:hover {
          background: #00bfa5;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>Servidor HP - Localhost</h1>
        <p>Estado del archivo de configuración:</p>
        <pre>${content}</pre>
        <button onclick="connect()">Conectar WhatsApp</button>
        <p id="status"></p>
      </div>
      <script>
        function connect() {
          fetch('/connect-bot')
            .then(res => res.text())
            .then(msg => {
              document.getElementById('status').textContent = msg;
            })
            .catch(err => {
              document.getElementById('status').textContent = "Error al conectar.";
            });
        }
      </script>
    </body>
    </html>
    `;

    res.send(html);
  } catch (err) {
    console.error("Error al leer el archivo:", err.message);
    res.status(500).send("Error leyendo archivo.");
  }
});

app.get("/connect-bot", async (req, res) => {
  try {
    // Aquí podrías poner `await startBot()` si tienes esa función.
    // Por ahora solo simulamos:
    console.log("Intentando conectar WhatsApp...");
    // Simulamos QR de conexión
    qrcode.generate("Simulando conexión WhatsApp...", { small: true });
    res.send("Bot conectado a WhatsApp (simulado). Revisa consola para QR.");
  } catch (err) {
    res.status(500).send("Error al conectar el bot.");
  }
});

app.listen(PORT, () => {
  console.log("🟢 Modo Servidor HP Localhost activo");
  console.log(`🌐 Servidor en: http://localhost:${PORT}`);
});