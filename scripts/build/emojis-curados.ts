/**
 * emojis-curados.ts — emojis con palabras clave escritas a mano, por categoría. Encabezan su categoría y sus claves
 * pesan en la búsqueda; el resto del catálogo sale de emojibase (`catalogo-emojis.ts`).
 */
export const CURADOS: Record<string, string> = {
  caras: `
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
`,
  gestos: `
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
`,
  corazones: `
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
`,
  naturaleza: `
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
`,
  comida: `
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
`,
  actividades: `
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
`,
  viajes: `
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
`,
  objetos: `
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
`,
  simbolos: `
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
`,
};
