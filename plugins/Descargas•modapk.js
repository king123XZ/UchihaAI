import { search, download } from 'aptoide-scraper'

const handler = async (m, { conn, command, text }) => {
  if (!text) {
    await conn.reply(
      m.chat,
      `
╔══════════════════════════════╗
║    🚩 *DESCARGA DE APK* 🚩   ║
╠══════════════════════════════╣
║  Por favor, escribe el nombre
║  de la aplicación que deseas
║  buscar y descargar.
║
║  Ejemplo:
║  *${command} whatsapp*
╚══════════════════════════════╝
      `.trim(),
      m
    )
    return
  }

  try {
    // Mensaje de carga inicial
    const loading = await conn.reply(
      m.chat,
      `
╭━━━ 𝙰𝙿𝙺 𝙳𝙴𝚂𝙲𝙰𝚁𝙶𝙰 ━━━╮
┃ ⏳ Buscando aplicación...
┃ [▓          ] 10%
╰━━━━━━━━━━━━━━━╯
      `.trim(),
      m
    )

    // Buscar la app
    const results = await search(text)
    if (!results?.length) {
      await conn.reply(
        m.chat,
        `
❌ *No se encontró ninguna app con ese nombre en Aptoide.*
      `.trim(),
        m
      )
      return
    }

    // Mensaje de carga 50%
    await conn.reply(
      m.chat,
      `
╭━━━ 𝙰𝙿𝙺 𝙳𝙴𝚂𝙲𝙰𝚁𝙶𝙰 ━━━╮
┃ 📦 Descargando información...
┃ [█████       ] 50%
╰━━━━━━━━━━━━━━━╯
      `.trim(),
      m
    )

    const app = results[0]
    const data = await download(app.id)

    // Mensaje de carga 100%
    await conn.reply(
      m.chat,
      `
╭━━━ 𝙰𝙿𝙺 𝙳𝙴𝚂𝙲𝙰𝚁𝙶𝙰 ━━━╮
┃ 📲 Preparando tu descarga...
┃ [██████████] 100%
╰━━━━━━━━━━━━━━━╯
      `.trim(),
      m
    )

    // Info de la app
    const info = `
╔═━「 𝙳𝙴𝚃𝙰𝙻𝙻𝙴𝚂 𝙳𝙴 𝙻𝙰 𝙰𝙿𝙿 」━═╗
🌟 *Nombre:* ${data.name}
📦 *Paquete:* ${data.package}
🗓️ *Actualización:* ${data.lastup}
📥 *Peso:* ${data.size}
╚═══════════════════════════╝
`.trim()

    // Enviar miniatura e info
    await conn.sendFile(m.chat, data.icon, 'icon.jpg', info, m)

    // Peso máximo permitido (menos de 1000 MB y sin GB)
    const sizeMB = parseFloat(data.size.replace(/[^\d.]/g, ''))
    if ((/GB/i.test(data.size)) || (sizeMB > 999)) {
      await conn.reply(
        m.chat,
        `
🛑 *El archivo es demasiado pesado para enviarlo por WhatsApp.*
      `.trim(),
        m
      )
      return
    }

    // Mensaje de "Enviando APK"
    await conn.reply(
      m.chat,
      `
╭━━━ 𝙰𝙿𝙺 𝙳𝙴𝚂𝙲𝙰𝚁𝙶𝙰 ━━━╮
┃ 📤 Enviando APK, espera...
╰━━━━━━━━━━━━━━━╯
      `.trim(),
      m
    )

    // Enviar el APK
    await conn.sendMessage(
      m.chat,
      {
        document: { url: data.dllink },
        mimetype: 'application/vnd.android.package-archive',
        fileName: `${data.name}.apk`,
        caption: `
✅ *¡APK entregada!*
╰───────────────╯
`.trim()
      },
      { quoted: m }
    )

    // Mensaje final de entrega
    await conn.reply(
      m.chat,
      `
╭━━━ 𝙰𝙿𝙺 𝙳𝙴𝚂𝙲𝙰𝚁𝙶𝙰 ━━━╮
┃ 🎉 *¡Descarga entregada!* 
╰━━━━━━━━━━━━━━━╯
      `.trim(),
      m
    )
  } catch (e) {
    console.error(e)
    await conn.reply(
      m.chat,
      `
🛑 *Ocurrió un error al procesar la descarga.*
      `.trim(),
      m
    )
  }
}

// Configuración del handler
handler.tags = ['descargas']
handler.help = ['apk <nombre>', 'modapk <nombre>', 'aptoide <nombre>']
handler.command = /^(apk|modapk|aptoide)$/i
handler.register = true
handler.estrellas = 1

export default handler
