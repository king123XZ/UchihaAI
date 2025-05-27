import axios from 'axios';
import FormData from 'form-data';

const handler = async (m, { conn, args }) => {
  const url = args[0];
  
  // Validate YouTube URL
  if (!url || !url.match(/(youtube\.com|youtu\.be)/i)) {
    return m.reply('❌ Por favor, proporciona un enlace válido de YouTube.');
  }

  try {
    await m.react('⏳');
    
    // Step 1: Submit URL to AISEO API
    const formData = new FormData();
    formData.append('url', url);
    
    const submitResponse = await axios.post('https://app.aiseo.ai/api/youtube-to-mp3', formData, {
      headers: formData.getHeaders()
    });
    
    if (!submitResponse.data.success) {
      throw new Error('API submission failed');
    }
    
    const processId = submitResponse.data.process_id;
    
    // Step 2: Check conversion status (with retries)
    let downloadUrl;
    let attempts = 0;
    const maxAttempts = 10;
    
    while (attempts < maxAttempts) {
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds
      
      const statusResponse = await axios.get(`https://app.aiseo.ai/api/youtube-to-mp3/status?process_id=${processId}`);
      
      if (statusResponse.data.status === 'completed') {
        downloadUrl = statusResponse.data.download_url;
        break;
      } else if (statusResponse.data.status === 'failed') {
        throw new Error('Conversion failed');
      }
    }
    
    if (!downloadUrl) {
      throw new Error('Conversion timed out');
    }
    
    // Step 3: Download the MP3
    const audioResponse = await axios.get(downloadUrl, {
      responseType: 'arraybuffer'
    });
    
    // Get video title for filename
    const videoInfo = await axios.get(`https://noembed.com/embed?url=${encodeURIComponent(url)}`);
    const title = videoInfo.data.title || 'audio_youtube';
    const safeTitle = title.replace(/[^\w\s]/gi, '').trim() + '.mp3';
    
    // Send audio
    await conn.sendMessage(m.chat, {
      audio: audioResponse.data,
      mimetype: 'audio/mpeg',
      fileName: safeTitle.substring(0, 64)
    }, { quoted: m });
    
    await m.react('✅');

  } catch (error) {
    console.error('Error:', error);
    await m.react('❌');
    m.reply('⚠️ Error al procesar el audio. Intenta con otro enlace o más tarde.');
  }
};

handler.help = ['ytmp3 <url>'];
handler.tags = ['downloader'];
handler.command = /^yt(mp3|audio)$/i;

export default handler;