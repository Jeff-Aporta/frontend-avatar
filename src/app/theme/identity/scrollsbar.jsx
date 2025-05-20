import { Color } from "@jeff-aporta/theme-manager";

const {
  verde_cielo,
  verde_lima,
  morado_enfasis,
  springgreen,
  gray,
} = global.identity.colors;

export default ({ customizeScrollbar, color_register }) => {
  Object.assign(color_register.load_scrollsbar, {
    verde_cielo(darkmode) {
      monochrome({ color: verde_cielo, darkmode });
    },
    morado(darkmode) {
      monochrome({ color: morado_enfasis, darkmode });
    },
    verde_lima(darkmode) {
      monochrome({ color: verde_lima, darkmode });
    },
    springgreen(darkmode) {
      monochrome({ color: springgreen, darkmode });
    },
    gray(darkmode){
      monochrome({ color: gray, darkmode });
    }
  });

  function monochrome({ color, darkmode }) {
   if (darkmode) {
     customizeScrollbar({
       main: color.hex(),
       maindark: color.darken(0.2).hex(),
       maindarker: color.darken(0.4).hex(),
       back: color.toBlack(0.5).hex(),
     });
   } else {
     customizeScrollbar({
       main: color.hex(),
       maindark: color.darken(0.2).hex(),
       maindarker: color.darken(0.4).hex(),
       back: color.toWhite(0.9).hex(),
     });
   }
 }
};
