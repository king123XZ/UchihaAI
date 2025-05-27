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

  // Filtrar comandos con tag 'download'
  let downloadCommands = Object.values(global.commands).filter(cmd => cmd.tags && cmd.tags.includes('download'))

  // Construir lista de comandos en texto
  let comandosTexto = downloadCommands.map(cmd => {
    let cmds = Array.isArray(cmd.command) ? cmd.command : [cmd.command]
    let cmdName = cmds[0]
    return `🎯 ${usedPrefix}${cmdName}`
  }).join('\n')

  const texto = `
╭───────────────「 *${botName} - Menú de Descargas* 」───────────────╮
│👤 *Usuario:* ${name}
│📅 *Fecha:* ${date}
│⏰ *Hora:* ${time}
│👥 *Usuarios activos:* ${totalUsers}
│⚙️ *Uptime:* ${uptime}
╰──────────────────────────────────────────────────────────────╯

📥 *Comandos de Descarga:*

${comandosTexto}

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