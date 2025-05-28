import React from "react";
import { Grid, Box, Typography, Button, Link } from "@mui/material";
import { PaperP } from "@containers";
import { JS2CSS } from "@jeff-aporta/theme-manager";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function lerp(vi, vf, t) {
  return vi + (vf - vi) * t;
}

function transition({
  t = 0.02,
  e,
  id,
  element,
  it = 0,
  f = 100,
  delay = 1000 / 30,
}) {
  if (element.dataset.id != id) {
    return;
  }
  if (!(it < f)) {
    return;
  }
  if (!e) {
    return;
  }
  const { left, top } = element.getBoundingClientRect();

  const screenX = window.screenX + left;
  const screenY = window.screenY + top;

  const a = 30;

  const nrotateX = clamp(
    -(a * (e.screenY - screenY)) / window.innerHeight,
    -a,
    a
  );
  const nrotateY = clamp(
    (a * (e.screenX - screenX)) / window.innerWidth,
    -a,
    a
  );
  const tx_ = 40;
  const ntx = clamp(
    (tx_ * (e.screenX - window.innerWidth / 2)) / window.innerWidth,
    -tx_,
    tx_
  );
  const ty_ = 20;
  const nty = clamp(
    (ty_ * (e.screenY - window.innerHeight / 2)) / window.innerHeight,
    -ty_,
    ty_
  );
  const tx = lerp(+element.dataset.tx, ntx, t);
  const ty = lerp(+element.dataset.ty, nty, t);
  const rotateX = lerp(+element.dataset.rotateX, nrotateX, t);
  const rotateY = lerp(+element.dataset.rotateY, nrotateY, t);
  Object.assign(element.dataset, { rotateX, rotateY, tx, ty });
  Object.assign(element.style, {
    transform: [
      `translateX(${tx}px)`,
      `translateY(${ty}px)`,
      `rotateX(${rotateX}deg)`,
      `rotateY(${rotateY}deg)`,
    ].join(" "),
  });
  setTimeout(
    () =>
      transition({
        t,
        e,
        id,
        element,
        it: it + 1,
        delay,
        f,
      }),
    delay
  );
}

JS2CSS.insertStyle({
  id: "rotate-mouse-3d",
  ".rotate-mouse-3d": {
    transformStyle: "preserve-3d",
    perspectiveOrigin: "50% 50%",
    perspective: "2000px",
  },
});

document.addEventListener("mousemove", (e) => {
  const img = document.querySelector(".rotate-mouse-3d");
  if (img) {
    img.dataset.rotateX ??= 0;
    img.dataset.rotateY ??= 0;
    img.dataset.tx ??= 0;
    img.dataset.ty ??= 0;
    img.dataset.id = Math.random().toString(36).replace("0.", "");
    transition({ id: img.dataset.id, element: img, e });
  }
});

export default function Hero() {
  return (
    <PaperP sx={{ py: 8 }}>
      <Grid container spacing={4} alignItems="center">
        <Grid item xs={12} md={6}>
          <Typography variant="h3" gutterBottom>
            Todo tu negocio en una sola plataforma
          </Typography>
          <Typography variant="h6" color="text.secondary" mb={4}>
            Simplifica, automatiza y acelera tus procesos con Avatar
          </Typography>
          <Button variant="contained" size="large">
            Empieza ahora
          </Button>
          <Box mt={2}>
            <Link href="#" underline="hover">
              Obtener información para empezar a generar ingresos &rarr;
            </Link>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src="/img/ilustration2.svg"
            alt="Illustration"
            className="rotate-mouse-3d"
            sx={{ width: "100%", height: "auto" }}
          />
        </Grid>
      </Grid>
    </PaperP>
  );
}
