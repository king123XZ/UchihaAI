import fetch from "node-fetch"; import yts from 'yt-search'; import axios from "axios";

const formatAudio = ['mp3', 'm4a', 'webm', 'acc', 'flac', 'opus', 'ogg', 'wav']; const formatVideo = ['360', '480', '720', '1080', '1440', '4k'];

const ddownr = { download: async (url, format) => { if (!formatAudio.includes(format) && !formatVideo.includes(format)) { throw new Error('Formato no soportado, verifica la lista de formatos disponibles.'); }

const apiUrl = `https://p.oceansaver.in/ajax/download.php?format=${format}&url=${encodeURIComponent(url)}&api=dfcb6d76f2f6a9894gjkege8a4ab232222`;

try {
  const { data } = await axios.get(apiUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91.0.4472.124 Safari/537.36'
    }
  });

  if (data && data.success) {
    const downloadUrl = await ddownr.cekProgress(data.id);
    return {
      id: data.id,
      image: data.info.image,
      title: data.title,
      downloadUrl
    };
  } else {
    throw new Error('Fallo al obtener los detalles del video.');
  }
} catch (err) {
  console.error('Error:', err);
  throw err;
}

},

cekProgress: async (id) => { const url = https://p.oceansaver.in/ajax/progress.php?id=${id}; while (true) { try { const { data } = await axios.get(url); if (data?.success && data.progress === 1000) return data.download_url; await new Promise(r => setTimeout(r, 3000)); } catch (err) { throw err; } } } };

const handler = async (m, { conn, text, usedPrefix, command }) => { try { if (!text.trim()) return conn.reply(m.chat, '⚔️ Ingresa el nombre de la música a descargar.', m);

const { all: results } = await yts(text);
if (!results || results.length === 0) return m.reply('No se encontraron resultados para tu búsqueda.');

const video = results[0];
const { title, thumbnail, timestamp, views, ago, url } = video;
const vistas = formatViews(views);
const info = `📹 *Título:* ${title}\n👁️ *Vistas:* ${vistas}\n⏳ *Duración:* ${timestamp}\n📆 *Publicado:* ${ago}\n🔗 *Enlace:* ${url}`;

const thumb = (await conn.getFile(thumbnail))?.data;
const preview = {
  contextInfo: {
    externalAdReply: {
      title: 'Descarga de YouTube',
      body: 'Descarga rápida',
      mediaType: 1,
      previewType: 0,
      mediaUrl: url,
      sourceUrl: url,
      thumbnail: thumb,
      renderLargerThumbnail: true
    }
  }
};

await conn.reply(m.chat, info, m, preview);

if (['ytmp3', 'yta'].includes(command)) {
  const audio = await ddownr.download(url, 'mp3');
  await conn.sendMessage(m.chat, {
    audio: { url: audio.downloadUrl },
    mimetype: 'audio/mpeg'
  }, { quoted: m });

} else if (['ytmp4', 'ytv'].includes(command)) {
  const apis = [
    `https://api.siputzx.my.id/api/d/ytmp4?url=${url}`,
    `https://api.zenkey.my.id/api/download/ytmp4?apikey=zenkey&url=${url}`,
    `https://axeel.my.id/api/download/video?url=${encodeURIComponent(url)}`,
    `https://delirius-apiofc.vercel.app/download/ytmp4?url=${url}`
  ];

  for (let api of apis) {
    try {
      const res = await fetch(api);
      const json = await res.json();
      const downloadUrl = json?.data?.dl || json?.result?.download?.url || json?.downloads?.url || json?.data?.download?.url;
      if (downloadUrl) {
        return await conn.sendMessage(m.chat, {
          video: { url: downloadUrl },
          fileName: `${title}.mp4`,
          mimetype: 'video/mp4',
          caption: '🥷 Aquí tienes tu video',
          thumbnail: thumb
        }, { quoted: m });
      }
    } catch (e) {
      console.error(`API fallback error:`, e.message);
    }
  }
  return m.reply('⚔️ No se pudo descargar el video.');
} else {
  return m.reply('Comando no reconocido.');
}

} catch (err) { return m.reply(⚠️ Error: ${err.message}); } };

handler.command = ['play', 'ytmp3', 'yta', 'ytmp4', 'ytv']; handler.tags = ['downloader']; handler.help = ['play', 'ytmp3', 'ytmp4'];

export default handler;

function formatViews(views) { return views >= 1000 ? (views / 1000).toFixed(1) + 'k (' + views.toLocaleString() + ')' : views.toString(); }

