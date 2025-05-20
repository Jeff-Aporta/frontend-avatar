import JS2CSS from "@jeff-aporta/js2css";

const mouseFxBackall = "-1",
  mouseFxOverall = "8",
  MinOverscroll = "7";

const zIndex = {
  mouseFxBackall,
  mouseFxOverall,
  MinOverMouseFx: (Number(mouseFxOverall) + 1).toString(),
  MinOverscroll,
};

JS2CSS.insertStyle({
  id: "theme-constants",
  objJs: {
    ":root": {
      "--z-index-mouse-fx-backall": zIndex.mouseFxBackall,
      "--z-index-mouse-fx-overall": zIndex.mouseFxOverall,
      "--z-index-mouse-fx-minover": zIndex.MinOverMouseFx,
      "--z-index-minover-scroll": zIndex.MinOverscroll
    },
  },
});

export { zIndex };
