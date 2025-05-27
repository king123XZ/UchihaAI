import {watchFile, unwatchFile} from 'fs';
import chalk from 'chalk';
import {fileURLToPath} from 'url';
import fs from 'fs'; 
import cheerio from 'cheerio';
import fetch from 'node-fetch';
import axios from 'axios';
import moment from 'moment-timezone';

//*─────────────────────────────*
// BETA: Número del bot (opción 2, código de 8 dígitos)
global.botNumber = '' // Ejemplo: 525218138672

//*─────────────────────────────*
global.owner = [
  ['5215544876071', '🜲 𝗖𝗿𝗲𝗮𝗱𝗼𝗿 👻', true],
  ['5217971278937']
];

global.mods = []
global.suittag = ['5215211111111'] 
global.prems = []

global.libreria = 'Baileys'
global.baileys = 'V 6.7.8'
global.vs = '2.0.0'
global.languaje = 'Español'

// --- NUEVO BRANDING Y CARPETAS ---
global.nameqr = 'UchihaAi-Bot'      // Cambiado para branding
global.sessions = 'uchihaSessions'   // Cambiado para branding
global.jadi = 'uchihaJadiBot'        // Cambiado para branding
global.blackJadibts = true

//*─────────────────────────────*
// Branding avanzado UchihaAi/DV . YER:

global.packsticker = `♾ ━━━━━━━━\n├ ɓσƭ:\n├ ρяοριєταяιο:\n├ ƒєϲнα ∂є ϲяєαϲιόи:\n├ нοяα:\n♾━━━━━━━━`
global.packname = `UchihaAi ☁️`
global.author = `♾━━━━━━━━\n⇝͟͞UchihaAi ☁️ ⋆\n⇝ ۵-̱̅ⁱ𝐃𝐕 . 𝐘𝐄𝐑-͞ˍ\n⇝ ${moment.tz('America/Los_Angeles').format('DD/MM/YY')}\n⇝ ${moment.tz('America/Los_Angeles').format('HH:mm:ss')} \n♾━━━━━━━━\n\n\n\nѕτιϲκєя ϐγ: ৎUchihaAi ☁️ `;
global.wm = 'UchihaAi ☁️';
global.titulowm = 'UchihaAi ☁️';
global.igfg = 'DV . YER'
global.botname = 'UchihaAi ☁️'
global.dev = '© ⍴᥆ᥕᥱrᥱძ ᑲᥡ DV . YER ⚡'
global.textbot = 'UchihaAi : DV . YER'
global.gt = '͟͞UchihaAi ☁️͟͞';
global.namechannel = 'UchihaAi / DV . YER'

global.moneda = 'monedas'

global.gp4 = 'https://chat.whatsapp.com/GrcUknwrJbNIXIIrbsuXc0'
global.gp1 = 'https://chat.whatsapp.com/FiBcPMYEO7mG4m16gBbwpP' 
global.gp2 = 'https://chat.whatsapp.com/G9zQlCHDBrn99wcC2FyWgm'
global.comunidad1 = 'https://chat.whatsapp.com/JaGwnrKgL7w15uAFZmZBIw'
global.channel = 'https://whatsapp.com/channel/0029Vai28FR7dmea9gytQm3w'
global.channel2 = 'https://whatsapp.com/channel/0029Vai28FR7dmea9gytQm3w'
global.yt = 'https://www.youtube.com/@ElCarlos.87'
global.md = 'https://github.com/thecarlos19/black-clover-MD'
global.correo = ''
global.cn ='https://whatsapp.com/channel/0029Vai28FR7dmea9gytQm3w';

global.catalogo = fs.readFileSync('./src/catalogo.jpg');
global.estilo = { key: {  fromMe: false, participant: `0@s.whatsapp.net`, ...(false ? { remoteJid: "5219992095479-1625305606@g.us" } : {}) }, message: { orderMessage: { itemCount : -999999, status: 1, surface : 1, message: global.packname, orderTitle: 'Bang', thumbnail: global.catalogo, sellerJid: '0@s.whatsapp.net'}}}
global.ch = {
  ch1: '120363307694217288@newsletter',
}
global.multiplier = 70

global.cheerio = cheerio
global.fs = fs
global.fetch = fetch
global.axios = axios
global.moment = moment   

// CREA CARPETAS SI NO EXISTEN (sessions, jadibots, tmp)
for (const dir of [global.sessions, global.jadi, 'tmp']) {
  if (!fs.existsSync('./' + dir)) fs.mkdirSync('./' + dir, {recursive: true})
}

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
