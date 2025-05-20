import { getThemeName } from "@jeff-aporta/theme-manager";

const {
  verde_cielo,
  verde_lima,
  azul_agua,
  blanco,
  negro,
  morado,
  morado_enfasis,
  morado_brillante,
  verde_cielo_brillante,
  springgreen,
} = global.identity.colors;

function discriminadorColor(extra = "") {
  const themeName = getThemeName();
  return {
    filter: (() => {
      let r;
      switch (themeName) {
        case "skygreen":
          r = rotación(verde_cielo);
          break;
          case "blacknwhite":
            r = "grayscale(1)";
            break;
        case "lemongreen":
          r = rotación(verde_lima);
          break;
        case "springgreen":
          r = rotación(springgreen);
          break;
        default:
          r = "";
          break;
      }
      const extras = [];
      Object.entries(extra).forEach(([key, value]) => {
        if (key == "*") {
          return extras.push(value);
        }
        const queries = key.split(",").map((k) => k.trim());
        if (queries.includes(themeName)) {
          extras.push(value);
        }
      });
      return [r, ...extras].filter(Boolean).join(" ");
    })(),
  };

  function rotación(color) {
    return `hue-rotate(${parseInt(
      -morado_brillante.hue() + color.hue()
    )}deg) grayscale(0.5)`;
  }
}

export { discriminadorColor };
