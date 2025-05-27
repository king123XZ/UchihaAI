let handler = async (m, { conn, usedPrefix }) => {
  const videoUrl = 'https://f.uguu.se/AlWbsGhh.mp4'
  const name = await conn.getName(m.sender)
  const date = new Date().toLocaleDateString('es', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })
  const time = new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
  const totalUsers = Object.keys(global.db.data.users).length
  const uptime = clockString(process.uptime() * 1000)
  const botName = 'UchihaAi'

  const texto = `
╭───────────────「 *${botName} - Menú de Descargas* 」───────────────╮
│👤 *Usuario:* ${name}
│📅 *Fecha:* ${date}
│⏰ *Hora:* ${time}
│👥 *Usuarios activos:* ${totalUsers}
│⚙️ *Uptime:* ${uptime}
╰──────────────────────────────────────────────────────────────╯

📥 *Comandos de Descarga:*

🎵 ${usedPrefix}play <texto>       - Descargar música de YouTube
🎬 ${usedPrefix}video <texto>      - Descargar video de YouTube
📺 ${usedPrefix}ytmp3 <link>       - Descargar audio mp3 de YouTube
📹 ${usedPrefix}ytmp4 <link>       - Descargar video mp4 de YouTube
🖼️ ${usedPrefix}imagen <texto>      - Buscar imagen en la web

──────────────────────────────────────────────────────────────
✨ *Disfruta de tus descargas con UchihaAi.* ✨
  `.trim()

  await conn.sendMessage(m.chat, {
    video: { url: videoUrl },
    caption: texto,
    gifPlayback: true,
    footer: '¡Gracias por usar UchihaAi!',
    headerType: 4
  }, { quoted: m })

  await conn.sendMessage(m.chat, {
    text: `Para volver al menú principal, escribe o toca: *${usedPrefix}menu*`
  })
}

handler.command = ['descargas', 'download', 'descarga']
handler.help = ['descargas']
handler.tags = ['download']
handler.register = true

export default handler

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}