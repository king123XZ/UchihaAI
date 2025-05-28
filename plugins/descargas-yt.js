import axios from 'axios'

let handler = async (m, { text, command, usedPrefix }) => {
  if (!text) {
    throw `❌ Usa el comando así:\n${usedPrefix + command} https://youtube.com/watch?v=ID`
  }

  const urlYT = encodeURIComponent(text)
  const apiUrl = `https://p.oceansaver.in/api/widget?adUrl=${urlYT}`

  try {
    const response = await axios.get(apiUrl, {
      maxRedirects: 0,
      validateStatus: status => status >= 200 && status < 400
    })

    let finalUrl = response.headers.location || apiUrl

    await m.reply(`✅ Enlace de descarga:\n${finalUrl}`)
  } catch (err) {
    console.error(err)
    await m.reply('❌ Error al procesar el enlace. Asegúrate de que sea un link válido de YouTube.')
  }
}

handler.command = /^yt(mp3|mp4)$/i
handler.help = ['ytmp3 <url>', 'ytmp4 <url>']
handler.tags = ['downloader']

export default handler
