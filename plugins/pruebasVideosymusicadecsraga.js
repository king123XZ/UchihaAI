import axios from 'axios'

const handler = async (m, { conn, args, usedPrefix, command }) => {
  const url = args[0]
  if (!url || !url.includes('youtube.com') && !url.includes('youtu.be')) {
    return m.reply(`✴️ *Uso:* ${usedPrefix + command} <enlace de YouTube>`)
  }

  try {
    m.react('⏳')
    const { data } = await axios.post('https://snapsave.app/action.php?lang=es', new URLSearchParams({
      url: url,
      token: ''
    }), {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'user-agent': 'Mozilla/5.0'
      }
    })

    const snapHTML = data
    const match = snapHTML.match(/href="(https:\/\/.*?\.mp4.*?)"/)
    if (!match) throw '❌ No se pudo extraer el enlace de descarga.'

    const downloadUrl = match[1]

    await conn.sendMessage(m.chat, {
      video: { url: downloadUrl },
      mimetype: 'video/mp4',
      caption: `✅ *Aquí tienes tu video descargado con SnapSave*`
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply('⚠️ Ocurrió un error al intentar descargar el video.')
  }
}

handler.command = ['ytmp4snapsave']
handler.help = ['ytmp4snapsave <url>']
handler.tags = ['downloader']

export default handler