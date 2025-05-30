import { Grid, Typography } from "@mui/material";
import { fluidCSS } from "@jeff-aporta/theme-manager";

export function ItemPromo({ item, xs, sm }) {
  return (
    <Grid item xs={xs} sm={sm} textAlign="center">
      <span
        className={fluidCSS()
          .ltX("small", {
            display: "none",
          })
          .end()}
      >
        {item.icon("large")}
      </span>
      <Typography variant="h6" mt={2} className="d-center gap-10px">
        <span
          className={fluidCSS()
            .gtX("small", {
              display: "none",
            })
            .end()}
        >
          {item.icon("medium")}
        </span>
        {item.label}
      </Typography>
    </Grid>
  );
}
