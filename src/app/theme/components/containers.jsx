import { Paper } from "@mui/material";
import fluidCSS from "@jeff-aporta/fluidcss";

export { DivM, PaperP };

function DivM({ m_min = 5, m_max = 20, className="", ...props } = {}) {
  return (
    <div
      {...props}
      className={fluidCSS()
        .lerpX(400, 1000, {
          margin: [m_min, m_max],
        })
        .end(`DivM tw-balance ${className}`)}
    />
  );
}

function PaperP({ p_min = 3, p_max = 20, className="", ...props } = {}) {
  return (
    <Paper
      {...props}
      className={fluidCSS()
        .lerpX(400, 1000, {
          Padding: [p_min, p_max],
        })
        .end(`PaperP tw-balance ${className}`)}
    />
  );
}
