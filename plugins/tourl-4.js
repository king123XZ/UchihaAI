//creador del codigo dv.yer uso libre no borras esto dar las gracias 
// codigo de UchihaAI


const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

async function handler(m, { conn, usedPrefix, command }) {
  const quoted = m.quoted || m;
  const mime = (quoted.msg || quoted).mimetype || "";

  if (!/image|video|audio|application/.test(mime)) {
    return conn.sendMessage(m.chat, { text: `✳️ Responde a un archivo (imagen, video, audio, documento) con el comando *${usedPrefix + command}*` }, { quoted: m });
  }

  const mediaPath = await conn.downloadAndSaveMediaMessage(quoted);
  const form = new FormData();
  form.append("files[]", fs.createReadStream(mediaPath));

  try {
    const res = await axios.post("https://qu.ax/upload.php", form, {
      headers: form.getHeaders(),
    });

    if (res.data.success && res.data.files.length > 0) {
      const url = res.data.files[0].url;
      await conn.sendMessage(m.chat, {
        text: `✅ Archivo subido correctamente:\n\n📎 ${url}`,
      }, { quoted: m });
    } else {
      throw new Error("No se pudo obtener el enlace del archivo.");
    }
  } catch (err) {
    console.error("Error al subir a qu.ax:", err);
    await conn.sendMessage(m.chat, {
      text: `❌ Error al subir el archivo.`,
    }, { quoted: m });
  } finally {
    fs.unlinkSync(mediaPath);
  }
}

handler.command = /^tourl1$/i;
handler.help = ['tourl'];
handler.tags = ['tools'];

module.exports = handler;
