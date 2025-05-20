import { Paper } from "@mui/material";
import fluidCSS from "@jeff-aporta/fluidcss";

export {
    DivM,
    PaperP
}

function DivM(props) {
  const { m_min = 5, m_max = 20 } = props;
  return (
    <div
      {...props}
      className={fluidCSS()
        .lerpX(400, 1000, {
          margin: [m_min, m_max],
        })
        .end(`DivM m-30px tw-balance ${props.className??""}`)}
    />
  );
}

function PaperP(props) {
  const { p_min = 3, p_max = 10 } = props;
  return (
    <Paper
      {...props}
      className={fluidCSS()
        .lerpX(400, 1000, {
          Padding: [p_min, p_max],
        })
        .end(`PaperP pad-20px tw-balance ${props.className??""}`)}
    />
  );
}