import makeWASocket, { useSingleFileAuthState, DisconnectReason, fetchLatestBaileysVersion } from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import { writeFileSync } from 'fs'
import qrcode from 'qrcode-terminal'

// Usamos un archivo para guardar la sesión
const { state, saveState } = useSingleFileAuthState('./auth_info.json')

async function startBot() {
  const { version, isLatest } = await fetchLatestBaileysVersion()
  console.log(`Usando Baileys v${version.join('.')}, ¿es la última versión?: ${isLatest}`)

  const sock = makeWASocket({
    version,
    printQRInTerminal: false,
    auth: state
  })

  sock.ev.on('creds.update', saveState)

  // Mostrar QR para conexión
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update
    if (qr) {
      console.log('Escanea este QR con tu WhatsApp:')
      qrcode.generate(qr, { small: true })
    }
    if (connection === 'close') {
      const reason = new Boom(lastDisconnect?.error)?.output.statusCode
      if (reason === DisconnectReason.loggedOut) {
        console.log('Sesión cerrada, elimina el archivo auth_info.json y vuelve a conectar.')
      } else {
        console.log('Desconectado por:', reason, ', reintentando conexión...')
        startBot()
      }
    } else if (connection === 'open') {
      console.log('Conectado correctamente!')
    }
  })

  // Escuchar mensajes entrantes
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return
    const msg = messages[0]
    if (!msg.message) return
    const messageType = Object.keys(msg.message)[0]
    console.log('Mensaje recibido tipo:', messageType)
    // Aquí puedes agregar lógica para responder mensajes
  })
}

startBot()