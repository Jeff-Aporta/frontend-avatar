import React, { Component } from "react";

import "./Community.css";

import { Typography, AvatarGroup, Avatar, Box } from "@mui/material";
import { DivM, PaperP } from "@containers";
import { fluidCSS } from "@jeff-aporta/theme-manager";

// Usuarios para animación
const users = Array.from({ length: 42 }, (_, i) => ({
  alt: `User ${i + 1}`,
  src: `/img/test/persons/persona_${i + 1}.jpg`,
})).sort(() => Math.random() - 0.5);

export default function Community() {
  const content_text = (
    <>
      <Typography variant="h3" align="center" gutterBottom>
        Nuestra comunidad
      </Typography>
      <Typography variant="h6" align="center">
        Únete a más de 12 mil usuarios que ya confían en Avatar
      </Typography>
    </>
  );
  return (
    <PaperP p_max={50} className="p-relative d-center br-0">
      <AnimationAvatars />
      <div className="p-relative">
        <br />
        <br />
        <PaperP
          p_min={20}
          elevation={5}
          className={fluidCSS()
            .btwX("responsive", { opacity: [0.7, 0.87, 1] })
            .end("br-40px")}
        >
          <div className="v-hidden">{content_text}</div>
        </PaperP>
        <div className="p-absolute p-fill d-center-col">{content_text}</div>
        <br />
        <br />
      </div>
    </PaperP>
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
      <div className={["p-absolute", "p-fill", "overflow-hidden"].join(" ")}>
        <div
          className={[
            "p-absolute",
            "p-max-w",
            "p-centralize-center",
            "d-flex",
            "jc-space-evenly",
            "ai-center",
            "wrap",
            "gap-20px",
            "pad-20px",
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
        </div>
      </div>
    );
  }
}
