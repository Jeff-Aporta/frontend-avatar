import { getAllThemesRegistered } from "@jeff-aporta/theme-manager";

export const zIndex = (() => {
  const mouseFxBackall = "-1";
  const mouseFxOverall = "8";
  const MinOverscroll = "7";
  return {
    mouseFxBackall,
    mouseFxOverall,
    MinOverMouseFx: (Number(mouseFxOverall) + 1).toString(),
    MinOverscroll,
  };
})();

export const mapFilterTheme = {
  ...getAllThemesRegistered().reduce((acc, themeRegister) => {
    acc[themeRegister.name[0]] = (rotation) => {
      const colors = window.themeColors[themeRegister.name_color];
      return rotation(colors);
    };
    return acc;
  }, {}),
  blackNwhite: () => "grayscale(1)",
};

export const baseColor = window.purple;

Object.assign(window, { mapFilterTheme, zIndex, baseColor });

window.JS2CSS.insertStyle({
  id: "theme-constants",
  ":root": {
    "--z-index-mouse-fx-backall": zIndex.mouseFxBackall,
    "--z-index-mouse-fx-overall": zIndex.mouseFxOverall,
    "--z-index-mouse-fx-minover": zIndex.MinOverMouseFx,
    "--z-index-minover-scroll": zIndex.MinOverscroll,
  },
});
