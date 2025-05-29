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

  // Tags para mostrar solo comandos de 'descargas' y 'grupos'
  const tags = {
    descargas: '⬇️ Descargas',
    group: '👥 Grupos'
  }

  // Obtener plugins activos y filtrar por tags
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

  // Nota de voz de bienvenida
  await conn.sendMessage(m.chat, {
    audio: { url: audioUrl },
    mimetype: 'audio/mp4',
    ptt: true
  }, { quoted: m })

  // Menú principal con solo los tags seleccionados
  const texto = `
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

  // Enviar video con menú y pie de página estilizado
  await conn.sendMessage(m.chat, {
    video: { url: menuVideo },
    caption: texto,
    gifPlayback: true,
    footer: '꧁𓆩 UchihaAi 𓆪꧂ | ¡Gracias por preferirnos!',
    headerType: 4
  }, { quoted: m })

  // Mensaje extra con shortcut al menú completo
  await conn.sendMessage(m.chat, {
    text: `🟢 Para ver el menú completo, escribe o toca: *${usedPrefix}menu*`
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
