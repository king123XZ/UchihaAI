let handler = async (m, { conn, usedPrefix }) => {
  const videoUrl = 'https://qu.ax/bsSQY.mp4'
  const name = await conn.getName(m.sender)
  const date = new Date().toLocaleDateString('es', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })
  const time = new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })
  const totalUsers = Object.keys(global.db.data.users).length
  const uptime = clockString(process.uptime() * 1000)
  const botName = 'UchihaAi'
  const menuVideo = videoUrl
  const audioUrl = videoUrl

  // Enviar nota de voz con audio
  await conn.sendMessage(m.chat, {
    audio: { url: audioUrl },
    mimetype: 'audio/mp4',
    ptt: true
  }, { quoted: m })

  // Texto del menú
  const texto = `
╭───────────────「 *${botName}* 」───────────────╮
│👤 *Usuario:* ${name}
│📅 *Fecha:* ${date}
│⏰ *Hora:* ${time}
│👥 *Usuarios activos:* ${totalUsers}
│⚙️ *Uptime:* ${uptime}
╰───────────────────────────────────────────────╯

📋 *Menú Principal:*

🎯 ${usedPrefix}menu      - Mostrar este menú
🧑‍💼 ${usedPrefix}owner     - Información del creador
👥 ${usedPrefix}grupos    - Lista de grupos disponibles

─────────────────────────────────────────────
✨ *Bot de WhatsApp moderno, rápido y confiable.* ✨
  `.trim()

  // Enviar video con menú
  await conn.sendMessage(m.chat, {
    video: { url: menuVideo },
    caption: texto,
    gifPlayback: true,
    footer: '¡Gracias por usar UchihaAi!',
    headerType: 4
  }, { quoted: m })

  // Enviar mensaje con texto y comando para que usuario toque o copie
  await conn.sendMessage(m.chat, {
    text: `Para ver el menú completo, escribe o toca: *${usedPrefix}menu*`
  })
}

handler.command = ['menu', 'menú', 'videoespecial']
handler.help = ['menu']
handler.tags = ['main']
handler.register = true

export default handler

function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':')
}
