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

  const tags = {
    descargas: '⬇️ Descargas',
    group: '👥 Grupos'
  }

  let help = Object.values(global.plugins)
    .filter(plugin => !plugin.disabled)
    .map(plugin => ({
      help: Array.isArray(plugin.help) ? plugin.help : [plugin.help],
      tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
      prefix: 'customPrefix' in plugin,
    }))

  let menuText = ''

  for (const tag in tags) {
    let section = `\n*${tags[tag]}*\n`
    let cmds = help
      .filter(menu => menu.tags && menu.tags.includes(tag) && menu.help)
      .map(menu => menu.help.map(cmd => `• ${usedPrefix}${cmd}`).join('\n'))
      .join('\n')
    if (cmds.trim().length) section += cmds + '\n'
    menuText += section
  }

  // Nota de voz
  await conn.sendMessage(m.chat, {
    audio: { url: audioUrl },
    mimetype: 'audio/mp4',
    ptt: true
  }, { quoted: m })

  const caption = `
╭━━━━━━━[ *${botName}* ]━━━━━━━╮
┃ 👤 Usuario: ${name}
┃ 📅 Fecha: ${date}
┃ ⏰ Hora: ${time}
┃ 👥 Usuarios activos: ${totalUsers}
┃ ⚙️ Uptime: ${uptime}
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

${menuText}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ *Bot de WhatsApp moderno, rápido y confiable.* ✨
`.trim()

  // Enviar video con botones compatibles con WhatsApp Negocios y normal
  await conn.sendMessage(m.chat, {
    video: { url: menuVideo },
    caption: caption,
    gifPlayback: true,
    footer: '꧁𓆩 UchihaAi 𓆪꧂ | ¡Gracias por preferirnos!',
    templateButtons: [
      { index: 1, quickReplyButton: { displayText: '🔍 Menú Completo', id: `${usedPrefix}allmenu` } },
      { index: 2, quickReplyButton: { displayText: '📥 Descargas', id: `${usedPrefix}ytmp3` } },
      { index: 3, quickReplyButton: { displayText: '📂 Grupos', id: `${usedPrefix}linkgc` } }
    ]
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
