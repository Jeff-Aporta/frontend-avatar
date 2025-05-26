import React, { Component } from "react";

// mui
import { DataGrid } from "@mui/x-data-grid";
import { Chip, Paper, Tooltip } from "@mui/material";

// mylibs
import "./DynTable.css";

import {
  getThemeLuminance,
  getThemeName,
  isDark,
  JS2CSS,
} from "@jeff-aporta/theme-manager";

import localeTextES from "./localeTextES";
import { genAllColumns, exclude } from "./Util";
import { rendersTemplate } from "./rendersTemplate";

class DynTable extends Component {
  constructor(props) {
    super(props);
    this.state = { windowWidth: window.innerWidth };
    this.apiRef = React.createRef();
    this.refDataGrid = React.createRef();
    this.rsz = this.rsz.bind(this);
  }

  componentDidMount() {
    this.rsz();
    window.addEventListener("resize", this.rsz);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.rsz);
  }

  rsz() {
    // Copiar columnas de props a variable mutable
    let columns = this.props.columns;
    let width = (0.96 * window.innerWidth - 120) / columns.length;
    width = Math.min(width, 150)
    columns = columns.map((c) => {
      const {
        headerName,
        fit_content,
        renderString,
        renderInfo,
        extra_width = 0,
      } = c;
      let { iconized, label } = renderInfo || {};
      const render = Boolean(iconized ?? label);
      c.minWidth = str2width(headerName) + 50;
      c.width = Math.max(width, c.minWidth);
      if ((fit_content && renderString) || render) {
        c.width = Math.max(
          c.width,
          ...this.props.rows.map((r) => Row2width(r))
        );
      }
      return c;

      function Row2width(row) {
        const value = row[c.field];
        let texto = value;
        if (!renderString) {
          if (iconized) {
            ({ texto } = iconized({ value, row }, value));
          }
        } else {
          ({ texto } = renderString({ value, row }));
        }
        return str2width(texto) + 20 + 60 * render + extra_width;
      }

      function str2width(str) {
        return str.length * (14 * 0.55);
      }
    });
    this.setState({ windowWidth: window.innerWidth });
  }

  render() {
    const { ...restProps } = this.props;
    // Variables locales
    let columns = exclude(this.props.columns).filter(
      (c) => c.inTable !== false
    );
    let rows = this.props.rows.map((row, i) => ({ id: i, ...row }));
    let paginationModel = this.props.paginationModel ?? {
      page: 0,
      pageSize: 20,
    };

    rendersTemplate(columns);

    return (
      <Paper
        elevation={(() => {
          if (getThemeLuminance() == "dark") {
            if (getThemeName() != "blackNwhite") {
              return 0;
            }
          }
        })()}
      >
        <div
          className="DynTable-container"
          style={{
            height: "auto",
            width: "100%",
            background: `rgba(0,0,0,${isDark() ? 0.1 : 0.025})`,
          }}
        >
          <DataGrid
            density="standard"
            disableRowSelectionOnClick
            {...restProps}
            ref={this.refDataGrid}
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel,
              },
            }}
            pageSizeOptions={[20, 50, 100]}
            autoHeight
            disableExtendRowFullWidth={false}
            localeText={localeTextES}
          />
        </div>
      </Paper>
    );
  }
}

// re-export utilidades para compatibilidad de imports
export { DynTable, genAllColumns, rendersTemplate, exclude };
