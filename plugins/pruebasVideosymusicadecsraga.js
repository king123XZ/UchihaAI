import axios from 'axios';
import fetch from 'node-fetch';

const handler = async (m, { conn, args }) => {
  const url = args[0];
  
  // Validar la URL de YouTube
  if (!url || !url.match(/(youtube\.com|youtu\.be)/i)) {
    return m.reply('❌ Por favor, proporciona un enlace válido de YouTube.');
  }

  try {
    await m.react('⏳');
    
    // Primero obtener información del video para el nombre del archivo
    const infoResponse = await fetch(`https://yt.lemnoslife.com/videos?part=title&id=${url.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/)[1]}`);
    const infoData = await infoResponse.json();
    const title = infoData?.items?.[0]?.title || 'audio_youtube';
    const safeTitle = title.replace(/[^\w\s]/gi, '').trim() + '.mp3';
    
    // Descargar el audio usando una API diferente
    const audioResponse = await axios.get(`https://api.download-lagu-mp3.com/@api/button/mp3/${encodeURIComponent(url)}`, {
      responseType: 'arraybuffer',
      headers: {
        'Accept': 'audio/mpeg'
      }
    });

    await conn.sendMessage(m.chat, {
      audio: audioResponse.data,
      mimetype: 'audio/mpeg',
      fileName: safeTitle.substring(0, 64) // Limitar longitud del nombre
    }, { quoted: m });
    
    await m.react('✅');

  } catch (error) {
    console.error('Error al descargar:', error);
    await m.react('❌');
    m.reply('⚠️ Ocurrió un error al descargar el audio. Intenta con otro enlace.');
  }
};

handler.help = ['ytmp1 <url>'];
handler.tags = ['downloader'];
handler.command = /^yt(mp3|audio)$/i;

export default handler;