import {} from "@identity/colors";
import {Main, Skygreen, Lemongreen, Springgreen, BlackNWhite} from "@identity/palettes";
import scrollbar from "@identity/scrollsbar";

import { packLoadPalette, load_scrollbar, init } from "@jeff-aporta/theme-manager";

const main = new Main(packLoadPalette);
packLoadPalette.color_register["main"] = main;

const skygreen = new Skygreen(packLoadPalette);
packLoadPalette.color_register["skygreen"] = skygreen;

const lemongreen = new Lemongreen(packLoadPalette);
packLoadPalette.color_register["lemongreen"] = lemongreen;

const springgreen = new Springgreen(packLoadPalette);
packLoadPalette.color_register["springgreen"] = springgreen;

const blacknwhite = new BlackNWhite(packLoadPalette);
packLoadPalette.color_register["blacknwhite"] = blacknwhite;


load_scrollbar(scrollbar);

init()

export default {status:"runned"};
