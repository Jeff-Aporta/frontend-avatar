import React, { useState, useRef } from "react";
import { Typography, Button, Tooltip } from "@mui/material";
import { ZoomIn, ZoomOut, RestartAlt } from "@mui/icons-material";
import fluidCSS from "@jeff-aporta/fluidcss";
import { PaperP } from "@containers";
import dayjs from "dayjs";

import { isDark } from "@jeff-aporta/theme-manager";
import { useDrag, usePinch } from "@use-gesture/react";
import { DateRangeControls } from "@components/controls";
import { Graph, CHART_HEIGHT } from "@components/GUI/graph/graph";

import "./graph.css";

const ZOOM_LIMITS = { MIN: 0.5, MAX: 2 };
const ZOOM_STEP = 0.2;

function MovementsGraph({typeDataInput="ranges"}) {
  const [zoomlevel, setZoomLevel] = useState(1);
  const [dateRangeInit, setDateRangeInit] = useState(
    dayjs().subtract(1, "day")
  );
  const [dateRangeFin, setDateRangeFin] = useState(dayjs());
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);
  const containerRef = useRef(null);
  const touchCoords = useRef({ xini: 0 });

  // Datos de ejemplo para el gráfico
  const xData = Array.from({ length: 20 }, (_, i) =>
    dayjs(`2024-10-15T${i.toString().padStart(2, 0)}:00`).toDate()
  );
  const investmentData = Array.from(
    { length: 20 },
    () => Math.random() * 20 + 10
  );
  const withdrawalData = investmentData.map((y) => y + Math.random() * 10);

  const series = [
    {
      data: investmentData,
      label: "Compra",
      color: isDark() ? "lime" : "springGreen",
      fillcolor: isDark() ? "#0F5733" : "lightgreen",
    },
    {
      data: withdrawalData,
      label: "Venta",
      color: isDark() ? "red" : "salmon",
      fillcolor: isDark() ? "#570F36" : "pink",
    },
  ];

  const handleTouchStart = (e) => {
    touchCoords.current.xini = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (e.touches.length !== 1) return;

    const xfin = e.touches[0].clientX;
    const deltaX = xfin - touchCoords.current.xini;
    touchCoords.current.xini = xfin;

    if (Math.abs(deltaX) > 5) {
      containerRef.current?.scrollBy({
        left: e.target.scrollLeft - deltaX,
        behavior: "smooth",
      });
    }
  };

  usePinch(
    ({ offset: [d] }) => {
      const newZoom = 1 + d / 50;
      setZoomLevel(
        Math.min(Math.max(newZoom, ZOOM_LIMITS.MIN), ZOOM_LIMITS.MAX)
      );
    },
    {
      target: containerRef,
      scaleBounds: ZOOM_LIMITS,
    }
  );

  useDrag(
    ({ movement: [mx, my], first, last }) => {
      if (!first && !last) {
        setPosition((pos) => ({ x: pos.x + mx, y: pos.y + my }));
      }
    },
    {
      target: containerRef,
      from: () => [position.x, position.y],
    }
  );

  const handleWheel = (e) => {
    if (isActive && e.deltaY !== 0) {
      const newZoom = zoomlevel - e.deltaY * 0.001;
      setZoomLevel(
        Math.min(Math.max(newZoom, ZOOM_LIMITS.MIN), ZOOM_LIMITS.MAX)
      );
    }
  };

  function ZoomControls() {
    const handleReset = () => {
      setZoomLevel(1);
      setPosition({ x: 0, y: 0 });
    };

    return (
      <div className="d-flex flex-wrap gap-10px">
        <Tooltip title="Aumentar zoom (+)">
          <Button
            variant="contained"
            onClick={() =>
              setZoomLevel((prev) =>
                Math.min(prev + ZOOM_STEP, ZOOM_LIMITS.MAX)
              )
            }
            size="small"
          >
            <ZoomIn />
          </Button>
        </Tooltip>
        <Tooltip title="Reducir zoom (-)">
          <Button
            variant="contained"
            onClick={() =>
              setZoomLevel((prev) =>
                Math.max(prev - ZOOM_STEP, ZOOM_LIMITS.MIN)
              )
            }
            size="small"
          >
            <ZoomOut />
          </Button>
        </Tooltip>
        <Tooltip title="Reiniciar zoom">
          <Button variant="contained" onClick={handleReset} size="small">
            <RestartAlt />
          </Button>
        </Tooltip>
      </div>
    );
  }

  return (
    <PaperP
      elevation={0}
      className={`panel movements ${isDark() ? "dark" : "light"}`}
    >
      <br />
      <div className="d-flex jc-space-between flex-wrap gap-10px padb-20px">
        <ZoomControls />
        <div className={fluidCSS().ltX(850, { width: "100%" }).end()} />
        <DateRangeControls
          type={typeDataInput}
          dateRangeInit={dateRangeInit}
          dateRangeFin={dateRangeFin}
          setDateRangeInit={setDateRangeInit}
          setDateRangeFin={setDateRangeFin}
        />
      </div>

      <div
        ref={containerRef}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onFocus={(e) => {
          setIsActive(true);
        }}
        onBlur={() => {
          setIsActive(false);
        }}
        tabIndex="1"
        className="p-relative padl-20px padh-20px container-graph"
        style={{
          height: `${CHART_HEIGHT + 40}px`,
          overflowX: "auto",
        }}
      >
        {series.map((s, i) => (
          <Graph
            xdata={xData}
            i={i}
            key={i}
            zoomlevel={zoomlevel}
            series={series.map((s, j) => {
              if (i != j) {
                return {
                  ...s,
                  area: true,
                };
              }
              if (j == series.length - 1) {
                return s;
              }
              return {
                ...s,
                color: "transparent",
              };
            })}
            height={300}
            className="p-absolute"
            style={{
              mixBlendMode: isDark() ? "lighten" : "normal",
              transformOrigin: "right center",
              margin: "auto",
            }}
          />
        ))}
      </div>
    </PaperP>
  );
}

export default MovementsGraph;
