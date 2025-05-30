import React from "react";
import { AppThemeProvider, Complement } from "@templates";
import { DivM } from "@containers";
import {
  Box,
  Card,
  CardContent,
  Tabs,
  Tab,
  Typography,
  Grid,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { ImageLocal } from "@recurrent";
import fluidCSS from "@jeff-aporta/fluidcss";
import { fdhue, Color, getSelectedPalette } from "@jeff-aporta/theme-manager";

export default function login() {
  return (
    <AppThemeProvider bgtype="portal">
      <DivM m_max={40} className="d-center min-h-80vh">
        <LoginSignupPage />
      </DivM>
    </AppThemeProvider>
  );
}

class LoginSignupPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tab: 0 };
  }

  handleTabChange = (e, value) => {
    this.setState({ tab: value });
  };

  handleLogin = ({ email, password, remember }) => {
    // TODO: llamar API de login con { email, password, remember }
  };

  handleSignup = ({ name, email, password, confirm }) => {
    // TODO: llamar API de signup con { name, email, password, confirm }
  };

  render() {
    const { tab } = this.state;
    return (
      <Grid container spacing={4}>
        <Grid item xs={12} md={7}>
          <Complement>
            <Typography variant="h3" gutterBottom>
              <b>Bienvenido a Avatar</b>
            </Typography>
            <Typography variant="body">
              Por favor inicia sesión o regístrate para continuar.
            </Typography>
            <div className="d-center padt-10px">
              <ImageLocal
                src="img/ilustrations/auth.svg"
                className="mouse-3d-effect-tr h-positive all-3s"
                sx={{
                  width: "100%",
                  maxHeight: "400px",
                  display: { xs: "none", md: "block" },
                  objectFit: "contain",
                }}
                style={{
                  filter: (() => {
                    let bg = Color(
                      getSelectedPalette().palette.background.paper
                    );
                    return fdhue(bg, window.themeColors.teal);
                  })(),
                }}
              />
            </div>
          </Complement>
        </Grid>
        <Grid item xs={12} md={5} className="d-center">
          <Card sx={{ display: "inline-flex" }} className="flex-column">
            <Tabs
              className={fluidCSS()
                .lerpX("responsive-min", {
                  paddingRight: [10, 50],
                  paddingLeft: [10, 50],
                })
                .end()}
              value={tab}
              onChange={this.handleTabChange}
              centered
            >
              <Tab icon={<LoginIcon />} iconPosition="start" label="Entrar" />
              <Tab
                icon={<PersonAddIcon />}
                iconPosition="start"
                label="Registro"
              />
            </Tabs>
            <CardContent>
              {[
                () => <LoginForm onSubmit={this.handleLogin} />,
                () => <SignupForm onSubmit={this.handleSignup} />,
              ][tab]()}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  }
}
