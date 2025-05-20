import React from "react";
import { LineChart, areaElementClasses } from "@mui/x-charts/LineChart";
import { getTheme, isDark } from "@jeff-aporta/theme-manager";

const CHART_HEIGHT = 300;

function ColorSwitch({ threshold, color1, color2, id }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color1} />
        <stop offset="100%" stopColor={color2} />
      </linearGradient>
    </defs>
  );
}

function Graph({ i, ...props }) {
  const theme = getTheme();
  const idR = Math.random().toString(36).replace("0.", "id-");
  const { xdata, series, zoomlevel } = props;
  const overlayer = i === series.length - 1;
  const enfasis = theme.palette.background.paper;

  const chartStyles = {
    "& .MuiChartsLegend-root text": {
      fill: `${
        overlayer ? (isDark() ? "white" : "black") : "transparent"
      } !important`,
    },
    "& .MuiChartsAxis-line": {
      stroke: `${overlayer ? theme.palette.secondary.main : "transparent"} !important`,
    },
    "& .MuiChartsAxis-root": {
      fill: overlayer ? theme.palette.secondary.main : "transparent",
      stroke: "transparent !important",
    },
    "& .MuiChartsAxis-tick": {
      stroke: "transparent !important",
    },
    "& .MuiChartsAxis-tickLabel": {
      fill: overlayer ? theme.palette.secondary.main : "transparent",
      stroke: "transparent",
      fontSize: 12,
    },
    [`& .${areaElementClasses.root}`]: {
      fill: `url(#swich-color-${idR})`,
    },
  };

  return (
    <LineChart
      {...props}
      width={100 * xdata.length * zoomlevel}
      height={CHART_HEIGHT}
      xAxis={[
        {
          data: xdata,
          scaleType: "time",
          valueFormatter: (date) =>
            overlayer
              ? date.toLocaleDateString("es-ES", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "",
        },
      ]}
      yAxis={[
        {
          valueFormatter: (value) =>
            overlayer
              ? new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  minimumFractionDigits: 2,
                }).format(value)
              : "",
        },
      ]}
      sx={chartStyles}
    >
      <ColorSwitch
        threshold={0}
        color1={
          series.find((d) => d.area)?.fillcolor ??
          series.find((d) => d.area)?.color
        }
        color2={enfasis}
        id={`swich-color-${idR}`}
      />
    </LineChart>
  );
}

export { Graph, CHART_HEIGHT };
