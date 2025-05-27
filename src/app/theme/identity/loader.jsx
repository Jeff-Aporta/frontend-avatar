import {
  paletteLoader,
  loadScrollbar,
  readyThemeManager,
  initializeThemeColors,
  registerThemes_PaletteGeneral,
} from "@jeff-aporta/theme-manager";

initializeThemeColors();

const { MUIDefaultValues } = paletteLoader;
MUIDefaultValues["main"] = MUIDefaultValues["purple"];

console.log(MUIDefaultValues);
console.log(registerThemes_PaletteGeneral);

readyThemeManager();

export default { status: "runned" };
