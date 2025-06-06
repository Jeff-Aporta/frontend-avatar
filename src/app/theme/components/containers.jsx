import { Paper } from "@mui/material";
import fluidCSS from "@jeff-aporta/fluidcss";

export function Hm({
  h_min = 20,
  h_max = 30,
  r = 1,
  className = "",
  ...props
} = {}) {
  return (
    <div
      {...props}
      className={fluidCSS()
        .lerpX("responsive", {
          height: [h_min * r, h_max * r],
        })
        .end(`Hm tw-balance ${className}`)}
    />
  );
}

export function DivM({ m_min = 5, m_max = 20, className = "", ...props } = {}) {
  return (
    <div
      {...props}
      className={fluidCSS()
        .lerpX("responsive", {
          margin: [m_min, m_max],
        })
        .end(`DivM tw-balance ${className}`)}
    />
  );
}

export function PaperF({ children, className = "", hm = true, ...props }) {
  return (
    <Paper {...props} className="PaperF tw-balance br-0">
      {hm && <Hm />}
      <div className={className}>{children}</div>
      {hm && <Hm />}
    </Paper>
  );
}

export function PaperP({
  p_min = 3,
  p_max = 20,
  className = "",
  children,
  ...props
} = {}) {
  return (
    <Paper
      {...props}
      className={fluidCSS()
        .lerpX("responsive", {
          Padding: [p_min, p_max],
        })
        .end(`PaperP tw-balance ${className}`)}
    >
      <Hm />
      {children}
      <Hm />
    </Paper>
  );
}
