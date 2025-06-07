import express from "express";
import { readFile } from "fs/promises";
import { resolve, join } from "path";

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
      <title>Visor de Archivo</title>
      <style>
        body {
          margin: 0;
          font-family: 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #1d1f21, #3c3f41);
          color: #eee;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          animation: fadeIn 1s ease-in;
        }
        .container {
          background: #2b2b2b;
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
          max-width: 800px;
          width: 90%;
          animation: slideUp 0.6s ease-out;
        }
        pre {
          white-space: pre-wrap;
          word-wrap: break-word;
          color: #9cdcfe;
        }
        @keyframes fadeIn {
          from { opacity: 0 }
          to { opacity: 1 }
        }
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0 }
          to { transform: translateY(0); opacity: 1 }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Contenido del archivo.txt</h2>
        <pre>${content}</pre>
      </div>
    </body>
    </html>
    `;

    res.send(html);
  } catch (err) {
    console.error("Error al leer el archivo:", err.message);
    res.status(500).send("No se pudo leer el archivo.");
  }
});

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});