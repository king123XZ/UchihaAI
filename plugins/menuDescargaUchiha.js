import fetch from 'node-fetch'

const menuDescargas = `
╔═════════════════════╗
║     📥 DESCARGAS 📥
╚═════════════════════╝
1. !ytmp3 [enlace]    - Descargar audio de YouTube
2. !ytmp4 [enlace]    - Descargar video de YouTube
3. !tiktok [enlace]   - Descargar video de TikTok
4. !instagram [enlace]- Descargar video de Instagram
5. !facebook [enlace] - Descargar video de Facebook
6. !mediafire [enlace]- Descargar archivo Mediafire
═══════════════════════
Ejemplo: !ytmp3 https://youtu.be/dQw4w9WgXcQ
═══════════════════════
`

export async function handler(m, { command, conn }) {
  if (command === 'menu2' || command === 'menudescargas' || command === 'descargas') {
    await conn.reply(m.chat, menuDescargas, m)
  }
}

// Si tu sistema de plugins requiere exportar un objeto:
export default {
  help: ['menudescargas', 'menu2', 'descargas'],
  tags: ['menu'],
  command: /^(menu2|menudescargas|descargas)$/i,
  handler
}
