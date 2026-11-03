---
name: av-reporte
description: Botón flotante para reportar un error con texto, imágenes y notas de voz; lleva solo el HTML de la página y el contexto.
---

# `<av-reporte>`

Lo monta `arranque.ts` en el `body` de cada página de la app, fuera de `<av-app>`, para que sobreviva a los repintados. Al abrir carga `core/reporte.ts`.

## Anatomía

```
<av-reporte>
  #shadow-root
    <iswc-button class="flotante">
    <iswc-dialog id="dialogo">
      .formulario: #texto · .acciones (#capturar, imagen, #grabar) · .adjuntos · #codigo · .nota
      .enviado: .numero · .estado · .bitacora · #actualizar
      .error
```

## Atributos observados

<!-- exclude: Atributos observados -->

## Props

No recibe props.

## Slots

No tiene slots.

## Eventos

No emite eventos: envía directo al plugin `errores` del API.

## Comportamiento

- **Código:** se pide sin sesión o con un perfil de prueba. El API decide; si responde que falta, el campo aparece.
- **Imágenes:** botón, captura de pantalla donde el navegador la permita o pegar en el formulario.
- **Voz:** se graba y se convierte a WAV de 16 kHz; el API la transcribe y no la guarda.
- **Página:** HTML con shadow roots, sin scripts, estilos, contraseñas ni tokens; hasta 400 KB.
- **Seguimiento:** tras enviar, «Ver avance» muestra el estado y la bitácora del agente.

## Ejemplos

```html
<av-reporte></av-reporte>
```
