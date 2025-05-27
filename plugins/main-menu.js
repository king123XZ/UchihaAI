import { xpRange } from '../lib/levelling.js'
import { promises as fs } from 'fs'
import { join } from 'path'

let handler = async (m, { conn, usedPrefix }) => {
  let { exp, limit, level } = global.db.data.users[m.sender]
  let { min, xp, max } = xpRange(level, global.multiplier)
  let name = await conn.getName(m.sender)
  let date = new Date().toLocaleDateString('es', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  let time = new Date().toLocaleTimeString('es')
  let totalreg = Object.keys(global.db.data.users).length

  let menu = `
*🌟 𝗠𝗘𝗡𝗨 𝗗𝗘 𝗨𝗖𝗛𝗜𝗛𝗔𝗔𝗜 🌟*

👤 *Usuario:* ${name}
🎮 *Nivel:* ${level}
⚡ *Exp:* ${exp}/${max}
📅 *Fecha:* ${date}
⏰ *Hora:* ${time}
🧾 *Usuarios registrados:* ${totalreg}

🎮 *Comandos populares:*
- ${usedPrefix}menu
- ${usedPrefix}juegos
- ${usedPrefix}sticker
- ${usedPrefix}descargas
- ${usedPrefix}tools
- ${usedPrefix}owner
- ${usedPrefix}videoespecial

🎥 *Video especial disponible abajo*
`.trim()

  const buttons = [
    { buttonId: `${usedPrefix}owner`, buttonText: { displayText: "👑 Creador" }, type: 1 },
    { buttonId: `${usedPrefix}videoespecial`, buttonText: { displayText: "🎥 Video Especial" }, type: 1 },
  ]

  let image = 'https://qu.ax/sBBQh.jpg'

  await conn.sendMessage(m.chat, {
    image: { url: image },
    caption: menu,
    buttons,
    footer: "UchihaAi - Bot WhatsApp",
  }, { quoted: m })
}

handler.command = ['menu', 'menú', 'help', 'ayuda']
export default handler