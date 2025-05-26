import React, { useEffect, useRef, useState } from "react";

import JS2CSS from "@jeff-aporta/js2css";

import {
  isDark,
  isThemed,
  controlComponents,
  colorsTheme,
  typographyTheme,
} from "@jeff-aporta/theme-manager";

import FyxDialog from "@components/GUI/dialog";

import {
  Alert,
  Box,
  Chip,
  Collapse,
  FormControl,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import fluidCSS from "@jeff-aporta/fluidcss";

const PUBLIC_URL = process.env.PUBLIC_URL;

function TooltipIconButton({ title, disabled, onClick, icon, ...rest_props }) {
  return (
    <div {...rest_props} className={rest_props.className ?? ""}>
      <TooltipNoPointerEvents
        title={typeof title === "string" ? title : title()}
        placement="left"
      >
        <div className="d-inline-block">
          <IconButton
            disabled={
              typeof disabled == "string"
                ? disabled
                : typeof disabled == "boolean"
                ? disabled
                : typeof disabled == "function"
                ? disabled()
                : false
            }
            onClick={onClick}
          >
            {icon}
          </IconButton>
        </div>
      </TooltipNoPointerEvents>
    </div>
  );
}

function ImageLocal(props) {
  const { src, ...rest } = props;
  return <img {...{ alt: "", ...rest }} src={`${PUBLIC_URL}/${src}`} />;
}

function BoxForm(props) {
  const refForm = useRef();
  const { onSubmit, ...rest } = props;
  const [alert, setAlert] = useState({});
  const [open, setOpen] = React.useState(false);

  function notify(response) {
    setOpen(true);
    setAlert(response);
  }

  return (
    <Box
      {...rest}
      ref={refForm}
      component="form"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        if (onSubmit) {
          const response = await onSubmit(e, data, notify, () => form.reset());
          if (response) {
            notify(response);
            setTimeout(() => {
              setOpen(false);
            }, 5000);
          }
        }
      }}
    >
      <Collapse in={open}>
        <Alert
          variant={isDark() ? "outlined" : "filled"}
          severity={alert.severity}
          icon={alert.icon}
        >
          {alert.message}
        </Alert>
        <br />
      </Collapse>
      {props.children}
    </Box>
  );
}

function TitleInfo(props) {
  const { title, information, variant } = props;
  return (
    <Typography variant={variant ?? "h6"}>
      {title}
      <Info
        placement="right"
        className="ml-20px"
        title_text={
          <>
            <div style={{ opacity: 0.8, fontSize: "10px" }} className="mb-20px">
              <Chip label="Información" variant="outlined" />
            </div>
            {title}
          </>
        }
        title={information}
      />
    </Typography>
  );
}

function TooltipNoPointerEvents(props) {
  return <Tooltip {...props} PopperProps={{ sx: { pointerEvents: "none" } }} />;
}

function Info(props) {
  const [, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(Math.random());
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { title, title_text, ...rest_props } = props;

  return (
    <FyxDialog
      {...rest_props}
      text={title}
      title_text={title_text ?? "Información"}
    >
      <TooltipNoPointerEvents {...rest_props} title={title}>
        <Typography color="secondary" className="d-inline-block c-pointer">
          <i className="fa-solid fa-info-circle" />
        </Typography>
      </TooltipNoPointerEvents>
    </FyxDialog>
  );
}

function Captionize({ children, style = {}, className = "", label, ...rest }) {
  return (
    <div className={`d-flex-col jc-space-between ${className}`}>
      <Typography variant="caption" color="secondary">
        <small>{label}</small>
      </Typography>
      <FormControl variant="standard" style={style} {...rest}>
        {children}
      </FormControl>
    </div>
  );
}

function generate_inputs(array) {
  const { Input } = isThemed();

  return array.map((structure, i) => {
    structure.placeholder ??=
      `Ingresa ${structure.fem ? "la" : "el"} ` + structure.label.toLowerCase();
    return (
      <Captionize key={i} label={structure.label}>
        <AnInput {...structure} />
      </Captionize>
    );
  });
}

function AnInput(props) {
  const {
    color = colorsTheme().primary.color,
    required = true,
    placeholder,
    value,
    ...rest
  } = props;
  return (
    <Input
      {...rest}
      placeholder={placeholder}
      required={required}
      variant="filled"
      color="purpleAccent"
      inputProps={{ min: 1 }}
      value={value}
      style={{
        minWidth: typographyTheme().widthAproxString(placeholder) + 20,
      }}
      sx={{
        "& input::placeholder": {
          fontSize: `${typographyTheme().fontSize}px`,
          opacity: 0.7,
        },
        [[
          `& input[type=number]::-webkit-outer-spin-button`,
          `& input[type=number]::-webkit-inner-spin-button`,
        ].join(", ")]: {
          filter: isDark()
            ? `invert(0.9) sepia() hue-rotate(${color.hue()}deg)`
            : "",
        },
      }}
    />
  );
}

function generate_selects(array) {
  return array.map((structure, i) => {
    return <AnSelect {...structure} key={i} />;
  });
}

function AnSelect(props) {
  const {
    onChange,
    setter,
    style,
    label,
    value,
    name,
    opns,
    required = true,
    fem = false,
    ...rest
  } = newProps();

  const { enfasis_input } = controlComponents();

  const lblID = `lbl-${name}`,
    selectID = `select-${name}`,
    captionizeID = `captionize-${name}`;

  JS2CSS.insertStyle({
    id: `js2css-${captionizeID}`,
    objJs: {
      [`#${lblID}`]: {
        transition: "opacity 0.4s",
        [`&[data-shrink="true"]`]: {
          opacity: 0,
        },
      },
    },
  });

  const inputlbl = `Selecciona ${fem ? "la" : "el"} ` + label.toLowerCase();

  return (
    <Captionize
      id={captionizeID}
      label={label}
      color={enfasis_input}
      style={style}
    >
      <div className="d-flex ai-end">
        <InputLabel id={lblID}>{value ? "" : inputlbl}</InputLabel>
        <Select
          {...rest}
          required={required}
          fullWidth
          style={{
            ...style,
            minWidth: typographyTheme().widthAproxString(inputlbl) + 30,
          }}
          name={name}
          labelId={lblID}
          id={selectID}
          value={value}
          onChange={(event) => {
            const newvalue = event.target.value;
            if (setter) {
              setter(newvalue);
            }
            if (onChange) {
              onChange(event, newvalue);
            }
          }}
          MenuProps={{
            disableScrollLock: true, // Evita que se bloquee el scroll
          }}
        >
          {opns.map((o, j) => (
            <MenuItem key={j} value={o}>
              {o}
            </MenuItem>
          ))}
        </Select>
      </div>
    </Captionize>
  );

  function newProps() {
    const { model, ...rest } = props;
    if (!model) {
      return props;
    }
    switch (model.toLowerCase()) {
      case "plan":
        return {
          ...rest,
          label: "Plan",
          name: "investment_package",
          opns: ["Básico", "Avanzado", "Pro", "Élite", "Premium"],
        };
      case "interval":
        return {
          ...rest,
          label: "Intervalo",
          name: "interval_time",
          opns: [
            "5 minutos",
            "10 minutos",
            "15 minutos",
            "1 hora",
            "1 día",
            "1 semana",
            "2 semanas",
            "1 mes",
          ],
        };
      default:
        return "Model not recognized " + model;
    }
  }
}

function Title({ txt }) {
  if (!txt) return null;
  // Asegurarse que el selector del título exista antes de modificarlo
  const titleElement = document.querySelector("title");
  if (titleElement) {
    titleElement.innerHTML = txt;
  }
  return (
    <>
      <Typography
        variant="h2" // Usar h2 como en panel-robot
        className={fluidCSS().ltX(600, { fontWeight: "500" }).end()}
      >
        {txt}
      </Typography>
      <hr className="threeQuartersWidth d-inline-block" />
      <br />
      <br />
    </>
  );
}

function ChipSmall(props) {
  return (
    <Chip
      {...window["props"]["ChipSmall"]}
      sx={{
        ...window["style"]["ChipSmall"],
        ...window["style"]["Chip-right"],
      }}
      {...props}
    />
  );
}

export {
  ImageLocal,
  generate_inputs,
  generate_selects,
  TooltipNoPointerEvents,
  Info,
  BoxForm,
  TitleInfo,
  TooltipIconButton,
  Title,
  ChipSmall,
};
