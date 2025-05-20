import { PaletteBaseMonochrome } from "@jeff-aporta/theme-manager";
import { Checkbox, Input } from "@mui/material";
import { hrefManagement } from "@app/hrefManagement";

const {
  verde_cielo,
  verde_lima,
  morado_enfasis,
  morado_brillante,
  verde_lima_brillante,
  verde_cielo_brillante,
  springgreen,
  negro,
  blanco,
  blacktheme,
} = global.identity.colors;

class Fyxbase extends PaletteBaseMonochrome {
  constructor(props) {
    super(props);
  }
  control_components(darkmode) {
    const _THIS_ = this;
    const enfasis_input = [this.name_color, this.name_contrast][+darkmode];
    const themeComponents = super.control_components(darkmode);
    const themeHref = themeComponents.href;
    return {
      ...themeComponents,
      href: (props) => themeHref(hrefManagement(props)),
      enfasis_input,
      themized: {
        Checkbox(props) {
          return <Checkbox color={enfasis_input} {...props} />;
        },
        Input(props) {
          return <Input color={enfasis_input} {...props} />;
        },
      },
    };
  }
}

class Main extends Fyxbase {
  constructor(props) {
    super({
      isMain: true,
      main_color: morado_enfasis,
      name_color: "morado_enfasis",
      scrollname: "morado",
      constrast_color: verde_lima,
      name_contrast: "verde_lima",
      main_bright_color: morado_brillante,
      name_bright_color: "morado_brillante",
      ...props,
    });
  }
}

class Lemongreen extends Fyxbase {
  constructor(props) {
    super({
      main_color: verde_lima,
      name_color: "verde_lima",
      constrast_color: morado_brillante,
      name_contrast: "morado_brillante",
      main_bright_color: verde_lima_brillante,
      name_bright_color: "verde_lima_brillante",
      ...props,
    });
  }
}

class Skygreen extends Fyxbase {
  constructor(props) {
    super({
      main_color: verde_cielo,
      name_color: "verde_cielo",
      constrast_color: verde_lima,
      name_contrast: "verde_lima",
      main_bright_color: verde_cielo_brillante,
      name_bright_color: "verde_cielo_brillante",
      ...props,
    });
  }
}

class Springgreen extends Fyxbase {
  constructor(props) {
    super({
      main_color: springgreen,
      name_color: "springgreen",
      constrast_color: morado_enfasis,
      name_contrast: "morado_enfasis",
      main_bright_color: springgreen,
      name_bright_color: "springgreen",
      ...props,
    });
  }
}

class BlackNWhite extends Fyxbase {
  constructor(props) {
    super({
      main_color: blacktheme,
      name_color: "blacktheme",
      scrollname: "gray",
      constrast_color: verde_cielo,
      name_contrast: "verde_cielo",
      main_bright_color: blanco,
      name_bright_color: "blanco",
      ...props,
    });
  }
}

export { Main, Lemongreen, Skygreen, Springgreen, BlackNWhite };
