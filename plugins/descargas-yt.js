import axios from 'axios'

let handler = async (m, { text, command, usedPrefix }) => {
  if (!text) throw `❌ Usa el comando así:\n${usedPrefix + command} https://youtube.com/watch?v=ID`

  const apiUrl = `https://p.oceansaver.in/api/widget?adUrl=${encodeURIComponent(text)}`
  
  try {
    const response = await axios.get(apiUrl)
    const finalUrl = response.request?.res?.responseUrl || apiUrl

    const msg = `✅ Aquí tienes tu enlace de descarga:\n${finalUrl}`
    await m.reply(msg)
  } catch (e) {
    console.error(e)
    await m.reply('❌ Ocurrió un error al procesar el enlace de YouTube.')
  }
}

handler.command = /^yt(mp3|mp4)$/i
handler.help = ['ytmp3 <url>', 'ytmp4 <url>']
handler.tags = ['downloader']

export default handler
