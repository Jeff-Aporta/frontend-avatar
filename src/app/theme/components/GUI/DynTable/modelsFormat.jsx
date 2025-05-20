import BenefitUplineIcon from "@mui/icons-material/TrendingUpOutlined";
import BenefitDownlineIcon from "@mui/icons-material/TrendingDownOutlined";
import BenefitConstantlineIcon from "@mui/icons-material/TrendingFlatOutlined";
import { Chip } from "@mui/material";

const currentCoin = currentSufix("name_coin");

function currentSufix(sufix) {
  return {
    fit_content: true,
    renderInfo: {
      local: "es-ES",
      sufix,
      type: "number",
      "number-format": window["format"]["number"]["dynamic"],
    },
  };
}

function iconized_profit(op = false) {
  return (params, renderString) => {
    let { value } = params;
    const { real_roi } = params.row;

    const texto = (() => {
      if (op) {
        return (
          <div className="d-flex jc-space-between ai-center">
            {renderString}
            {real_roi ? (
              <Chip
                label={`${real_roi.toFixed(2)}%`}
                {...window["props"]["ChipSmall"]}
                sx={{
                  ...window["style"]["ChipSmall"],
                  ...window["style"]["Chip-right"],
                }}
              />
            ) : (
              ""
            )}
          </div>
        );
      }
      return renderString;
    })();
    const tooltip = (() => {
      if (op) {
        const percent = real_roi ? `(${real_roi.toFixed(2)}%)` : "";
        return `${renderString} ${percent}`;
      }
      return renderString;
    })();
    const strings = { texto, tooltip };
    if (value == 0) {
      return {
        ...strings,
        icon: <BenefitConstantlineIcon />,
        color: "warning",
      };
    }
    if (value < 0) {
      return {
        ...strings,
        icon: <BenefitDownlineIcon />,
        color: "error",
      };
    }
    if (value > 0) {
      return { ...strings, icon: <BenefitUplineIcon />, color: "ok" };
    }
  };
}

export default {
  profit_op: {
    ...{
      ...currentCoin,
      extra_width: 30,
      renderInfo: {
        ...currentCoin.renderInfo,
        iconized: iconized_profit(true),
      },
    },
  },
  profit: {
    ...{
      ...currentCoin,
      style: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
      renderInfo: {
        ...currentCoin.renderInfo,
        iconized: iconized_profit(),
      },
    },
  },
  label: {
    fit_content: true,
    icon_width: 30,
  },
  datetime: {
    fit_content: true,
    renderInfo: {
      local: "es-ES",
      hide_seconds: true,
      "date-format": {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      },
    },
  },
  numberGeneral: {
    fit_content: true,
    renderInfo: {
      local: "es-ES",
      type: "number",
      "number-format": {
        maximumFractionDigits: 2,
      },
    },
  },
  currentCoin,
  currentSufix,
};
