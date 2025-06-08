import React, { Component } from "react";

import "./Community.css";

import { Typography, AvatarGroup, Avatar, Box } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";
import {
  fluidCSS,
  PaperDesign,
  PaperLayer,
  DivM,
  PaperP,
  Design,
  Layer,
} from "@jeff-aporta/camaleon";

// Usuarios para animación
const users = Array.from({ length: 42 }, (_, i) => ({
  alt: `User ${i + 1}`,
  src: `img/test/persons/persona_${i + 1}.jpg`,
})).sort(() => Math.random() - 0.5);

export default function Community() {
  const { view } = window;
  const margen = Array.from({ length: 2 }, (_, i) => <br key={i} />);
  return (
    <PaperDesign
      nobr
      layerProps={{
        className: "d-center col-direction",
      }}
    >
      <AnimationAvatars />
      {margen}
      <PaperDesign
        p_min={10}
        p_max={20}
        elevation={5}
        className={fluidCSS()
          .btwX("responsive", { opacity: [0.7, 0.87, 1] })
          .lerpX("responsive-min", {
            borderRadius: [0, 50],
          })
          .end("fit-w")}
        layerProps={{
          className: "d-center col-direction",
        }}
      >
        <div className="d-center col-direction gap-10px">
          <Typography variant="h3" align="center" gutterBottom>
            Nuestra comunidad
          </Typography>
          <div
            className={fluidCSS()
              .ltX("small", {
                display: "none",
              })
              .end()}
          >
            <div
              className="d-center col-direction"
              style={{
                padding: "10px",
                borderRadius: "50%",
                backgroundColor: "rgba(128, 128, 128, 0.1)",
                border: "4px solid rgba(128, 128, 128, 0.5)",
              }}
            >
              <GroupIcon fontSize="large" color={view.icon} />
            </div>
            <br />
          </div>
        </div>
        <Typography variant="h6" align="center">
          Únete a más de 12 mil usuarios que ya confían en Avatar
        </Typography>
      </PaperDesign>
      {margen}
    </PaperDesign>
  );
}

// Componente de clase para animación de avatares
class AnimationAvatars extends Component {
  state = { index: 0 };

  componentDidMount() {
    /*   this.interval = setInterval(() => {
      this.setState(({ index }) => ({ index: (index + 1) % users.length }));
    }, 2000); */
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const max = 150;
    const { index } = this.state;
    const displayed = Array.from(
      { length: max },
      (_, j) => users[(index + j) % users.length]
    );
    const indexes = displayed.map((_, i) => i);
    indexes.sort(() => Math.random() - 0.5);
    return (
      <Layer fill className="overflow-hidden">
        <Layer
          fullw
          center
          centralized
          className={[
            "d-flex",
            "wrap",
            "jc-space-evenly",
            "ai-center",
            "gap-20px",
          ].join(" ")}
        >
          {displayed.map((user, i) => (
            <Avatar
              key={i}
              alt={user.alt}
              src={user.src}
              variant="rounded"
              className={fluidCSS()
                .lerpX("responsive-min", {
                  width: [30, 50],
                  height: [30, 50],
                })
                .end("animationAvatars")}
              style={{ "--delay": `${indexes[i]}s` }}
            />
          ))}
        </Layer>
      </Layer>
    );
  }
}
