import React, { useLayoutEffect, useRef, useState } from "react";

import "@theme/scss/main.scss";

import {} from "@identity/loader";
import {} from "@theme/constants";

import fluidCSS from "@jeff-aporta/fluidcss";

import { assignedPath } from "@jeff-aporta/router";
import { routeCheck } from "@app/routeCheck";
import { Toaster } from "react-hot-toast";
import Alert from "@mui/material/Alert";

import { burnBGFluid } from "./back-texture";

import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import Footer from "@components/templates/menu/footer";
import MenuTopUnlog from "@components/templates/menu/head-main";

import {
  setThemeName,
  getTheme,
  getThemeName,
  getThemeLuminance,
  setThemeLuminance,
  MUIDefaultValues,
  getSelectedPalette,
  isDark,
  CursorLight,
  JS2CSS,
} from "@jeff-aporta/theme-manager";

const themeSwitch_listener = [];

export function addThemeSwitchListener(fn) {
  themeSwitch_listener.push(fn);
}

export function removeThemeSwitchListener(fn, index) {
  if (index === undefined) {
    const idx = themeSwitch_listener.indexOf(fn);
    if (idx > -1) themeSwitch_listener.splice(idx, 1);
  } else {
    themeSwitch_listener.splice(index, 1);
  }
}

class Notifier extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.listener = () => this.setState({ theme: getSelectedPalette() });
    addThemeSwitchListener(this.listener);
  }

  componentWillUnmount() {
    removeThemeSwitchListener(this.listener);
  }

  render() {
    const { children } = this.props;
    const { theme = {} } = this.state;
    const { palette } = theme;

    JS2CSS.insertStyle({
      id: `theme-helpers`,
      [`.color-accent-filter`]: {
        filter: `brightness(${isDark() ? 1.2 : 0.8}) saturate(2)`,
      },
    });

    return (
      <ThemeProvider theme={getTheme()}>
        <CssBaseline />
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              borderRadius: "5px",
              background: palette?.background?.default,
              color: palette?.text?.primary,
              border: "1px solid " + (palette?.divider ?? "gray"),
              boxShadow: "5px 5px 5px 0px rgba(0, 0, 0, 0.1)",
              animation: "fadeIn 1s ease, fadeOut 0.3s ease 9.7s forwards",
            },
          }}
        />
      </ThemeProvider>
    );
  }
}

function AppThemeProvider({
  children,
  urlShader,
  bgtype = "1",
  h_init = "20px",
  h_fin = "150px",
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
      <Footer updateThemeName={updateThemeName} />
      <CursorLight />
    </Notifier>
  );

  function FirstPart() {
    return (
      <div className="p-relative">
        <div
          className={burnBGFluid({
            bgtype,
            theme_name,
            theme_luminance,
          }).end(`expand back-texture dyn-filter z-index-1`)}
        />
        <div className="min-h-80vh">
          <MenuTopUnlog updateTheme={updateThemeLuminance} />
          <div style={{ minHeight: h_init }} />
          {children}
          <div style={{ minHeight: h_fin }} />
        </div>
      </div>
    );
  }
}

export { AppThemeProvider, Notifier, themeSwitch_listener };
