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
  ...Object.entries(window.themeColors).reduce((acc, [key, value]) => {
    acc[key] = (rotation) => rotation(value);
    return acc;
  }, {}),
  blackNwhite: () => "grayscale(1)",
};

export const baseColor = window.purple;

Object.assign(window, { mapFilterTheme, zIndex, baseColor });

window.JS2CSS.insertStyle({
  id: "theme-constants",
  objJs: {
    ":root": {
      "--z-index-mouse-fx-backall": zIndex.mouseFxBackall,
      "--z-index-mouse-fx-overall": zIndex.mouseFxOverall,
      "--z-index-mouse-fx-minover": zIndex.MinOverMouseFx,
      "--z-index-minover-scroll": zIndex.MinOverscroll,
    },
  },
});
