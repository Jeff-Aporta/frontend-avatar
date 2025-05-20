import { PaperP } from "@containers";
import { href } from "@jeff-aporta/theme-manager";
import {
  Box,
  Container,
  FormControl,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import { ImageLocal } from "@recurrent";

import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";

export default Footer;

function Footer({ updateThemeName, getThemeName }) {
  return (
    <>
      <FooterNavSection />
      <PaperP elevation={0} className="content-container footer">
        <SelectThemeName {...{ getThemeName, updateThemeName }} />
      </PaperP>
    </>
  );
}

function SelectThemeName({ getThemeName, updateThemeName }) {
  return (
    <FormControl style={{ width: "150px" }}>
      <InputLabel id="label-select-theme-name">Nombre tema</InputLabel>
      <Select
        labelId="label-select-theme-name"
        id="select-theme-name"
        value={getThemeName()}
        onChange={(e) => updateThemeName(e.target.value)}
      >
        <MenuItem value="main">Main</MenuItem>
        <MenuItem value="skygreen">Verde cielo</MenuItem>
        <MenuItem value="lemongreen">Verde lima</MenuItem>
        <MenuItem value="springgreen">Verde primavera</MenuItem>
        <MenuItem value="blacknwhite">Blanco y negro</MenuItem>
      </Select>
    </FormControl>
  );
}

function FooterNavSection() {
  const year = new Date().getFullYear();
  return (
    <Paper
      sx={{
        padding: "60px 0 20px",
      }}
    >
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={12} md={12}>
            <Box sx={{ textAlign: "right" }}>
              <ImageLocal
                src="img/logo-main.svg"
                alt="Logo"
                style={{
                  width: "120px",
                  marginBottom: "20px",
                  marginLeft: "auto",
                }}
              />
              <Typography variant="body2" sx={{ mb: 1 }}>
                Plataforma integral de automatización y gestión digital de procesos empresariales.
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Automatización de servicio al cliente, gestión de proyectos y Guía Matic.
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {`© ${year} Avatar. Todos los derechos reservados.`}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                  mb: 2,
                }}
              >
                <img
                  src="https://logo.clearbit.com/play.google.com"
                  alt="Google Play"
                  style={{ height: "30px", borderRadius: "4px" }}
                />
                <img
                  src="https://logo.clearbit.com/apple.com"
                  alt="App Store"
                  style={{ height: "30px", borderRadius: "4px" }}
                />
              </Box>
              <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                <Link href="#" color="inherit">
                  <Box
                    sx={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      bgcolor: "action.hover",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FacebookIcon fontSize="small" />
                  </Box>
                </Link>
                <Link href="#" color="inherit">
                  <Box
                    sx={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      bgcolor: "action.hover",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <TwitterIcon fontSize="small" />
                  </Box>
                </Link>
                <Link href="#" color="inherit">
                  <Box
                    sx={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      bgcolor: "action.hover",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <InstagramIcon fontSize="small" />
                  </Box>
                </Link>
                <Link href="#" color="inherit">
                  <Box
                    sx={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      bgcolor: "action.hover",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <YouTubeIcon fontSize="small" />
                  </Box>
                </Link>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Typography
          variant="caption"
          align="center"
          sx={{
            display: "block",
            mt: 4,
            opacity: 0.5,
          }}
        >
          {`© ${year} Avatar. Todos los derechos reservados.`}
        </Typography>
      </Container>
    </Paper>
  );
}
