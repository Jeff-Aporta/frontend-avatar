import React from "react";

import { Main } from "@theme/main.jsx";
import { DivM, PaperP } from "@jeff-aporta/camaleon";
import { Typography } from "@mui/material";

export default State404;

function State404() {
  return (
    <Main bgtype="portal" h_init="100px" h_fin="100px">
      <DivM m_max={40} className="d-center min-h-50vh">
        <PaperP style={{ borderRadius: "20px" }}>
          <Typography variant="h1">404 ⚠️</Typography>
          <Typography variant="h5">(No encontrado).</Typography>
        </PaperP>
      </DivM>
    </Main>
  );
}
