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

  if (!global.commands) {
    return await m.reply('No hay comandos registrados en el bot.')
  }

  // Filtrar comandos con tag 'download'
  const downloadCommands = Object.values(global.commands).filter(cmd => cmd.tags && cmd.tags.includes('download'))

  if (downloadCommands.length === 0) {
    return await m.reply('No hay comandos de descarga disponibles.')
  }

  // Construir lista de comandos en texto
  const comandosTexto = downloadCommands.map(cmd => {
    let cmds = Array.isArray(cmd.command) ? cmd.command : [cmd.command]
    return `🎯 ${usedPrefix}${cmds[0]}`
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