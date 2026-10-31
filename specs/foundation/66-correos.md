# 66 — Correos (DUO eMail)

> Alcance: la vista `correos` (`/correos/`, id opcional = carpeta inicial): KPIs del buzón, carpetas, lista, lectura,
> redacción (nuevo, responder, reenviar) y marcas (leído, destacado, carpeta). Fuera: notificaciones del panel, el
> chat por canales y la gestión de miembros (organización).

## 1. Propósito (WHAT)

Cada miembro de una empresa tiene un buzón interno: recibe, lee, responde y ordena correos de sus compañeros sin salir
de Avatar. La vista se siente como un cliente de correo: carpetas a la izquierda, lista y lector en un panel dividido.

## 2. Requisitos WHAT

- [W-CORREO-01] Arriba, cuatro indicadores del buzón del usuario en la empresa activa: sin leer, en la entrada, destacados y enviados hoy.
- [W-CORREO-02] Carpetas Entrada, Enviados, Archivados y Papelera, en ese orden, cada una con su total; la entrada muestra además sus no leídos resaltados.
- [W-CORREO-03] La lista muestra los correos de la carpeta, recientes primero: persona (en Enviados, los destinatarios), asunto, vista previa de una línea, etiquetas, hora relativa y estrella; los no leídos se distinguen.
- [W-CORREO-04] El buscador filtra la carpeta por asunto, cuerpo, personas (id o nombre) y etiquetas; todas las palabras deben aparecer, sin importar tildes ni mayúsculas. Sin coincidencias, un estado vacío lo dice.
- [W-CORREO-05] Abrir un correo lo muestra en el lector (asunto, etiquetas, remitente, para, CC, hora y cuerpo) y, si estaba sin leer, lo marca leído.
- [W-CORREO-06] Desde el lector: responder (al remitente, «Re:» y el original citado), responder a todos (sin incluirme), reenviar («Rv:» sin destinatarios), destacar, marcar como no leído y mover (entrada → archivados o papelera; archivados → entrada o papelera; papelera → entrada).
- [W-CORREO-07] Redactar exige al menos un destinatario, asunto y mensaje; los destinatarios y CC se eligen entre los miembros de la empresa; las etiquetas se escriben separadas por coma (minúsculas, sin repetir, máximo 10).
- [W-CORREO-08] Bajo el lector, «Relacionados» lista los correos de la misma conversación (respuesta u original, o mismo asunto sin prefijos); si no hay, la sección no aparece.
- [W-CORREO-09] Sin el permiso `avatar.correo` la vista lo explica y deja leer, pero deshabilita redactar, responder, reenviar, destacar y mover.
- [W-CORREO-10] En pantallas angostas las carpetas pasan a una fila y el buzón muestra la lista o el lector (con «Volver»), nunca ambos apretados.

## 3. Guía HOW WEAK

- [HW-CORREO-01] Solo el shell habla con el API; los hijos pintan y emiten. Las marcas se aplican primero en pantalla y luego se confirman (si el API falla, se recarga la carpeta).
- [HW-CORREO-02] Carpetas con conteo, indicadores, borradores, vista previa, etiquetas y relacionados viven en `view/correos/utils/correos.ts`.
- [HW-CORREO-03] La búsqueda y los relacionados pasan por funciones del shell (`buscarCorreos`, `relacionados`) para enchufar luego la búsqueda semántica del API sin tocar los hijos.
- [HW-CORREO-04] Refrescar la lista no repinta el buscador (conserva foco y texto).

## 4. Contratos HOW STRONG

- [HS-CORREO-01] Tags: `av-correos` (shell), `av-correo-carpetas`, `av-correo-lista`, `av-correo-lector`, `av-correo-redactar`; usa `iswc-stat-group` (transversal).
- [HS-CORREO-02] Eventos: `av-correos-carpeta { carpeta }`, `av-correos-buscar { texto }`, `av-correo-abrir { ibuzon }`, `av-correo-marcar { ibuzon, cambios }`, `av-correo-responder { ibuzon, todos }`, `av-correo-reenviar { ibuzon }`, `av-correo-cerrar`, `av-correo-enviar { datos }`, `av-correo-redactar-cerrar`, `av-correo-redactar-error { mensaje }`.
- [HS-CORREO-03] API (vendor DER): ops `bandeja(iempresa, carpeta)`, `resumenCorreo(iempresa)`, `marcarCorreo(ibuzon, { leido?, destacado?, carpeta? })`, `enviarCorreo({ iempresa, destinatarios, cc?, asunto, cuerpo, etiquetas?, respuesta_a? })` y el controller `miembros` (con `usuario`). Escritura con `avatar.correo`.

## 5. Casos borde y errores

- [W-CORREO-11] Sin empresa activa la vista lo dice y no consulta nada.
- [W-CORREO-12] Una carpeta vacía muestra un estado vacío propio de la carpeta; un error del API se avisa con un toast y la lista queda vacía, no rota.

## 6. Pruebas (WHAT / HOW WEAK)

- [W-CORREO-13] `tests/vistas/correos`: carpetas con conteo [W-CORREO-02], indicadores [W-CORREO-01], búsqueda [W-CORREO-04], borradores de respuesta y reenvío [W-CORREO-06], etiquetas [W-CORREO-07], relacionados [W-CORREO-08], movimientos por carpeta [W-CORREO-06], validación del borrador [W-CORREO-07].

## 7. Notas

[W-CORREO-03], [W-CORREO-05], [W-CORREO-09], [W-CORREO-10], [W-CORREO-11] y [W-CORREO-12] son de pantalla: se verifican en el
navegador (no hay e2e de esta vista todavía; el gate e2e cubre la bienvenida).
