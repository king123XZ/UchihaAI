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
  const menuImage = 'https://f.uguu.se/AlWbsGhh.mp4' // Puedes personalizar este link

  // Enviar primero la nota de voz del video
  await conn.sendMessage(m.chat, {
    audio: { url: videoUrl },
    mimetype: 'audio/mp4',
    ptt: true
  }, { quoted: m })

  // Luego enviar el video como gif con audio
  await conn.sendMessage(m.chat, {
    video: { url: videoUrl },
    caption: '🎥 Aquí tienes el video especial con audio',
    gifPlayback: true
  }, { quoted: m })

  // Finalmente mostrar el menú sin botones
  const texto = `
╭─────「 *${botName}* 」─────
│ 𖧷 *Usuario:* ${name}
│ 𖧷 *Fecha:* ${date}
│ 𖧷 *Hora:* ${time}
│ 𖧷 *Usuarios:* ${totalUsers}
│ 𖧷 *Activo:* ${uptime}
╰──────────────────────

┌──〔 *Menú Principal* 〕
│ 𖧷 ${usedPrefix}menu
│ 𖧷 ${usedPrefix}owner
│ 𖧷 ${usedPrefix}grupos
└───────────────

▣ *Bot de WhatsApp moderno y rápido.*
`.trim()

  await conn.sendMessage(m.chat, {
    image: { url: menuImage },
    caption: texto,
    footer: '¡Gracias por usar el bot!',
    headerType: 4
  }, { quoted: m })
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