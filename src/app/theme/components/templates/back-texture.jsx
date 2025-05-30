import {
  colorFilterDiscriminator,
  fluidCSS,
  getPaletteConfig,
  getThemeName,
  isDark,
  JS2CSS,
} from "@jeff-aporta/theme-manager";

export function burnBGFluid({ bgtype = "1", theme_name, theme_luminance }) {
  const fluid = fluidCSS();
  switch (bgtype) {
    default:
    case "1":
    case "default":
      bgdefault();
      fluid.ltX("small", {
        opacity: ["0.5", "1"],
      });
      break;
    case "2":
    case "portal":
      fluid
        .btwX("responsive", {
          opacity: ["0", "0.5", "1"],
        })
        .ltX("small", {
          display: "none",
        });
      portal();
      break;
  }
  return fluid;
}

function lightEffect() {
  const rl = {
    "*": "invert() hue-rotate(180deg)",
  };
  const rb = {};
  const { panda } = getPaletteConfig();
  const a = [rb, rl];
  if (isDark()) {
    return a[+panda];
  }
  return a[1 - +panda];
}

function bgdefault() {
  const themeName = getThemeName();
  let color_anillo, color_circulo;

  const palette = getPaletteConfig();

  color_anillo = "rgba(255,255,255, 0.03)";
  color_circulo = "rgba(186, 85, 211, 0.1)";

  let radio_anillo = 35;
  let radio_agujero = (() => {
    const grosor = 7;
    return radio_anillo - grosor;
  })();
  radio_anillo = `max(${radio_anillo}dvw, 250px)`;
  radio_agujero = `max(${radio_agujero}dvw, 200px)`;
  JS2CSS.insertStyle({
    id: "back-texture",
    ".back-texture": {
      ...colorFilterDiscriminator(lightEffect()),

      background: [
        linear({
          angle: "to bottom",
          colors: [
            "transparent 70%",
            "rgba(120,20,255,0.2)",
            "rgba(220,100,255,0.2) 98%",
            "rgba(220,100,255,0.3) calc(100% - 20px)",
          ],
        }),
        radio({
          colores: [color_anillo, "transparent"],
          radio: "max(70dvw, 600px)",
          x: "30%",
          y: "30px",
        }),
        circle({
          color: color_circulo,
          radio: `max(${20}dvw, 80px)`,
          x: "95%",
          y: "25%",
        }),
        ring({
          color: color_anillo,
          agujero: radio_agujero,
          radio: radio_anillo,
          x: "5dvw",
          y: "5dvw",
        }),
        ring({
          color: color_anillo,
          agujero: radio_agujero,
          radio: radio_anillo,
          x: "calc(20dvw + 50px)",
          y: "calc(40dvh + 50px)",
        }),
        ring({
          color: color_anillo,
          agujero: radio_agujero,
          radio: radio_anillo,
          x: "10%",
          y: "60%",
        }),
        ring({
          color: color_anillo,
          agujero: radio_agujero,
          radio: radio_anillo,
          x: "100%",
          y: "100%",
        }),
        ring({
          color: color_anillo,
          agujero: radio_agujero,
          radio: radio_anillo,
          x: "70%",
          y: "80%",
        }),
        radio({
          colores: [`rgba(20, 0, 70, 1)`, "transparent"],
          radio: "max(70dvw, 600px)",
          x: "70%",
          y: "600px",
        }),
        palette.bg_dark,
      ].join(","),
    },
  });
}

function portal() {
  JS2CSS.insertStyle({
    id: "back-texture",
    ".back-texture": {
      ...colorFilterDiscriminator(lightEffect()),
      background: [
        ...[
          { a: 30, r: 30, ri: 4 },
          { a: 35, r: 30, ri: 6 },
          { a: 40, r: 30, ri: 8 },
          { a: 210, r: 30, ri: 4 },
          { a: 215, r: 30, ri: 6 },
          { a: 220, r: 30, ri: 8 },
        ].map((o) => {
          const { a, r, ri } = o;
          return ring({
            color: "rgba(20,255,255,0.25)",
            agujero: ri + "px",
            radio: ri + 4 + `px`,
            ...(() => {
              return {
                x: `calc(${percent(r)} * cos(${a}deg) + 50%)`,
                y: `calc(${percent(r)} * sin(${a}deg) + 50%)`,
              };
            })(),
          });
        }),
        linear({
          angle: "45deg",
          colors: [
            "rgba(255,0,255,0.3)",
            "rgba(150,0,255,0.3)",
            `transparent ${percent(40)}`,
            `transparent ${percent(60)}`,
            "rgba(0, 0, 0, 0.3)",
            "rgba(0, 0, 0, 0.5)",
            "rgba(0, 0, 0, 0.7)",
            "rgba(0, 0, 0, 0.3)",
            "rgba(0,100,255,0.1)",
            "rgba(0,20,255,0.4)",
            "rgba(0,0,255,0.2)",
          ],
        }),
        circle_hole({
          color: "rgba(255, 255, 255, 0.08)",
          radio: percent(38),
          x: "center",
          y: "center",
        }),
        ring({
          color: "rgba(255, 0, 255, 0.05)",
          agujero: percent(33),
          radio: `calc(${percent(33)} + 20px)`,
          x: "center",
          y: "center",
        }),
        ring({
          color: "rgba(255, 255, 255, 0.08)",
          agujero: percent(50),
          radio: percent(51),
          x: "center",
          y: "center",
        }),
      ].join(","),
    },
  });
}

function percent(n) {
  return `calc(${n / 100} * max(100dvw, 100dvh))`;
}

function linear({ angle, colors }) {
  return `linear-gradient(${angle}, 
     ${colors.join(",")}
 )`;
}

function radio({ colores, radio, x, y }) {
  return `radial-gradient(circle ${radio} at ${x} ${y}, 
     ${colores.join(",")}
 )`;
}

function circle({ color, radio, x, y }) {
  return `radial-gradient(circle ${radio} at ${x} ${y}, 
     ${color} 100%,
     transparent 100%
 )`;
}

function circle_hole({ color, radio, x, y }) {
  return `radial-gradient(circle ${radio} at ${x} ${y}, 
     transparent 100%,
     ${color} 100%
 )`;
}

function ring({ color, radio, agujero, x, y }) {
  return `radial-gradient(circle ${radio} at ${x} ${y}, 
     transparent ${agujero}, 
     ${color} ${agujero}, 
     ${color} 100%,
     transparent 100%
 )`;
}

export { bgdefault, portal };
