import { AppThemeProvider, initThemeCamaleon } from "@jeff-aporta/camaleon";

import { Footer, HeadMain } from "./menu/index.js";

initThemeCamaleon();

export function Main(props) {
  return (
    <AppThemeProvider
      bgtype="portal"
      h_init="100px"
      h_fin="100px"
      Footer={Footer}
      Header={HeadMain}
      {...props}
    />
  );
}
