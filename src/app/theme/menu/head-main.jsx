import "./head-main.css";
import React, { useState } from "react";
import Menu from "@mui/material/Menu";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SettingsIcon from "@mui/icons-material/Settings";
import HomeIcon from "@mui/icons-material/Home";
import { Divider, ListItemButton, ListItemIcon } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

import {
  Button,
  Link,
  Paper,
  Typography,
  Tooltip,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Avatar,
} from "@mui/material";

import { ImageLocal } from "@recurrent";
import { fluidCSS } from "@jeff-aporta/camaleon";
import { LuminanceThemeSwitch } from "@jeff-aporta/camaleon";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";

import {
  isDark,
  controlComponents,
  getThemeName,
  href,
  JS2CSS,
  getThemeLuminance,
} from "@jeff-aporta/camaleon";
import { getQueryPath } from "@jeff-aporta/camaleon";
import { PaperF, Hm } from "@jeff-aporta/camaleon";

const hideIcon = 500;
const wbrk = 600;

export function HeadMain({ updateTheme = () => 0 }) {
  const isLoginPage = getQueryPath().includes("/users/login");
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = () => {
    window["logoutUser"]();
  };
  const user = window["currentUser"] ?? null;
  const isLogged = !!user;
  const toggleDrawer = () => setDrawerOpen((o) => !o);

  JS2CSS.insertStyle({
    id: "headmain-root",
    ":root": {
      "--border-section": (() => {
        const themename = getThemeName();
        switch (themename) {
          case "blackNwhite":
            return "hsl(var(--gray-h), var(--gray-s), 40%, 0.2)";
          default:
            return "hsl(var(--verde-cielo-h), var(--verde-cielo-s), 40%, 0.2)";
        }
      })(),
    },
  });

  return (
    <PaperF
      className="menu-top flex space-between ai-center pad-10px"
      hm={false}
    >
      <div className="flex">
        <MenuDrawer />
        <LogoHome />
      </div>
      <MenuX />
    </PaperF>
  );

  function MenuX() {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const handleLogoutAndClose = () => {
      handleLogout();
      handleClose();
    };

    return (
      <>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            textAlign: "center",
            gap: 2,
          }}
        >
          {!isLogged && !isLoginPage && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              startIcon={<LoginIcon />}
              href={href("/users/login")}
              sx={{
                borderRadius: "20px",
                textTransform: "none",
                fontWeight: "bold",
              }}
            >
              Inicia sesión
            </Button>
          )}
          {isLogged && (
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleClick}
                size="small"
                sx={{ ml: 2 }}
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <Avatar
                  sx={{ width: 32, height: 32 }}
                  src={user.avatarUrl || ""}
                >
                  {!user.avatarUrl && user.name?.[0]}
                </Avatar>
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": { width: 32, height: 32, ml: -0.5, mr: 1 },
                "&::before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={handleClose}>
            <Avatar sx={{ width: 32, height: 32 }} /> Profile
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Avatar sx={{ width: 32, height: 32 }} /> My account
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogoutAndClose}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </>
    );
  }

  function ThemeSwitch() {
    return (
      <Tooltip title={"Cambiar a tema " + (isDark() ? "claro" : "oscuro")}>
        <LuminanceThemeSwitch
          checked={isDark()}
          onChange={() => updateTheme(isDark() ? "light" : "dark")}
        />
      </Tooltip>
    );
  }

  function MenuDrawer() {
    return (
      <>
        <Box sx={{ display: { xs: "flex", md: "none" }, padding: "0 15px" }}>
          <IconButton color="inherit" edge="start" onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
        </Box>
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
          <Box role="presentation">
            <List>
              <CaptionSection icon={<HomeIcon fontSize="small" />}>
                Navegación
              </CaptionSection>
              <ListItemButton component="a" href={href("/")}>
                <ListItemText primary="Inicio" />
              </ListItemButton>
              <hr />
              <br />
              {!isLogged && !isLoginPage && (
                <ListItemButton component="a" href={href("/users/login")}>
                  <ListItemText primary="Iniciar sesión" />
                </ListItemButton>
              )}
              {isLogged && (
                <>
                  <CaptionSection icon={<SettingsIcon fontSize="small" />}>
                    Configuración
                  </CaptionSection>
                  <Accordion
                    disableGutters
                    elevation={12}
                    sx={{ boxShadow: "none" }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <ListItemText
                        primary={[user.name, user.last_name]
                          .filter(Boolean)
                          .join(" ")}
                      />
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 0 }}>
                      <List>
                        <ListItemButton onClick={handleLogout}>
                          <ListItemText primary="Cerrar sesión" />
                        </ListItemButton>
                      </List>
                    </AccordionDetails>
                  </Accordion>
                </>
              )}
              <Hm />
              <ListItem>
                <ListItemText primary="Modo: " sx={{ ml: 1 }} />
                <ThemeSwitch />
              </ListItem>
            </List>
          </Box>
        </Drawer>
      </>
    );

    function CaptionSection({ icon, children }) {
      return (
        <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            <small className="d-center gap-10px">
              {icon}
              {children}
            </small>
          </Typography>
        </Box>
      );
    }
  }
}

function LogoHome() {
  const themeName = getThemeName();
  return (
    <Link
      color="inherit"
      underline="none"
      href={href("/")}
      className="d-center bright-hover-1-5 gap-10px c-pointer"
    >
      <ImageLocal
        src={`img/logo.svg`}
        width="40"
        className={fluidCSS()
          .lerpX("responsive-min", { width: [30, 40] })
          .end()}
        style={{
          width: "40px",
        }}
      />
      <Box
        className={fluidCSS()
          .lerpX("responsive-min", { fontSize: [15, 20] })
          .end("d-flex-col")}
      >
        <Typography
          style={{
            fontFamily: "goodtimes-rg",
          }}
          color={(() => {
            if (isDark()) {
              return "white";
            } else {
              return "black";
            }
          })()}
          className={fluidCSS()
            .lerpX("responsive-min", { fontSize: [15, 20] })
            .end()}
        >
          Avatar
        </Typography>
        <Typography
          style={{
            fontFamily: "lemonmilk-rg",
            fontSize: "45%",
          }}
          color="primaryl3"
          sx={{ display: { xs: "none", sm: "block" } }}
        >
          Gestión Digital y Automatización
        </Typography>
      </Box>
    </Link>
  );
}
