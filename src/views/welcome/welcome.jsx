import React from "react";
import { AppThemeProvider } from "@templates";
import { DivM, PaperP } from "@containers";
import { isDark, controlComponents, href } from "@jeff-aporta/theme-manager";
import fluidCSS from "@jeff-aporta/fluidcss";
import { ImageLocal } from "@recurrent";

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Link,
  Paper,
  Rating,
  TextField,
  Typography,
} from "@mui/material";

// Iconos
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import PeopleIcon from "@mui/icons-material/People";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SpeedIcon from "@mui/icons-material/Speed";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";

import Hero from "./components/Hero";
import Features from "./components/Features";
import Productivity from "./components/Productivity";
import Pricing from "./components/Pricing";
import Technology from "./components/Technology";
import Community from "./components/Community";
import OpenSoftware from "./components/OpenSoftware";

export default WelcomePage;

function WelcomePage() {
  return (
    <AppThemeProvider bgtype="default" h_init={"0px"}>
      <Hero />
      <Community />
      <Features />
      <DivM className="welcome-page d-flex-col gap-10px">
        <Productivity />
        <Pricing />
        <Technology />
        <OpenSoftware />
      </DivM>
    </AppThemeProvider>
  );
}
