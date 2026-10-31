---
name: demo-componente
description: Escribir el playground .json (iswc-preview/v1) y registrar un componente en la galería de la app. Úsala al crear un componente o al cambiar su API pública.
---

# Demo de componente (`<tag>.json` + galería)

El explorador (`view/demo/index.html`, generado por `scripts/build/paginas.ts`) es el `<iswc-doc-demo>` del kit: una SPA
con el estado en `?s=` que `doc-demo-galeria` del kit alimenta con `view/demo/manifest.json`. El guardián
`tests/vistas/demos.test.ts` valida cada `.json` con Zod (`src/js/consts/schemas/demo.schemas.ts`; la forma canónica
completa es `@iswc/component-schemas`): lo que no valida se avisa y no se muestra.

## Forma

```json
{
  "$schema": "iswc-preview/v1",
  "tag": "av-x",
  "category": "<vista o 'shell'>",
  "navTitle": "X",
  "title": "&lt;av-x&gt;",
  "titleHtml": false,
  "storageKey": "docs-av-x",
  "styles": "<css del escenario>",
  "sections": [
    {
      "id": "intro",
      "title": "&lt;av-x&gt;",
      "lede": "Una línea: qué es.",
      "blocks": [
        { "kind": "demo", "html": "<av-x id=\"x\"></av-x>", "target": "#x",
          "props": { },
          "controls": [ { "control": "text", "prop": "props:nombre", "label": "nombre", "default": "" } ] },
        { "kind": "html", "html": "<iswc-callout tone=\"info\"><strong slot=\"title\">Cuándo usarlo</strong>…</iswc-callout><iswc-callout tone=\"warning\"><strong slot=\"title\">Cuándo no</strong>…</iswc-callout>" }
      ]
    }
  ]
}
```

## Controles

| `prop` | Efecto |
| --- | --- |
| `attr:<nombre>` | Escribe/borra el atributo (booleano = presencia) |
| `prop:<nombre>` | Asigna la propiedad JS |
| `props:<clave>` | Mezcla `{ clave: valor }` en `.props` (componentes con props) |

`control` ∈ `select` (con `options`), `text`, `boolean`, `number` (`min`, `max`, `step`), `json`. El `default` de un
`props:x` es el dato de muestra del bloque: el playground lo aplica al montar. Un componente que es diálogo o cajón
lleva en el escenario un `iswc-callout` que dice cómo abrirlo.

## Reglas

- Al menos un bloque `demo` vivo con los controles de su API clave, y un bloque `html` con dos
  `iswc-callout`: «Cuándo usarlo» / «Cuándo no».
- Todo componente tiene su línea en `view/demo/manifest.json` y viceversa (`{ "tag", "file" }`, `file`
  relativo a `view/demo/`).
- **Todo componente tiene demo con playground** (≥1 bloque `demo` con `controls`); sin excepción por tamaño.
- Componente general (sin dominio de la app): `"reuso": { "candidato": "iswc-root", "motivo": "…", "propuesta": "iswc-…" }`
  en la raíz del `.json` (`ReusoDemoSchema`); se revisan periódicamente para subirlos al kit.
- La ficha `.md` y el `.json` cuentan lo mismo: si cambias la API pública, cambian los dos.
- Cada vista tiene además su `demo/index.html` con las sub-piezas aisladas y datos de muestra.

Siguiente: [`nuevo-componente.md`](nuevo-componente.md) · [`nueva-vista.md`](nueva-vista.md).
