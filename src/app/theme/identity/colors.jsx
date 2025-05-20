import { register_colors, JS2CSS, Color } from "@jeff-aporta/theme-manager";

global.identity ??= { colors: {} };

const identity = (() => {
  const primaries = {
    verde_cielo: Color("#1e9cde"),
    verde_lima: Color("#c6e50e"),
    azul_agua: Color("#21ebef"),
    morado: Color("#1b053d"),
    springgreen: Color("rgb(0, 255, 127)"),
    blanco: Color("white"),
    negro: Color("black"),
    blacktheme: Color("#151515"),
    gray: Color("gray"),
    white: Color("white"),
    black: Color("black"),
  };

  const secundaries = {
    morado_enfasis: Color(`hsl(${primaries.morado.hue()}, 45%, 53%)`),
    morado_brillante: Color(`hsl(${primaries.morado.hue()}, 100%, 80%)`),
    verde_cielo_brillante: Color(
      `hsl(${primaries.verde_cielo.hue()}, 100%, 80%)`
    ),
    verde_lima_brillante: Color(
      `hsl(${primaries.verde_lima.hue()}, 100%, 80%)`
    ),
    lemongreen: primaries.verde_lima,
    skygreen: primaries.verde_cielo,
  };

  const all = {
    ...primaries,
    ...secundaries,
  };

  Object.assign(global.identity.colors, all);
  register_colors(all);

  return {
    primaries,
    secundaries,
  };
})();

function genHSL(name, color) {
  return {
    [`--${name}`]: color.hex(),
    [`--${name}-h`]: color.hsl().object()["h"].toString() + "deg",
    [`--${name}-s`]: color.hsl().object()["s"].toString() + "%",
    [`--${name}-l`]: color.hsl().object()["l"].toString() + "%",
  };
}

JS2CSS.insertStyle({
  id: "palette-theme-colors",
  objJs: {
    ":root": {
      ...Object.entries(global.identity.colors)
        .map(([k, v]) => genHSL(k.replaceAll("_", "-"), v))
        .reduce((acc, v) => ({ ...acc, ...v }), {}),

      "--bg-table-dark": "rgba(0, 0, 0, 0.2)",
    },
  },
});

export default { status: "runned" };
