import axios from 'axios';

const handler = async (m, { conn, args }) => {
  const url = args[0];
  if (!url || !url.includes('youtube.com') && !url.includes('youtu.be')) {
    return m.reply('❌ Por favor, proporciona un enlace válido de YouTube.');
  }

  try {
    m.react('⏳');
    const response = await axios.get(`https://youtube-download-api.matheusishiyama.repl.co/mp3/?url=${encodeURIComponent(url)}`, {
      responseType: 'arraybuffer'
    });

    const title = 'audio.mp3'; // Puedes obtener el título real si la API lo proporciona
    await conn.sendMessage(m.chat, {
      audio: response.data,
      mimetype: 'audio/mpeg',
      fileName: title
    }, { quoted: m });

  } catch (error) {
    console.error(error);
    m.reply('⚠️ Ocurrió un error al intentar descargar el audio.');
  }
};

handler.command = ['ytmp31'];
handler.help = ['ytmp31 <enlace de YouTube>'];
handler.tags = ['downloader'];

export default handler;