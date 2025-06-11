import React from "react";
import { Main } from "@theme/main.jsx";
import { href, DivM, Design, PaperLayer } from "@jeff-aporta/camaleon";
import { Typography } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BusinessIcon from "@mui/icons-material/Business";
import EmailIcon from "@mui/icons-material/Email";
import PeopleIcon from "@mui/icons-material/People";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import InventoryIcon from "@mui/icons-material/Inventory";
import GroupsIcon from "@mui/icons-material/Groups";
import SettingsIcon from "@mui/icons-material/Settings";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { ImageLocal } from "@recurrent";
import { JS2CSS } from "@jeff-aporta/camaleon";

export default function () {
  const variant = "subtitle1";

  const body = [
    {
      labelfor: true,
      icon: <ImageLocal src="img/logo.svg" width="40px" />,
      label: "Avatar",
    },
    {
      hr: true,
    },
    {
      icon: <DashboardIcon fontSize="small" />,
      label: "Dashboard",
    },
    {
      icon: <BusinessIcon fontSize="small" />,
      label: "Empresas",
    },
    {
      icon: <EmailIcon fontSize="small" />,
      label: "Correos",
    },
    {
      icon: <PeopleIcon fontSize="small" />,
      label: "CRM",
    },
    {
      icon: <AttachMoneyIcon fontSize="small" />,
      label: "Finanzas",
    },
    {
      icon: <InventoryIcon fontSize="small" />,
      label: "Inventario",
    },
    {
      icon: <GroupsIcon fontSize="small" />,
      label: "Recursos Humanos",
    },
    {
      icon: <SettingsIcon fontSize="small" />,
      label: "Configuración",
    },
    {
      icon: <SmartToyIcon fontSize="small" />,
      label: "Asistente IA",
    },
  ];

  function Item({ icon, label, labelfor, hr, ...props }) {
    if (hr) {
      return <hr />;
    }
    const element = (
      <>
        {icon}
        <Typography variant={variant} className="visible-uncollapsed">
          {label}
        </Typography>
      </>
    );

    if (labelfor) {
      return (
        <label
          htmlFor="check-menu-collapsed"
          style={{ cursor: "pointer", userSelect: "none" }}
        >
          {element}
        </label>
      );
    }
    return (
      <div {...props} className="flex align-center gap-10px">
        {element}
      </div>
    );
  }

  JS2CSS.insertStyle({
    id: "menu-collapsed",
    ".menu-collapsed": {
      "--state-uncollapse": "scaleX(1)",
      "--state-width": "180px",
      "&:has(input[type=checkbox]:checked)": {
        "--state-uncollapse": "scaleX(0)",
        "--state-width": "0px",
      },
      "& .visible-uncollapsed": {
        transition: "transform 0.15s, width 0.3s",
        transform: "var(--state-uncollapse)",
        overflow: "hidden",
        transitionOrigin: "0 50%",
        width: "var(--state-width)",
        whiteSpace: "nowrap",
      },
    },
  });

  return (
    <Main bgtype="default" h_init={"0px"}>
      <Design>
        <div style={{ paddingLeft: "30px" }}>
          <h1>Hola mundo</h1>
        </div>
      </Design>
      <Design className="menu-collapsed">
        <input
          type="checkbox"
          id="check-menu-collapsed"
          style={{ display: "none" }}
        />
        <PaperLayer>
          <div className="flex col-direction gap-10px pad-10px">
            {body.map((item, i) => (
              <Item key={i} {...item} />
            ))}
          </div>
        </PaperLayer>
      </Design>
    </Main>
  );
}
