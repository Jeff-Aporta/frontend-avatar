import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import JS2CSS from "@jeff-aporta/js2css";

import { getTheme, isDark } from "@jeff-aporta/theme-manager";
import { ImageLocal } from "@recurrent";

import { lighten } from "@mui/material";
import { Box } from "@mui/material";

import "./slick-carrousel.css";

//-------------------------------------

export default FyxCarrusel;

//------------ definitions ------------

function CustomArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`arrow-fyx-carrusel ${className}`}
      onClick={onClick}
      style={{
        ...style,
        background: getTheme().palette.primary.main,
      }}
    />
  );
}

function FyxCarrusel(props) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  JS2CSS.insertStyle({
    id: "fyx-carrusel",
    objJs: {
      ".slick-dots li.slick-active div": {
        background: `${
          isDark() ? "white" : "var(--verde-cielo)"
        } !important` /* Cambia este color según tu tema */,
      },
    },
  });
  const settings = {
    dots: true, // Mostrar puntos de navegación
    infinite: true, // Carrusel infinito
    speed: 500, // Velocidad de transición
    slidesToShow: windowWidth < 900 ? 1 : windowWidth < 1200 ? 2 : 3, // Cantidad de slides visibles
    slidesToScroll: 1, // Cantidad de slides a desplazar
    nextArrow: <CustomArrow />,
    prevArrow: <CustomArrow />,
    className: "slide-fyx-carrusel",
    // Personalizar los dots para que sean blancos
    customPaging: (i) => (
      <div
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          background: `rgba(${isDark() ? "255,255,255" : "0,0,0"}, 0.125)`,
          margin: "0 4px",
        }}
      />
    ),
    autoplay: true, // Reproducción automática
    autoplaySpeed: 3000, // Intervalo de reproducción
  };

  const h = props.style?.minHeight ?? "40vh";

  const sliderStyles = {
    container: {
      margin: "0 auto",
      backgroundColor: isDark()
        ? getTheme().palette.background.paper
        : lighten(getTheme().palette.verde_cielo.main, 0.9),
      padding: "20px 32px",
      borderRadius: "8px",
    },
    button: {
      zIndex: 1,
      backgroundColor: getTheme().palette.primary.main,
      border: "none",
      padding: "8px 16px",
      color: getTheme().palette.getContrastText(getTheme().palette.primary.main),
      cursor: "pointer",
      borderRadius: "4px",
    },
  };

  const { children, ...rest_props } = props;

  return (
    <Box {...rest_props} sx={sliderStyles.container}>
      <Slider {...settings} style={{ minHeight: h }}>
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} inert className="no-border-focus" style={{ height: h }}>
            <ImageLocal
              src={`img/test/${i + 1}.jpg`}
              className="object-fit-cover"
              style={{ width: "100%", height: h }}
            />
          </div>
        ))}
      </Slider>
    </Box>
  );
}
