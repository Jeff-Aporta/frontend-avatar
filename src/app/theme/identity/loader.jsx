import {
  paletteLoader,
  loadScrollbar,
  readyThemeManager,
  initializeThemeColors,
} from "@jeff-aporta/theme-manager";

initializeThemeColors();

const { MUIDefaultValues } = paletteLoader;
MUIDefaultValues["main"] = MUIDefaultValues["purple"];

readyThemeManager();

export default { status: "runned" };
