let handler = async (m, { conn }) => {
  // URL del video original
  const videoUrl = 'https://f.uguu.se/AlWbsGhh.mp4'

  // Primero, enviamos el audio extraído (usamos el mismo video como fuente)
  await conn.sendMessage(m.chat, {
    audio: { url: videoUrl },
    mimetype: 'audio/mp4',
    ptt: false, // true si quieres que se escuche como nota de voz
    fileName: 'audio_especial.mp3'
  }, { quoted: m })

  // Luego, enviamos el video como siempre
  await conn.sendMessage(m.chat, {
    video: { url: videoUrl },
    caption: '🎥 Aquí tienes el video especial',
    gifPlayback: true // se reproduce automáticamente como un loop
  }, { quoted: m })
}

handler.command = ['videoespecial']
handler.help = ['videoespecial']
handler.tags = ['main']

export default handler