const handler = async (m, { conn, usedPrefix, command }) => {
  const widgetUrl = "https://p.oceansaver.in/api/widget?adUrl=https://myAdurl.com"

  const texto = `
╔════════════════════════════╗
║ 🌊 *Descarga Multimedia*   ║
╠════════════════════════════╣
║  Utiliza nuestro widget web
║  para descargar videos o música
║  de muchas plataformas.
║
║  1. Haz clic en el enlace.
║  2. Pega el enlace del video.
║  3. Elige formato y descarga.
╚════════════════════════════╝

🔗 *Enlace al widget:*
${widgetUrl}

*Abre el enlace en tu navegador.*
`.trim()

  await conn.reply(m.chat, texto, m)
}

handler.help = ['widgetoceansaver']
handler.tags = ['descargas']
handler.command = /^(widgetoceansaver|oceansaverwidget)$/i

export default handler
