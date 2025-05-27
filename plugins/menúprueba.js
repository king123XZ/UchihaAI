let handler = async (m, { conn }) => {
  await conn.sendMessage(m.chat, {
    video: { url: 'https://f.uguu.se/AlWbsGhh.mp4' },
    caption: '🎥 Aquí tienes tu video especial con audio',
    gifPlayback: true // se reproduce como gif, pero mantiene audio como video normal
  }, { quoted: m })
}

handler.command = ['videoespecial']
handler.help = ['videoespecial']
handler.tags = ['main']

export default handler