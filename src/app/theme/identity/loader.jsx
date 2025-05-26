import {
  paletteLoader,
  loadScrollbar,
  readyThemeManager,
  initializeThemeColors,
} from "@jeff-aporta/theme-manager";

initializeThemeColors();

paletteLoader.MUIDefaultValues["main"] =
  paletteLoader.MUIDefaultValues["purple"];

readyThemeManager();

export default { status: "runned" };
