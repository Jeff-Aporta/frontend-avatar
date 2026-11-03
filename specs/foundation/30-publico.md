# 30 — Público: landing y acceso

## 1. Propósito (WHAT)

Quien no tiene sesión ve qué es Avatar y puede entrar.

## 2. Requisitos WHAT

- [W-PUB-01] `/` muestra la landing: lema «Todo tu negocio en una sola plataforma», texto, «Empieza ahora» (con sesión «Ir al panel») y «Conoce a AVO».
- [W-PUB-02] Cuatro características (canales, proyectos, CRM, AVO) con ícono, título y texto, y tres planes (mensual, anual destacado, 3 años); «Suscribirse» lleva al acceso.
- [W-PUB-03] `/acceso/` muestra el login del kit (`iswc-login`); envía usuario y contraseña al plugin de identidad de DER (`POST usuarios/login`) y con éxito navega al panel.
- [W-PUB-04] Un error de login se muestra en el formulario sin borrar lo escrito: credenciales inválidas, bloqueo por intentos o API inalcanzable, cada uno con su mensaje.
- [W-PUB-05] Las cuentas de prueba (ana, beto, carla) se listan con su rol; «Usar» rellena el formulario.
- [W-PUB-06] También se entra desde la barra (`iswc-session-menu`), sin salir de la vista actual.
- [W-PUB-08] Identidad única: la «A» de cinta (dos trazos redondeados y un pliegue oscuro que pasa por detrás de la pierna derecha) es la marca en la barra, el pie, la pestaña, las notificaciones, el ícono de acceso directo y la vista previa en redes.
- [W-PUB-09] Las ilustraciones de la landing y del acceso son collages de la identidad recompuestos por retazos: el hero (crecimiento), características (módulos), productividad y acceso (marca) y software abierto (red). Cada retazo tiene movimientos en loop sutiles y lentos (desplazamiento, rotación, escala, alfa) que no roban atención; las piezas protagonistas emiten radar u ondas y la escena reacciona al cursor (parallax por profundidad e inclinación).
- [W-PUB-10] Las piezas de un collage se pueden tomar con el cursor y halar un poco (con resistencia); al soltarlas vuelven a su sitio con un rebote suave.
- [W-PUB-11] Los collages se tiñen al tono de la paleta activa; en tema oscuro, las piezas pensadas para fondo claro se ocultan o ganan contorno. Sus bordes son suaves (sin dientes de sierra ni halo claro).
- [W-PUB-12] La comunidad muestra un núcleo grande con radar (dos ondas y 4 s de pausa) y las personas laten en ola (alfa 0.7 ↔ 1) alrededor de la órbita.
- [W-PUB-13] El tema y la paleta elegidos sobreviven a recargar la página.

## 3. Guía HOW WEAK

- [HW-PUB-01] La landing no consulta la API: todo su contenido sale de `view/inicio/utils/landing.ts`.
- [HW-PUB-02] Collages: fuentes en `.fuentes/collages/<n>-<nombre>/` (original, retazos, posiciones). `deno task collages` genera los WebP por ancho (`srcset`) y `src/js/consts/collages.ts`; la composición y los movimientos viven en `src/js/core/escenas.ts`. Si los retazos vienen con fondo, se extraen del original por croma (`scripts/assets/extraer-por-color.ts`).
- [HW-PUB-03] Íconos estáticos: `deno task marca` los genera todos desde `assets/img/marca/a-cinta.svg`.

## 4. Contratos HOW STRONG

- [HS-PUB-01] El token JWT se guarda en `localStorage` (`avatar:token`) y viaja como `Authorization: Bearer` en todas las peticiones.
- [HS-PUB-02] El boot lee tema y paleta de `iswc:app-cfg` (la llave que escriben el toggle y el selector del kit) antes del primer pintado; las llaves viejas `iswc-theme`/`iswc-palette` solo como respaldo.

## 5. Casos borde y errores

- [W-PUB-07] Un token vencido o revocado al arrancar limpia la sesión y deja al usuario en la landing.

## 6. Pruebas (WHAT / HOW WEAK)

- `tests/vistas/inicio`: [W-PUB-02], [W-PUB-05] y los mensajes de [W-PUB-04].
- `tests/e2e/00.inicio`: [W-PUB-01], [W-PUB-02] y la redirección de una vista privada al acceso.

## 7. Notas

El administrador entra con la contraseña del secreto del despliegue; nunca se muestra en la app.
