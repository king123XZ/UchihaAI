async function handler(m, { command, usedPrefix }) {
  const comandos = [
    { cmd: 'ytmp3', desc: 'Descargar audio de YouTube' },
    { cmd: 'ytmp4', desc: 'Descargar video de YouTube' },
    { cmd: 'play', desc: 'Buscar y descargar música' },
    { cmd: 'playvideo', desc: 'Buscar y descargar video' },
    { cmd: 'facebook', desc: 'Descargar video de Facebook' },
    { cmd: 'instagram', desc: 'Descargar reels de Instagram' },
    { cmd: 'tiktok', desc: 'Descargar video de TikTok (sin marca de agua)' },
    { cmd: 'mediafire', desc: 'Descargar archivos de Mediafire' },
    { cmd: 'soundcloud', desc: 'Descargar música de SoundCloud' },
    { cmd: 'twitter', desc: 'Descargar video de Twitter/X' },
    { cmd: 'pinterestdl', desc: 'Descargar imágenes de Pinterest' },
    { cmd: 'tourl', desc: 'Subir archivos a qu.ax y obtener enlace' },
  ];

  let text = '📥 *COMANDOS DE DESCARGA DISPONIBLES:*\n\n';
  text += comandos.map(c => `• *${usedPrefix + c.cmd}* → ${c.desc}`).join('\n');
  text += `\n\n🧠 Usa cualquiera de estos comandos respondiendo con un link o texto apropiado.`;

  await m.reply(text);
}

handler.command = /^(descargas|download)$/i;
handler.help = ['descargas'];
handler.tags = ['download'];

module.exports = handler;
