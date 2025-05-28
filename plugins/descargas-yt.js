import fetch from 'node-fetch'

const API_KEY = 'dfcb6d76f2f6a9894gjkege8a4ab232222'
const API_URL = 'https://p.oceansaver.in/ajax/download.php'

const handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    await conn.reply(
      m.chat,
      `🌊 *Descargas de Video y Música*\n\n` +
      `Envía el comando así:\n` +
      `*${usedPrefix + command} <enlace> [mp3|mp4]*\n\n` +
      `Ejemplo:\n` +
      `> ${usedPrefix + command} https://www.youtube.com/watch?v=dQw4w9WgXcQ mp3\n` +
      `> ${usedPrefix + command} https://www.youtube.com/watch?v=dQw4w9WgXcQ mp4`,
      m
    )
    return
  }

  let url = args[0]
  let format = (args[1] || 'mp4').toLowerCase()
  if (!['mp3', 'mp4'].includes(format)) format = 'mp4'

  await conn.reply(
    m.chat,
    `⏳ Procesando tu descarga de ${format === 'mp3' ? 'música' : 'video'}...`,
    m
  )

  try {
    let api = `${API_URL}?format=${format}&url=${encodeURIComponent(url)}&api=${API_KEY}`
    let res = await fetch(api)
    let json = await res.json()

    if (!json?.url) {
      await conn.reply(m.chat, '❌ No se pudo obtener el archivo. El enlace podría ser inválido o no soportado.', m)
      return
    }

    if (format === 'mp4') {
      await conn.sendMessage(
        m.chat,
        {
          video: { url: json.url },
          mimetype: 'video/mp4',
          caption: `✅ *Video descargado exitosamente*\n\n*Fuente:* ${url}`
        },
        { quoted: m }
      )
    } else {
      await conn.sendMessage(
        m.chat,
        {
          audio: { url: json.url },
          mimetype: 'audio/mpeg',
          fileName: (json.title || 'audio') + '.mp3',
          caption: `✅ *Música descargada exitosamente*\n\n*Fuente:* ${url}`
        },
        { quoted: m }
      )
    }
  } catch (e) {
    console.error(e)
    await conn.reply(m.chat, '❌ Ocurrió un error al intentar descargar el archivo.', m)
  }
}

handler.help = ['descargar <enlace> [mp3|mp4]']
handler.tags = ['descargas']
handler.command = /^(descargar|dload|ytmusica|ytvideo)$/i
handler.register = false

export default handler
