import axios from 'axios';
import cheerio from 'cheerio';

let handler = async (m, { text, command, usedPrefix }) => {
  if (!text || !/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\//i.test(text)) {
    throw `❌ Usa el comando correctamente:\n${usedPrefix + command} https://youtube.com/watch?v=ID`;
  }

  try {
    const apiUrl = `https://p.oceansaver.in/api/widget?adUrl=${encodeURIComponent(text)}`;
    const { data: html } = await axios.get(apiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8',
      }
    });

    const $ = cheerio.load(html);
    let foundLink = null;

    // Primero busca en los enlaces visibles
    $('a').each((i, el) => {
      const href = $(el).attr('href');
      if (href && /^https?:\/\/.*\.(mp3|mp4)/i.test(href)) {
        if (command === 'ytmp3' && href.includes('.mp3')) foundLink = href;
        if (command === 'ytmp4' && href.includes('.mp4')) foundLink = href;
      }
    });

    // Si no se encontró, intenta buscar en los <script>
    if (!foundLink) {
      const scriptText = $('script').map((i, el) => $(el).html()).get().join('\n');
      const match = scriptText.match(/https?:\/\/[^\s"'<>]+?\.(mp3|mp4)/i);
      if (match) foundLink = match[0];
    }

    // Mensaje si no encuentra el enlace
    if (!foundLink) {
      return m.reply('⚠️ No se pudo obtener ningún enlace de descarga. Intenta con otro video.');
    }

    await m.reply(`✅ Enlace de descarga (${command.toUpperCase()}):\n${foundLink}`);
  } catch (err) {
    console.error('[ERROR EN YTMP3/YTMP4]', err);
    m.reply('❌ Ocurrió un error al procesar tu solicitud. Intenta nuevamente o usa otro enlace.');
  }
};

handler.command = /^yt(mp3|mp4)$/i;
handler.help = ['ytmp3 <url>', 'ytmp4 <url>'];
handler.tags = ['downloader'];

export default handler;


