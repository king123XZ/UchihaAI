import makeWASocket, {
  useSingleFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} from '@whiskeysockets/baileys'
import { Boom } from '@hapi/boom'
import qrcode from 'qrcode-terminal'

const { state, saveState } = useSingleFileAuthState('./auth_info.json')

async function startBot() {
  try {
    // Obtener versión actual de WhatsApp Web protocol
    const { version, isLatest } = await fetchLatestBaileysVersion()
    console.log(`Usando Baileys v${version.join('.')} (¿Última?: ${isLatest})`)

    // Crear cliente
    const sock = makeWASocket({
      version,
      printQRInTerminal: false,
      auth: state,
      logger: undefined,
    })

    // Guardar sesión cuando cambie
    sock.ev.on('creds.update', saveState)

    // Evento para conexión, desconexión y QR
    sock.ev.on('connection.update', (update) => {
      const { connection, lastDisconnect, qr } = update

      if (qr) {
        console.log('Escanea este QR con tu WhatsApp:')
        qrcode.generate(qr, { small: true })
      }

      if (connection === 'open') {
        console.log('✅ Conectado a WhatsApp!')
      }

      if (connection === 'close') {
        const statusCode = new Boom(lastDisconnect?.error).output.statusCode
        console.log('❌ Conexión cerrada, código:', statusCode)

        if (statusCode === DisconnectReason.loggedOut) {
          console.log('Se cerró la sesión. Borra auth_info.json y vuelve a iniciar.')
          process.exit(0)
        } else {
          console.log('Intentando reconectar...')
          startBot()
        }
      }
    })

    // Escuchar mensajes nuevos
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
      if (type !== 'notify') return

      const msg = messages[0]
      if (!msg.message) return

      const from = msg.key.remoteJid
      const messageType = Object.keys(msg.message)[0]

      console.log(`Mensaje nuevo de ${from}, tipo: ${messageType}`)

      // Ejemplo: responder si llega un texto
      if (messageType === 'conversation' || messageType === 'extendedTextMessage') {
        const text = messageType === 'conversation' ? msg.message.conversation : msg.message.extendedTextMessage.text

        if (text.toLowerCase() === 'hola') {
          await sock.sendMessage(from, { text: 'Hola! ¿Cómo puedo ayudarte?' })
          console.log('Respuesta enviada')
        }
      }
    })
  } catch (error) {
    console.error('Error en startBot:', error)
  }
}

startBot()