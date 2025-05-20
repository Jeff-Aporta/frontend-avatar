import React from "react";
import { ThemeSwitcher } from "@templates";
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

export default WelcomePage;

function WelcomePage() {
  return (
    <ThemeSwitcher bgtype="default">
      <div className="welcome-page">
        <DivM>Bienvenido a Avatar frontend</DivM>
      </div>
    </ThemeSwitcher>
  );
}
