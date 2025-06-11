import React, { Component } from "react";
import "./dashboard.css";
import { Main } from "@theme/main.jsx";
import { Design, driverParams } from "@jeff-aporta/camaleon";
import { Typography } from "@mui/material";
import { ImageLocal } from "@recurrent";
import { JS2CSS } from "@jeff-aporta/camaleon";
import { MenuCollapsed } from "./MenuCollapsed";
import DashboardView from "./tabs/Main";
import EmpresasView from "./tabs/Empresas";
import CorreosView from "./tabs/Correos";
import CRMView from "./tabs/CRM";
import FinanzasView from "./tabs/Finanzas";
import InventarioView from "./tabs/Inventario";
import RecursosHumanosView from "./tabs/RecursosHumanos";
import ConfiguracionView from "./tabs/Configuracion";
import AsistenteIAView from "./tabs/AsistenteIA";

let singletonDash;

export default function(){
  return <Dashboard />
}

class Dashboard extends Component {
  constructor(props) {
    super(props);
    singletonDash = this;
  }

  render() {
    const dashview = getDashView();
    return (
      <Main bgtype="default" h_init={"0"} h_fin={"0"}>
        <Design className="min-h-80vh template-dashboard">
          <MenuCollapsed />
          <Design style={{ zIndex: "1" }} className="is-padding-menu">
            {(() => {
              switch (dashview) {
                case "dashboard":
                case "main":
                  return <DashboardView />;
                case "empresas":
                  return <EmpresasView />;
                case "correos":
                  return <CorreosView />;
                case "crm":
                  return <CRMView />;
                case "finanzas":
                  return <FinanzasView />;
                case "inventario":
                  return <InventarioView />;
                case "recursos-humanos":
                  return <RecursosHumanosView />;
                case "configuracion":
                  return <ConfiguracionView />;
                case "asistente-ia":
                  return <AsistenteIAView />;
                default:
                  return "No se conoce la vista " + dashview;
              }
            })()}
          </Design>
        </Design>
      </Main>
    );
  }
}

function setDashView(id){
  driverParams.set("dash-view", "main");
  singletonDash.forceUpdate();
}

function getDashView() {
  let dashview = driverParams.get("dash-view");
  if (!dashview) {
    dashview = "main";
    driverParams.set("dash-view", "main");
  }
  return dashview;
}
