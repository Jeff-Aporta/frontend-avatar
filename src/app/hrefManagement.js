function hrefManagement(props) {
  if (typeof props == "string") {
    props = { view: props };
  }
  // Asegurar que params existe para evitar undefined
  props.params ??= {};
  props = decorators(props);
  props = autoParams(props);
  return props;
}

function autoParams(props) {
  if (props["view"] == "/users/wallet") {
    props["params"]["action-id"] ??= "investment";
  }
  return props;
}

function decorators(props) {
  const mapping = { "@wallet": "/users/wallet" };
  if (mapping[props.view]) {
    props.view = mapping[props.view];
  }
  return props;
}

Object.assign(window, { hrefManagement });