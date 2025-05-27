let handler = async (m, { conn }) => {
  const videoUrl = 'https://f.uguu.se/AlWbsGhh.mp4'

  // Enviar primero el audio como nota de voz
  await conn.sendMessage(m.chat, {
    audio: { url: videoUrl },
    mimetype: 'audio/mp4',
    ptt: true // Esto lo convierte en nota de voz
  }, { quoted: m })

  // Luego enviar el video con gifPlayback (reproducción automática)
  await conn.sendMessage(m.chat, {
    video: { url: videoUrl },
    caption: '🎥 Aquí tienes el video especial con audio',
    gifPlayback: true
  }, { quoted: m })
}

handler.command = ['videoespecial']
handler.help = ['videoespecial']
handler.tags = ['main']

export default handler