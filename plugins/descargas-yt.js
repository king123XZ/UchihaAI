import axios from 'axios'
import cheerio from 'cheerio'

let handler = async (m, { text, command, usedPrefix }) => {
  if (!text || !/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(text)) {
    throw `❌ Usa el comando correctamente:\n${usedPrefix + command} https://youtube.com/watch?v=ID`
  }

  try {
    const apiUrl = `https://p.oceansaver.in/api/widget?adUrl=${encodeURIComponent(text)}`
    const { data } = await axios.get(apiUrl)
    
    // Extraemos los enlaces del HTML usando cheerio
    const $ = cheerio.load(data)
    let downloadLinks = []

    $('a').each((_, el) => {
      const href = $(el).attr('href')
      if (href && href.includes('download')) {
        downloadLinks.push(href)
      }
    })

    if (!downloadLinks.length) {
      return m.reply('⚠️ No se pudo obtener ningún enlace de descarga.')
    }

    // Filtrar según el comando (mp3 o mp4)
    const filteredLinks = downloadLinks.filter(link =>
      command === 'ytmp3' ? link.includes('.mp3') : link.includes('.mp4')
    )

    if (!filteredLinks.length) {
      return m.reply(`⚠️ No se encontraron archivos ${command === 'ytmp3' ? 'de audio' : 'de video'} disponibles.`)
    }

    const result = filteredLinks[0]
    await m.reply(`✅ Enlace de descarga (${command.toUpperCase()}):\n${result}`)
  } catch (e) {
    console.error(e)
    m.reply('❌ Hubo un error al procesar el enlace.')
  }
}

handler.command = /^yt(mp3|mp4)$/i
handler.help = ['ytmp3 <url>', 'ytmp4 <url>']
handler.tags = ['downloader']

export default handler
