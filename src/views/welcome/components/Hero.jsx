import React from "react";
import { Grid, Box, Typography, Button, Link } from "@mui/material";
import { PaperP, Hm } from "@containers";
import { ImageLocal } from "@recurrent";
import {
  JS2CSS,
  linearGradient,
  Color,
  getSelectedPalette,
  fdhue,
  map,
  clamp,
  lerp,
  solid,
  isDark,
  fluidCSS,
} from "@jeff-aporta/theme-manager";

export default function Hero() {
  let bg = Color(getSelectedPalette().palette.background.paper);
  let bgop = `rgba(${[...bg.rgb().array(), 0.75].join(", ")})`;
  return (
    <PaperP
      elevation={0}
      sx={{ py: 8 }}
      className="br-0 p-relative min-h-80vh d-center-col"
    >
      <Hm />
      <div
        className="p-absolute p-fill bg-paperP"
        style={{
          filter: fdhue(bg, window.themeColors.springGreen),
          background: [
            linearGradient({
              angle: "to right",
              colors: [
                bg[["toWhite", "toBlack"][+isDark()]](0.5).hex(),
                "transparent",
              ],
            }),
            solid(bgop),
            `url(/img/ilustrations/bgbanner.svg)`,
          ].join(", "),
        }}
      />
      <Grid container spacing={4} alignItems="center">
        <Grid
          item
          xs={12}
          md={7}
          sx={{
            display: { xs: "flex", md: "block" },
            flexDirection: { xs: "column", md: "row" },
            textAlign: { xs: "center", md: "left" },
            justifyContent: { xs: "center", md: "flex-start" },
          }}
        >
          <Typography variant="h2" gutterBottom>
            Todo tu negocio en una sola plataforma
          </Typography>
          <Typography variant="h6" color="text.secondary" mb={4}>
            Simplifica, automatiza y acelera tus procesos con Avatar
          </Typography>
          <div>
            <Button variant="contained" size="large">
              Empieza ahora
            </Button>
          </div>
          <br />
          <Box mt={2}>
            <Link href="#" underline="hover">
              Obtener información para empezar a generar ingresos &rarr;
            </Link>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={5}
          sx={{ textAlign: { xs: "center", md: "right" } }}
        >
          <ImageLocal
            src="img/ilustrations/ilustration.svg"
            alt="Illustration"
            className={fluidCSS()
              .ltX("small", {
                display: "none",
              })
              .ltX("medium", {
                width: ["70%", "100%"],
              })
              .end("mouse-3d-effect-tr h-positive all-3s")}
            sx={{
              objectFit: "contain",
            }}
          />
        </Grid>
      </Grid>
    </PaperP>
  );
}
