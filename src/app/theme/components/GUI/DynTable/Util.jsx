function genAllColumns(content) {
  return Object.keys(
    content.reduce((acc, value) => {
      Object.assign(acc, value);
      return acc;
    }, {})
  ).map((k) => ({
    field: k,
    headerName: k,
    description: "",
  }));
}

function exclude(columns) {
  return columns.filter((x) => x.exclude != true);
}

export { genAllColumns, exclude };
