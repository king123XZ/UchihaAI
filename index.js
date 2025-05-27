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

// ------- FUNCION PARA VALIDAR NUMERO DE WHATSAPP ---------
async function isValidPhoneNumber(number) {
  try {
    number = number.replace(/\s+/g, '')
    if (number.startsWith('+521')) {
      number = number.replace('+521', '+52');
    } else if (number.startsWith('+52') && number[4] === '1') {
      number = number.replace('+52 1', '+52');
    }
    const parsedNumber = phoneUtil.parseAndKeepRawInput(number)
    return phoneUtil.isValidNumber(parsedNumber)
  } catch (error) {
    return false
  }
}

// -------- ASEGURAR CARPETAS NECESARIAS -----------
for (const dir of [global.sessions, global.jadi, 'tmp']) {
  if (!existsSync('./' + dir)) mkdirSync('./' + dir, {recursive: true})
}

let { say } = cfonts

// --------- HEADER MODERNO ---------
const header = boxen(
  `
   ███    ██  ██████  ██████  ██ ██   ██  █████  ██ 
   ████   ██ ██    ██ ██   ██ ██  ██ ██  ██   ██ ██ 
   ██ ██  ██ ██    ██ ██████  ██   ███   ███████ ██ 
   ██  ██ ██ ██    ██ ██   ██ ██  ██ ██  ██   ██ ██ 
   ██   ████  ██████  ██   ██ ██ ██   ██ ██   ██ ███████

        🤖 U C H I H A  A I  -  W H A T S A P P  🤖

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            by DV . YER | Modern WhatsApp Bot
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

say('by DV . YER', {
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
if (!methodCodeQR && !methodCode && !fs.existsSync(`./${global.sessions}/creds.json`)) {
  do {
    opcion = await question(colores('⌨ Seleccione una opción:\n') + opcionQR('1. Con código QR\n') + opcionTexto('2. Con código de texto de 8 dígitos\n--> '))

    if (!/^[1-2]$/.test(opcion)) {
      console.log(chalk.bold.redBright(`✖ Opción inválida. Solo elige 1 o 2.`))
    }
  } while (opcion !== '1' && opcion !== '2' || fs.existsSync(`./${global.sessions}/creds.json`))
}

console.info = () => {} 
console.debug = () => {} 

const connectionOptions = {
  logger: pino({ level: 'silent' }),
  printQRInTerminal: opcion == '1' ? true : methodCodeQR ? true : false,
  mobile: MethodMobile, 
  browser: opcion == '1' ? [`${global.nameqr}`, 'Edge', '25.0.1'] : methodCodeQR ? [`${global.nameqr}`, 'Edge', '25.0.1'] : ['ArchLinux', 'Edge', '120.0.0.1'],
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

if (!fs.existsSync(`./${global.sessions}/creds.json`)) {
  if (opcion === '2' || methodCode) {
    opcion = '2'
    if (!conn.authState.creds.registered) {
      let addNumber
      if (!!phoneNumber) {
        addNumber = phoneNumber.replace(/[^0-9]/g, '')
      } else {
        do {
          phoneNumber = await question(chalk.bgBlack(chalk.bold.greenBright(`✞ Por favor, Ingrese el número de WhatsApp.\n${chalk.bold.yellowBright(`  Ejemplo: 52521×××××××`)}\n${chalk.bold.magentaBright('---> ')}`)))
          phoneNumber = phoneNumber.replace(/\D/g,'')
          if (!phoneNumber.startsWith('+')) {
            phoneNumber = `+${phoneNumber}`
          }
        } while (!await isValidPhoneNumber(phoneNumber))
        rl.close()
        addNumber = phoneNumber.replace(/\D/g, '')
        setTimeout(async () => {
          let codeBot = await conn.requestPairingCode(addNumber)
          codeBot = codeBot?.match(/.{1,4}/g)?.join("-") || codeBot
          console.log(chalk.bold.white(chalk.bgMagenta(`✞ CÓDIGO DE VINCULACIÓN ✞`)), chalk.bold.white(chalk.white(codeBot)))
        }, 3000)
      }
    }
  }
}

conn.isInit = false;
conn.well = false;

if (!opts['test']) {
  if (global.db) setInterval(async () => {
    if (global.db.data) await global.db.write()
    if (opts['autocleartmp'] && (global.support || {}).find) (tmp = [os.tmpdir(), 'tmp', `${global.jadi}`], tmp.forEach((filename) => cp.spawn('find', [filename, '-amin', '3', '-type', 'f', '-delete'])));
  }, 30 * 1000);
}

async function connectionUpdate(update) {
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
}
process.on('uncaughtException', console.error)

// --- reloadHandler CORRECTAMENTE DEFINIDO ---
let isInit = true;
let handler = await import('./handler.js')
global.reloadHandler = async function(restatConn) {
  try {
    const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error);
    if (Object.keys(Handler || {}).length) handler = Handler
  } catch (e) {
    console.error(e);
  }
  if (restatConn) {
    const oldChats = global.conn.chats
    try {
      global.conn.ws.close()
    } catch { }
    conn.ev.removeAllListeners()
    global.conn = makeWASocket(connectionOptions, {chats: oldChats})
    isInit = true
  }
  if (!isInit) {
    conn.ev.off('messages.upsert', conn.handler)
    conn.ev.off('connection.update', conn.connectionUpdate)
    conn.ev.off('creds.update', conn.credsUpdate)
  }

  conn.handler = handler.handler.bind(global.conn)
  conn.connectionUpdate = connectionUpdate.bind(global.conn)
  conn.credsUpdate = saveCreds.bind(global.conn, true)

  conn.ev.on('messages.upsert', conn.handler)
  conn.ev.on('connection.update', conn.connectionUpdate)
  conn.ev.on('creds.update', conn.credsUpdate)
  isInit = false
  return true
};

// ...El resto de tu código (plugins, limpieza, utilidades, etc.) puede ir aquí igual que en tu original...
