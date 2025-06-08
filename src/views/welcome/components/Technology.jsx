import React from "react";
import { Typography, Grid } from "@mui/material";
import { PaperP } from "@jeff-aporta/camaleon";
import {
  CloudQueue as CloudIcon,
  Memory as AiIcon,
  Storage as StorageIcon,
} from "@mui/icons-material";

import { ItemPromo } from "./$comun";

export default function Technology() {
  const items = [
    {
      icon: (sz) => <CloudIcon fontSize={sz} color={window.view.icon} />,
      label: "Servicios en la nube",
    },
    {
      icon: (sz) => <AiIcon fontSize={sz} color={window.view.icon} />,
      label: "Inteligencia Artificial",
    },
    {
      icon: (sz) => <StorageIcon fontSize={sz} color={window.view.icon} />,
      label: "APIs robustas",
    },
  ];
  return (
    <PaperP sx={{ py: 8, bgcolor: "background.paper" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Tecnología
      </Typography>
      <hr />
      <br />
      <Grid container spacing={4} justifyContent="center">
        {items.map((item, i) => (
          <ItemPromo item={item} xs={12} sm={4} key={i} />
        ))}
      </Grid>
    </PaperP>
  );
}
