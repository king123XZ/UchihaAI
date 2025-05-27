process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'
import './config.js'
import { setupMaster, fork } from 'cluster'
import { watchFile, unwatchFile } from 'fs'
import cfonts from 'cfonts'
import {createRequire} from 'module'
import {fileURLToPath, pathToFileURL} from 'url'
import {platform} from 'process'
import * as ws from 'ws'
import fs, {readdirSync, statSync, unlinkSync, existsSync, mkdirSync, readFileSync, rmSync, watch} from 'fs'
import yargs from 'yargs';
import {spawn} from 'child_process'
import lodash from 'lodash'
import { blackJadiBot } from './plugins/jadibot-serbot.js';
import chalk from 'chalk'
import syntaxerror from 'syntax-error'
import {tmpdir} from 'os'
import {format} from 'util'
import boxen from 'boxen'
import P from 'pino'
import pino from 'pino'
import Pino from 'pino'
import path, { join, dirname } from 'path'
import {Boom} from '@hapi/boom'
import {makeWASocket, protoType, serialize} from './lib/simple.js'
import {Low, JSONFile} from 'lowdb'
import {mongoDB, mongoDBV2} from './lib/mongoDB.js'
import store from './lib/store.js'
const {proto} = (await import('@whiskeysockets/baileys')).default
import pkg from 'google-libphonenumber'
const { PhoneNumberUtil } = pkg
const phoneUtil = PhoneNumberUtil.getInstance()
const {DisconnectReason, useMultiFileAuthState, MessageRetryMap, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, jidNormalizedUser} = await import('@whiskeysockets/baileys')
import readline, { createInterface } from 'readline'
import NodeCache from 'node-cache'
const {CONNECTING} = ws
const {chain} = lodash
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000

let { say } = cfonts

// --- MODERN, UNIQUE BOT HEADER DESIGN ---
const header = boxen(
  `
  
 
  ___   __   __         __   __  ___   ___ 
 |   \  \ \ / /         \ \ / / | __| | _ \
 | |) |  \ V /     _     \ V /  | _|  |   /
 |___/    \_/     (_)     |_|   |___| |_|_\
                                           

                                                                              

        🤖 U C H I H A  A I  -  W H A T S A P P  🤖

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
             by DV.YER | Creador gracias por usar
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `,
  {
    borderColor: 'magenta',
    borderStyle: 'round',
    padding: 1,
    margin: 1,
    backgroundColor: '#171721',
    title: '🌌 UchihaAi - Modern WhatsApp Bot 🌌',
    titleAlignment: 'center'
  }
)
console.log(header)

say('UchihaAi', {
  font: 'block',
  align: 'center',
  colors: ['magentaBright','cyan'],
  background: 'black'
})

say('MODERN WHATSAPP BOT', {
  font: 'console',
  align: 'center',
  colors: ['cyanBright'],
  background: 'black'
})

say('by DV.YER', {
  font: 'console',
  align: 'center',
  colors: ['magentaBright'],
  background: 'black'
})

protoType()
serialize()

global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
  return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString();
};
global.__dirname = function dirname(pathURL) {
  return path.dirname(global.__filename(pathURL, true))
};
global.__require = function require(dir = import.meta.url) {
  return createRequire(dir)
}

global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({...query, ...(apikeyqueryname ? {[apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name]} : {})})) : '');

global.timestamp = {start: new Date}

const __dirname = global.__dirname(import.meta.url)

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
global.prefix = new RegExp('^[#/!.]')
global.db = new Low(/https?:\/\//.test(opts['db'] || '') ? new cloudDBAdapter(opts['db']) : new JSONFile('./src/database/database.json'))

global.DATABASE = global.db
global.loadDatabase = async function loadDatabase() {
  if (global.db.READ) {
    return new Promise((resolve) => setInterval(async function() {
      if (!global.db.READ) {
        clearInterval(this)
        resolve(global.db.data == null ? global.loadDatabase() : global.db.data);
      }
    }, 1 * 1000))
  }
  if (global.db.data !== null) return
  global.db.READ = true
  await global.db.read().catch(console.error)
  global.db.READ = null
  global.db.data = {
    users: {},
    chats: {},
    stats: {},
    msgs: {},
    sticker: {},
    settings: {},
    ...(global.db.data || {}),
  }
  global.db.chain = chain(global.db.data)
}
loadDatabase()

const {state, saveState, saveCreds} = await useMultiFileAuthState(global.sessions)
const msgRetryCounterMap = (MessageRetryMap) => { };
const msgRetryCounterCache = new NodeCache()
const {version} = await fetchLatestBaileysVersion();
let phoneNumber = global.botNumber

const methodCodeQR = process.argv.includes("qr")
const methodCode = !!phoneNumber || process.argv.includes("code")
const MethodMobile = process.argv.includes("mobile")
const colores = chalk.bgMagenta.white
const opcionQR = chalk.bold.green
const opcionTexto = chalk.bold.cyan
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (texto) => new Promise((resolver) => rl.question(texto, resolver))

let opcion
if (methodCodeQR) {
  opcion = '1'
}
if (!methodCodeQR && !methodCode && !fs.existsSync(`./${sessions}/creds.json`)) {
  do {
    opcion = await question(colores('⌨ Seleccione una opción:\n') + opcionQR('1. Con código QR\n') + opcionTexto('2. Con código de texto de 8 dígitos\n--> '))

    if (!/^[1-2]$/.test(opcion)) {
      console.log(chalk.bold.redBright(`✖ Opción inválida. Solo elige 1 o 2.`))
    }
  } while (opcion !== '1' && opcion !== '2' || fs.existsSync(`./${sessions}/creds.json`))
}

console.info = () => {}
console.debug = () => {}

const connectionOptions = {
  logger: pino({ level: 'silent' }),
  printQRInTerminal: opcion == '1' ? true : methodCodeQR ? true : false,
  mobile: MethodMobile,
  browser: opcion == '1' ? [`UchihaAi`, 'Edge', '25.0.1'] : methodCodeQR ? [`UchihaAi`, 'Edge', '25.0.1'] : ['ArchLinux', 'Edge', '120.0.0.1'],
  auth: {
    creds: state.creds,
    keys: makeCacheableSignalKeyStore(state.keys, Pino({ level: "fatal" }).child({ level: "fatal" })),
  },
  markOnlineOnConnect: true,
  generateHighQualityLinkPreview: true,
  getMessage: async (clave) => {
    let jid = jidNormalizedUser(clave.remoteJid)
    let msg = await store.loadMessage(jid, clave.id)
    return msg?.message || ""
  },
  msgRetryCounterCache,
  msgRetryCounterMap,
  defaultQueryTimeoutMs: undefined,
  version,
}

global.conn = makeWASocket(connectionOptions);

// --- MODERN, UNIQUE CONNECTION MESSAGES ---
global.conn.ev.on('connection.update', async (update) => {
  const {connection, lastDisconnect, isNewLogin} = update;
  global.stopped = connection;
  if (isNewLogin) conn.isInit = true;
  const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;
  if (code && code !== DisconnectReason.loggedOut && conn?.ws.socket == null) {
    await global.reloadHandler(true).catch(console.error);
    global.timestamp.connect = new Date;
  }
  if (global.db.data == null) loadDatabase();
  if (update.qr != 0 && update.qr != undefined || methodCodeQR) {
    if (opcion == '1' || methodCodeQR) {
      console.log(
        boxen(
          chalk.hex('#ff00ea')('\n▻ ESCANEA TU CÓDIGO QR DESDE WHATSAPP ⬛ 45 SEGUNDOS ⬜'),
          {
            borderColor: 'cyan',
            padding: 1,
            margin: 1,
            borderStyle: 'bold',
            backgroundColor: '#171721'
          }
        )
      )
    }
  }
  if (connection == 'open') {
    console.log(
      boxen(
        chalk.hex('#39ff14')('\n✨ UchihaAi conectado con éxito. ¡Disfruta la experiencia moderna! ✨'),
        {
          borderColor: 'magenta',
          padding: 1,
          margin: 1,
          borderStyle: 'double',
          backgroundColor: '#111119'
        }
      )
    )
  }
  let reason = new Boom(lastDisconnect?.error)?.output?.statusCode
  if (connection === 'close') {
    if (reason === DisconnectReason.badSession) {
      console.log(chalk.bold.cyanBright(`\n⚠︎ SIN CONEXIÓN, BORRA LA CARPETA ${global.sessions} Y ESCANEA EL NUEVO QR ⚠︎`))
    } else if (reason === DisconnectReason.connectionClosed) {
      console.log(chalk.bold.magentaBright(`\n🔄 CONEXIÓN CERRADA, RECONEXIÓN EN PROGRESO...`))
      await global.reloadHandler(true).catch(console.error)
    } else if (reason === DisconnectReason.connectionLost) {
      console.log(chalk.bold.blueBright(`\n🔄 CONEXIÓN PERDIDA, RECONEXIÓN EN PROGRESO...`))
      await global.reloadHandler(true).catch(console.error)
    } else if (reason === DisconnectReason.connectionReplaced) {
      console.log(chalk.bold.yellowBright(`\n⚠︎ SESIÓN REEMPLAZADA, CIERRA LA SESIÓN ANTERIOR PRIMERO.`))
    } else if (reason === DisconnectReason.loggedOut) {
      console.log(chalk.bold.redBright(`\n⚠︎ SIN CONEXIÓN, BORRA LA CARPETA ${global.sessions} Y ESCANEA EL NUEVO QR ⚠︎`))
      await global.reloadHandler(true).catch(console.error)
    } else if (reason === DisconnectReason.restartRequired) {
      console.log(chalk.bold.cyanBright(`\n🌀 REINICIANDO CONEXIÓN...`))
      await global.reloadHandler(true).catch(console.error)
    } else if (reason === DisconnectReason.timedOut) {
      console.log(chalk.bold.yellowBright(`\n⏳ TIEMPO DE CONEXIÓN AGOTADO, RECONEXIÓN EN PROGRESO...`))
      await global.reloadHandler(true).catch(console.error)
    } else {
      console.log(chalk.bold.redBright(`\n⚠︎ RAZÓN DE DESCONEXIÓN DESCONOCIDA: ${reason || 'No encontrado'} >> ${connection || 'No encontrado'}`))
    }
  }
})

// --- MODERN, UNIQUE FOOTER FOR READY STATE ---
process.on('ready', () => {
  console.log(
    boxen(
      chalk.hex('#00eaff')(
        `\n🟢 UchihaAi está listo para revolucionar tu WhatsApp.\n` +
        `Tips: Usa /menu para ver comandos. Disfruta tu asistente moderno!`
      ),
      {
        borderColor: 'cyan',
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        backgroundColor: '#191929'
      }
    )
  )
})

// Puedes seguir con el resto de tu lógica de plugins, recarga, limpieza, etc.
// Si quieres más ayuda para modernizar respuestas o comandos, ¡dímelo!
