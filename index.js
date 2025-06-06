import {
  default as makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion
} from "@whiskeysockets/baileys";
import Pino from "pino";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import gradient from 'gradient-string';
import chalk from "chalk";
import figlet from 'figlet';
import chalkAnimation from 'chalk-animation';
import { exec } from "child_process";
import NodeCache from "node-cache";
import moment from "moment-timezone";

// 🌀 Directorios
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🌀 Importar funciones personalizadas
import {
  pluginList,
  createMessage,
  msgRetryCounterMap,
  getPlugin,
  setPlugin,
  command,
  status,
  getConfig,
  options,
  memory
} from "./lib/Uchiha.js";

// 🌐 Configuración de zona horaria
moment.tz.setDefault("America/Bogota");

// 🔁 Monitor de cambios automáticos
fs.watchFile(__filename, () => {
  fs.unwatchFile(__filename);
  console.log(chalk.yellowBright(`🌀 Archivo actualizado: ${__filename}`));
  exec(`node ${__filename}`);
});

// 🔰 Función de impresión estilo ninja
function logNinja(msg, type = 'info') {
  const icons = {
    info: '🔷',
    success: '✅',
    error: '❌',
    warn: '⚠️',
    qr: '📷',
    code: '🧾',
    start: '🚀'
  };
  const color = {
    info: chalk.blue,
    success: chalk.greenBright,
    error: chalk.redBright,
    warn: chalk.yellowBright,
    qr: chalk.cyanBright,
    code: chalk.magentaBright,
    start: chalk.hex('#FF1E56')
  };
  console.log(color[type](`${icons[type] || ''} ${msg}`));
}

// 🌟 Animación de Inicio Estilo Ninja
console.clear();
figlet("UCHIHA IA", (err, data) => {
  if (!err) {
    console.log(gradient.retro.multiline(data));
    const subtitle = chalkAnimation.pulse("⚔️  Black Clover ☘️ - Modo Ninja Activado ⚔️");
    setTimeout(() => subtitle.stop(), 4000);
  } else {
    logNinja("Error al generar título", "error");
  }
});

// ⚙️ Configuración Inicial
const session = process.argv[2]?.split(" ").filter(Boolean)[0] || "session";
const sessionPath = path.join(__dirname, session);
const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

const { version, isLatest } = await fetchLatestBaileysVersion();
logNinja(`Usando Baileys v${version.join(".")} (Última: ${isLatest})`, "info");

// 🛡️ Creación del cliente
const client = makeWASocket({
  version,
  printQRInTerminal: true,
  auth: state,
  logger: Pino({ level: "silent" }),
  patchMessageBeforeSending: (message) => {
    const requiresPatch = !!(message.buttonsMessage || message.listMessage || message.templateMessage);
    return requiresPatch ? { viewOnceMessage: { message: { messageContextInfo: {}, ...message } } } : message;
  },
  getMessage: async (key) => {
    const message = msgRetryCounterMap[key.id] || getPlugin("database.msg")?.[key.id];
    return message ? { conversation: message } : undefined;
  },
  browser: ["Black Clover ☘️", "NinjaOS", "9.9"]
});

// 🧠 Asignar propiedades al cliente
client.pluginList = pluginList;
client.command = command;
client.status = status;
client.getPlugin = getPlugin;
client.setPlugin = setPlugin;
client.msgRetryCounterMap = msgRetryCounterMap;
client.createMessage = createMessage;
client.memory = memory;
client.timestamp = Date.now();
client.chats = {};
client.database = getPlugin("database") || {};
client.config = getConfig() || {};
client.options = options;
client.user = client.user || {};

// 🌀 Actualizar contactos
client.ev.on("contacts.upsert", async (contacts) => {
  for (const contact of contacts) {
    const id = contact.id;
    const name = contact.notify || contact.name || contact.vname || "";
    if (!id.includes("@g.us") && id !== "status@broadcast") {
      if (!client.contacts) client.contacts = {};
      client.contacts[id] = { ...(client.contacts[id] || {}), id, name };
    }
  }
});

// 🌐 Evento: Conexión actualizada
client.ev.on("connection.update", async (update) => {
  const { connection, lastDisconnect, qr } = update;
  if (qr) logNinja("Escanea el código QR para continuar", "qr");

  switch (connection) {
    case "open":
      logNinja("Conexión exitosa 🌀", "success");
      break;
    case "close":
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      if (shouldReconnect) {
        logNinja("Reconectando...", "warn");
        exec(`node ${__filename} ${session}`);
      } else {
        logNinja("Sesión cerrada. Escanea el código QR nuevamente", "error");
      }
      break;
    case "connecting":
      logNinja("Estableciendo conexión ninja...", "info");
      break;
  }
});

// 📥 Evento: Mensaje recibido
client.ev.on("messages.upsert", async ({ messages }) => {
  for (const msg of messages) {
    if (!msg.key.fromMe && !msg.message) return;
    try {
      await createMessage(client, msg);
    } catch (err) {
      logNinja(`Error al procesar mensaje: ${err}`, "error");
    }
  }
});

// 🧾 Guardar credenciales
client.ev.on("creds.update", saveCreds);

// 🚀 Lanzamiento
logNinja("Bot Black Clover ☘️ iniciado con éxito", "start");