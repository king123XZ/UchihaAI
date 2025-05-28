import axios from 'axios'
import cheerio from 'cheerio'

let handler = async (m, { text, command, usedPrefix }) => {
  if (!text || !/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(text)) {
    throw `❌ Usa el comando correctamente:\n${usedPrefix + command} https://youtube.com/watch?v=ID`
  }

  try {
    const apiUrl = `https://p.oceansaver.in/api/widget?adUrl=${encodeURIComponent(text)}`
    const { data: html } = await axios.get(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    })

    const $ = cheerio.load(html)
    let foundLink = null

    $('a').each((i, el) => {
      const href = $(el).attr('href')
      if (href && /^https?:\/\/.*\.(mp3|mp4)/i.test(href)) {
        if (command === 'ytmp3' && href.includes('.mp3')) foundLink = href
        if (command === 'ytmp4' && href.includes('.mp4')) foundLink = href
      }
    })

    if (!foundLink) {
      // Posiblemente en scripts, intenta extraer desde <script> si es necesario
      const scriptContent = $('script').map((i, el) => $(el).html()).get().join('\n')
      const match = scriptContent.match(/https?:\/\/[^\s"'<>]+?\.(mp3|mp4)/i)
      if (match) foundLink = match[0]
    }

    if (!foundLink) {
      return m.reply('⚠️ No se pudo obtener ningún enlace de descarga del video.')
    }

    await m.reply(`✅ Enlace de descarga:\n${foundLink}`)
  } catch (e) {
    console.error(e)
    m.reply('❌ Ocurrió un error al procesar tu solicitud.')
  }
}

handler.command = /^yt(mp3|mp4)$/i
handler.help = ['ytmp3 <url>', 'ytmp4 <url>']
handler.tags = ['downloader']

export default handler

