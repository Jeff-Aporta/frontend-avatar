import React, { useLayoutEffect, useRef, useState } from "react";

import "@theme/scss/main.scss";

import {} from "@identity/loader";
import {} from "@theme/constants";

import fluidCSS from "@jeff-aporta/fluidcss";

import { assignedPath } from "@jeff-aporta/router";
import { routeCheck } from "@app/routeCheck";
import { Toaster } from "react-hot-toast";
import Alert from "@mui/material/Alert";

import { bgdefault, portal } from "./back-texture";

import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import { CursorLight } from "@jeff-aporta/fast-fx";
import Footer from "@components/templates/menu/footer";
import MenuTopUnlog from "@components/templates/menu/head-main";

import {
  setThemeName,
  getTheme,
  getThemeName,
  getThemeLuminance,
  setThemeLuminance,
  MUIDefaultValues,
  isDark,
} from "@jeff-aporta/theme-manager";

const minH = "min-h-80vh";

const themeSwitch_listener = [];

function Notifier({ children }) {
  console.log(MUIDefaultValues)
  return (
    <Themized>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: { animation: "fadeIn 1s ease, fadeOut 0.3s ease 4.7s" },
        }}
      />{" "}
    </Themized>
  );

  function Themized({ children }) {
    {
      /* Keyframes CSS para fade */
    }
    return (
      <ThemeProvider theme={getTheme()}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    );
  }
}

function ThemeSwitcher({
  children,
  urlShader,
  bgtype = "1",
  h_init = "0",
  h_fin = "0",
}) {
  const [theme_name, updateThemeName] = useState(getThemeName());
  const [theme_luminance, updateThemeLuminance] = useState(getThemeLuminance());

  if (theme_name != getThemeName()) {
    setThemeName(theme_name);
    localStorage.setItem("theme-name", theme_name);
  }

  if (theme_luminance != getThemeLuminance()) {
    setThemeLuminance(theme_luminance);
    localStorage.setItem("theme-luminance", theme_luminance);
  }

  useLayoutEffect(() => {
    themeSwitch_listener.forEach((fn) => fn(theme_name, theme_luminance));
  }, [theme_name, theme_luminance]);

  return (
    <Notifier>
      <FirstPart />
      <Footer updateThemeName={updateThemeName} getThemeName={getThemeName} />
      <CursorLight />
    </Notifier>
  );

  function FirstPart() {
    return (
      <div className="p-relative">
        <div
          className={(() => {
            const fluid = fluidCSS();
            switch (bgtype) {
              default:
              case "1":
                bgdefault();
                fluid.ltX(800, {
                  opacity: ["0.5", "1"],
                });
                break;
              case "2":
              case "portal":
                fluid
                  .btwX(550, 800, {
                    opacity: ["0", "0.5", "1"],
                  })
                  .ltX(550, {
                    display: "none",
                  });
                portal();
                break;
            }
            return fluid.end(`expand back-texture dyn-filter z-index-1`);
          })()}
        />
        <div className={`${minH}`}>
          <MenuTopUnlog updateTheme={updateThemeLuminance} />
          <div style={{ minHeight: h_init }} />
          {children}
          <div style={{ minHeight: h_fin }} />
        </div>
      </div>
    );
  }
}

export { ThemeSwitcher, Notifier, themeSwitch_listener };
