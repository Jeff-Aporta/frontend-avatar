const { override, addWebpackAlias } = require("customize-cra");
const path = require("path");

module.exports = override(
  addWebpackAlias({
    "@root": path.resolve(__dirname),
    "@src": path.resolve(__dirname, "src"),
    "@app": path.resolve(__dirname, "src/app"),
    "@api": path.resolve(__dirname, "src/api"),
    "@views": path.resolve(__dirname, "src/views"),
    "@tables": path.resolve(__dirname, "src/tables"),
    "@test": path.resolve(__dirname, "src/tables/test"),
    "@theme": path.resolve(__dirname, "src/app/theme"),
    "@identity": path.resolve(__dirname, "src/app/theme/identity"),
    "@components": path.resolve(__dirname, "src/app/theme/components"),
    "@GUI": path.resolve(__dirname, "src/app/theme/components/GUI"),
    "@containers": path.resolve(__dirname, "src/app/theme/components/containers.jsx"),
    "@templates": path.resolve(__dirname, "src/app/theme/components/templates/templates.jsx"),
    "@recurrent": path.resolve(__dirname, "src/app/theme/components/templates/recurrent.jsx"),
  }),
  (config) => {
    config.resolve.extensions = config.resolve.extensions.concat(['.js', '.jsx', '.mjs']);
    return config;
  }
);
