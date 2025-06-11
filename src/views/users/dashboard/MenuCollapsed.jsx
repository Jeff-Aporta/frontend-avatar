import React from "react";
import BuildCircleTwoToneIcon from "@mui/icons-material/BuildCircleTwoTone";
import HighlightOffTwoToneIcon from "@mui/icons-material/HighlightOffTwoTone";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BusinessIcon from "@mui/icons-material/Business";
import EmailIcon from "@mui/icons-material/Email";
import PeopleIcon from "@mui/icons-material/People";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import InventoryIcon from "@mui/icons-material/Inventory";
import GroupsIcon from "@mui/icons-material/Groups";
import SettingsIcon from "@mui/icons-material/Settings";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { PaperLayer } from "@jeff-aporta/camaleon";
import { Button, Divider, Typography } from "@mui/material";
import { setDashView } from "./dashboard";


export function MenuCollapsed() {
 const variant = "subtitle2";
 const classIcon = "mr-when-collapsed"

 const body = [
   {
     labelfor: true,
     icon: (
       <div className="mr-when-collapsed">
         <BuildCircleTwoToneIcon
           fontSize="large"
           className="show-when-collapsed"
         />
         <HighlightOffTwoToneIcon
           fontSize="large"
           className="hide-when-collapsed"
         />
       </div>
     ),
     label: "Menu",
   },
   {
     hr: true,
   },
   {
     icon: <DashboardIcon className={classIcon} />,
     label: "Dashboard",
     view: "main",
   },
   {
     icon: <BusinessIcon className={classIcon} />,
     label: "Empresas",
     view: "empresas",
   },
   {
     icon: <EmailIcon className={classIcon} />,
     label: "Correos",
     view: "correos",
   },
   {
     icon: <PeopleIcon className={classIcon} />,
     label: "CRM",
     view: "crm",
   },
   {
     icon: <AttachMoneyIcon className={classIcon} />,
     label: "Finanzas",
     view: "finanzas",
   },
   {
     icon: <InventoryIcon className={classIcon} />,
     label: "Inventario",
     view: "inventario",
   },
   {
     icon: <GroupsIcon className={classIcon} />,
     label: "Recursos Humanos",
     view: "recursos-humanos",
   },
   {
     icon: <SettingsIcon className={classIcon} />,
     label: "Configuración",
     view: "configuracion",
   },
   {
     icon: <SmartToyIcon className={classIcon} />,
     label: "Asistente IA",
     view: "asistente-ia",
   },
 ];

 return (
   <>
     <label
       htmlFor="check-menu-collapsed"
       className="layer fill backdrop-menu-collapsed"
       style={{ zIndex: "2" }}
     />
     <PaperLayer className="menu-collapsed full-h" style={{ zIndex: "3" }}>
       <input
         type="checkbox"
         id="check-menu-collapsed"
         style={{ display: "none" }}
       />
       <div className="flex col-direction gap-10px">
         {body.map((item, i) => (
           <Item key={i} {...item} />
         ))}
       </div>
     </PaperLayer>
   </>
 );

 function Item({ icon, label, labelfor, hr, view, ...props }) {
   if (hr) {
     return <Divider />;
   }
   let element = (
     <>
       {icon}
       <Typography variant={variant} className="visible-uncollapsed">
         {label}
       </Typography>
     </>
   );

   if (labelfor) {
     element = (
       <label
         htmlFor="check-menu-collapsed"
         style={{ width: "100%"}}
         className="c-pointer"
       >
         <div className="flex center-when-collapsed align-center">{element}</div>
       </label>
     );
   } else {
     element = <div className="flex align-center">{element}</div>;
   }
   return (
     <Button
       {...props}
       color="inherit"
       size="small"
       className="center-when-collapsed"
       onClick={() => setDashView(view)}
     >
       {element}
     </Button>
   );
 }
}