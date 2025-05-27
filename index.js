import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { Boom } from '@hapi/boom'
import pino from 'pino'
import chalk from 'chalk'
import figlet from 'figlet'
import readline from 'readline'
import { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from '@whiskeysockets/baileys'
import handler from './handler.js'

global.__filename = fileURLToPath(import.meta.url)
global.__dirname = path.dirname(global.__filename)
global.db = { users: {} }
global.sessions = './sessions'

const logger = pino({ level: 'silent' })
const prefix = '/' // Puedes personalizar tu prefijo aquí

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

console.clear()
console.log(chalk.cyan(figlet.textSync('UchihaAi')))
console.log(chalk.blue('🔁 Cargando...'))

async function startUchihaAi() {
  const { version, isLatest } = await fetchLatestBaileysVersion()
  const { state, saveCreds } = await useMultiFileAuthState(global.sessions)

  const conn = makeWASocket({
    printQRInTerminal: true,
    auth: state,
    logger,
    version,
    defaultQueryTimeoutMs: undefined,
    syncFullHistory: true,
    generateHighQualityLinkPreview: true,
    patchMessageBeforeSending: (message) => {
      const requiresPatch = !!(
        message.buttonsMessage ||
        message.templateMessage ||
        message.listMessage
      )
      if (requiresPatch) {
        message = {
          viewOnceMessage: {
            message: {
              messageContextInfo: {
                deviceListMetadataVersion: 2,
                deviceListMetadata: {}
              },
              ...message
            }
          }
        }
      }
      return message
    }
  })

  conn.ev.on('creds.update', saveCreds)

  conn.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return
    for (const msg of messages) {
      await handler(conn, msg, {
        print: true,
        hasPrefix: true,
        prefix,
        name: 'UchihaAi'
      })
    }
  })

  conn.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update
    if (qr) console.log(chalk.yellow('📸 Escanea este código QR para iniciar sesión.'))
    
    if (connection === 'open') {
      console.log(chalk.green('✅ ¡Conectado correctamente a WhatsApp!'))
    } else if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut
      console.log(chalk.red('❌ Conexión cerrada. Razón:'), lastDisconnect?.error)
      if (shouldReconnect) {
        console.log(chalk.yellow('🔁 Reintentando conexión...'))
        startUchihaAi()
      } else {
        console.log(chalk.red('🔒 Cerrado permanentemente. Elimina la carpeta "sessions" para volver a iniciar.'))
      }
    }
  })

  global.reloadHandler = async () => {
    const handlerModule = './handler.js'
    const file = fileURLToPath(new URL(handlerModule, import.meta.url))
    if (fs.existsSync(file)) {
      const newHandler = (await import(`${handlerModule}?update=${Date.now()}`)).default
      handler = newHandler
    }
  }

  // === Modo de conexión ===
  if (conn.authState.creds.registered) {
    console.log(chalk.green('✅ Ya tienes una sesión activa.'))
  } else {
    rl.question(chalk.magenta('📱 Ingresa tu número de WhatsApp (ej: 521XXXXXXXXXX): '), async (number) => {
      const code = await conn.requestPairingCode(number + '@s.whatsapp.net')
      console.log(chalk.green(`🔗 Código de emparejamiento: ${code}`))
      console.log(chalk.blue('✅ Escanea el código desde tu WhatsApp > Dispositivos vinculados.'))
    })
  }
}

startUchihaAi()
