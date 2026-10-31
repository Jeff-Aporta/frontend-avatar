/**
 * emojis.ts — catálogo compacto del selector de emojis (por categoría, con palabras clave en español para buscar) y
 * los recientes del usuario (localStorage con try/catch).
 */
import { normalizar } from './formato.js';

export type Emoji = { e: string; k: string };
export type CategoriaEmoji = { id: string; nombre: string; icono: string; emojis: Emoji[] };

const lista = (s: string): Emoji[] =>
  s.trim().split('\n').map((l) => {
    const [e, ...k] = l.trim().split(' ');
    return { e: e!, k: k.join(' ') };
  });

export const CATEGORIAS_EMOJI: CategoriaEmoji[] = [
  {
    id: 'caras', nombre: 'Caras', icono: 'mdi:emoticon-happy-outline', emojis: lista(`
😀 feliz sonrisa
😃 alegre contento
😄 risa ojos
😁 sonrisa dientes
😆 carcajada
😅 sudor nervios risa
🤣 revolcarse risa
😂 llorar de risa jaja
🙂 leve sonrisa
😉 guiño
😊 sonrojo amable
😇 angel inocente
🥰 enamorado corazones
😍 ojos corazon amor
🤩 estrellas asombro
😘 beso
😋 delicioso
😜 lengua guiño
🤪 loco
🤗 abrazo
🤭 risita
🤫 silencio secreto
🤔 pensar duda
🤐 callado
😐 neutral
😑 sin expresion
😏 picaro
😒 aburrido
🙄 ojos en blanco
😬 mueca incomodo
😌 aliviado
😔 pensativo triste
😪 sueño
😴 dormir
😷 enfermo mascarilla
🤒 fiebre
🤯 explota cabeza
🥳 fiesta celebrar
😎 gafas genial
🤓 nerd
🧐 monoculo analizar
😕 confundido
😟 preocupado
😮 sorpresa asombro
😲 asombrado
🥺 suplicar ojitos
😢 llorar triste
😭 llanto
😱 grito miedo
😖 frustrado
😤 resoplar
😡 enojo furia
🤬 maldecir
💀 calavera muerto de risa
🤖 robot bot
👻 fantasma
👽 alien
💩 caca
`),
  },
  {
    id: 'gestos', nombre: 'Gestos', icono: 'mdi:hand-wave-outline', emojis: lista(`
👍 pulgar arriba ok bien si
👎 pulgar abajo mal no
👌 perfecto ok
✌️ paz victoria
🤞 dedos cruzados suerte
🤟 te quiero
🤘 rock
🤙 llamame
👈 izquierda
👉 derecha
👆 arriba
👇 abajo
☝️ indice uno
✋ mano alto
🖐️ mano abierta
👋 hola adios saludo
👏 aplausos bravo
🙌 celebrar manos arriba
👐 manos abiertas
🤝 acuerdo trato
🙏 gracias por favor rezar
✍️ escribir
💪 fuerza musculo
🧠 cerebro idea
👀 ojos mirar
👂 oreja escuchar
🫶 corazon manos
🤷 no se encoger
🤦 facepalm
🙋 levantar mano
🙇 reverencia
💁 informacion
`),
  },
  {
    id: 'corazones', nombre: 'Corazones', icono: 'mdi:heart-outline', emojis: lista(`
❤️ corazon rojo amor
🧡 corazon naranja
💛 corazon amarillo
💚 corazon verde
💙 corazon azul
💜 corazon morado
🖤 corazon negro
🤍 corazon blanco
💔 corazon roto
❣️ exclamacion corazon
💕 dos corazones
💞 corazones girando
💓 latido
💗 corazon creciendo
💖 corazon brillante
💘 flechado
💝 regalo corazon
💯 cien perfecto
✨ brillos magia
⭐ estrella
🌟 estrella brillante
🔥 fuego genial
💥 explosion
💫 mareo estrella
`),
  },
  {
    id: 'naturaleza', nombre: 'Naturaleza', icono: 'mdi:paw', emojis: lista(`
🐶 perro
🐱 gato
🐭 raton
🦊 zorro
🐻 oso
🐼 panda
🐨 koala
🐯 tigre
🦁 leon
🐮 vaca
🐷 cerdo
🐸 rana
🐵 mono
🐔 gallina
🐧 pinguino
🦄 unicornio
🐝 abeja
🦋 mariposa
🐢 tortuga
🐙 pulpo
🐬 delfin
🌵 cactus
🌴 palmera
🌱 brote planta
🍀 trebol suerte
🌸 flor cerezo
🌹 rosa
🌻 girasol
🌈 arcoiris
☀️ sol
🌙 luna
⚡ rayo
❄️ nieve
☔ lluvia
`),
  },
  {
    id: 'comida', nombre: 'Comida', icono: 'mdi:food-apple-outline', emojis: lista(`
🍎 manzana
🍌 banano
🍓 fresa
🍉 sandia
🍇 uvas
🥑 aguacate
🌽 maiz
🌶️ aji picante
🍞 pan
🧀 queso
🍔 hamburguesa
🍟 papas fritas
🍕 pizza
🌮 taco
🌯 burrito
🥗 ensalada
🍝 pasta
🍣 sushi
🍩 dona
🍪 galleta
🎂 torta cumpleanos
🍰 pastel
🍫 chocolate
🍿 palomitas
☕ cafe tinto
🍵 te
🍺 cerveza
🍷 vino
🥂 brindis
🧃 jugo
`),
  },
  {
    id: 'actividades', nombre: 'Actividades', icono: 'mdi:soccer', emojis: lista(`
⚽ futbol
🏀 baloncesto
🏈 americano
⚾ beisbol
🎾 tenis
🏐 voleibol
🏓 ping pong
🎯 diana objetivo meta
🎮 videojuego
🎲 dado
🧩 rompecabezas
🎨 arte pintura
🎬 cine
🎤 microfono cantar
🎧 audifonos musica
🎸 guitarra
🎹 piano
🏆 trofeo ganar
🥇 medalla oro
🎉 fiesta celebracion
🎊 confeti
🎁 regalo
🎈 globo
`),
  },
  {
    id: 'viajes', nombre: 'Viajes', icono: 'mdi:airplane', emojis: lista(`
🚗 carro
🚕 taxi
🚌 bus
🚲 bicicleta
🏍️ moto
🚀 cohete lanzamiento
✈️ avion viaje
🚢 barco
🏠 casa
🏢 oficina edificio
🏖️ playa vacaciones
🏔️ montana
🗺️ mapa
📍 ubicacion pin
🌎 mundo
🕐 hora reloj
⏰ alarma
⌛ arena tiempo
📅 calendario fecha
`),
  },
  {
    id: 'objetos', nombre: 'Objetos', icono: 'mdi:lightbulb-outline', emojis: lista(`
💡 idea bombillo
📱 celular
💻 computador portatil
⌨️ teclado
🖥️ pantalla
🖨️ impresora
📷 camara foto
🎥 video
📞 telefono llamada
📧 correo email
✉️ sobre carta
📦 paquete caja
📝 nota escribir
📎 clip adjunto
📌 chincheta fijar
✂️ tijeras
🔒 candado seguro
🔑 llave
🔧 llave herramienta
⚙️ engranaje ajustes
🧪 prueba laboratorio
📊 grafica barras
📈 tendencia sube
📉 tendencia baja
💰 dinero bolsa
💳 tarjeta
🧾 recibo factura
📚 libros
🗂️ carpetas
🗑️ basura
`),
  },
  {
    id: 'simbolos', nombre: 'Símbolos', icono: 'mdi:check-circle-outline', emojis: lista(`
✅ hecho listo check
☑️ casilla
✔️ visto
❌ error no
❎ cruz
⚠️ advertencia
🚫 prohibido
⛔ alto
❓ pregunta
❗ exclamacion
‼️ doble exclamacion
💤 dormir zzz
🆗 ok
🆕 nuevo
🆒 cool
🔝 top
🔴 rojo
🟠 naranja
🟡 amarillo
🟢 verde
🔵 azul
🟣 morado
⚫ negro
⚪ blanco
➕ mas
➖ menos
➡️ flecha derecha
⬅️ flecha izquierda
🔁 repetir
🔔 campana notificacion
🔕 silencio
`),
  },
];

/** Busca por palabra clave (sin tildes). */
export function buscarEmojis(q: string, limite = 64): Emoji[] {
  const t = normalizar(q.trim());
  if (!t) return [];
  const out: Emoji[] = [];
  for (const c of CATEGORIAS_EMOJI) for (const e of c.emojis) if (normalizar(e.k).includes(t)) out.push(e);
  return out.slice(0, limite);
}

const CLAVE_RECIENTES = 'av-chat:emojis-recientes';

export function recientes(): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(CLAVE_RECIENTES) ?? '[]');
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string').slice(0, 24) : [];
  } catch {
    return [];
  }
}

export function usarEmoji(e: string): void {
  try {
    localStorage.setItem(CLAVE_RECIENTES, JSON.stringify([e, ...recientes().filter((x) => x !== e)].slice(0, 24)));
  } catch {
    /* sin almacenamiento */
  }
}
