import yts from 'yt-search' // npm install yt-search

export async function handler(m, { command, usedPrefix, text }) {
  if (command === 'play') {
    if (!text) return m.reply('❌ Por favor, ingresa el nombre o link de la canción que quieres buscar.')

    try {
      const ytResult = await searchYouTube(text)
      if (!ytResult) return m.reply('❌ No encontré resultados para tu búsqueda.')

      const message = `🎵 Resultado de búsqueda:
Título: ${ytResult.title}
Duración: ${ytResult.duration}
Canal: ${ytResult.author}
Link: ${ytResult.url}`

      m.reply(message)
    } catch (error) {
      console.error(error)
      m.reply('❌ Ocurrió un error al buscar la canción.')
    }
  }

  // Aquí puedes agregar más comandos si quieres
}

async function searchYouTube(query) {
  const results = await yts(query)
  if (results && results.videos && results.videos.length > 0) {
    const video = results.videos[0]
    return {
      title: video.title,
      url: video.url,
      duration: video.timestamp,
      author: video.author.name
    }
  }
  return null
}
