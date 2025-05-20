const localeTextES = {
  // Textos generales
  noRowsLabel: "Sin filas",
  noResultsOverlayLabel: "No se encontraron resultados",
  errorOverlayDefaultLabel: "Ha ocurrido un error.",

  // Barra de herramientas (Toolbar)
  toolbarDensity: "Densidad",
  toolbarDensityLabel: "Densidad",
  toolbarDensityCompact: "Compacto",
  toolbarDensityStandard: "Estándar",
  toolbarDensityComfortable: "Cómodo",

  toolbarColumns: "Columnas",
  toolbarColumnsLabel: "Seleccionar columnas",

  toolbarFilters: "Filtros",
  toolbarFiltersLabel: "Mostrar filtros",
  toolbarFiltersTooltipHide: "Ocultar filtros",
  toolbarFiltersTooltipShow: "Mostrar filtros",
  toolbarFiltersTooltipActive: (count) =>
    count > 1 ? `${count} filtros activos` : `${count} filtro activo`,

  toolbarExport: "Exportar",
  toolbarExportLabel: "Exportar",
  toolbarExportCSV: "Descargar como CSV",
  toolbarExportPrint: "Imprimir",

  // Panel de columnas
  columnsPanelTextFieldLabel: "Buscar columna",
  columnsPanelTextFieldPlaceholder: "Título de columna",
  columnsPanelDragIconLabel: "Reordenar columna",
  columnsPanelShowAllButton: "Mostrar todo",
  columnsPanelHideAllButton: "Ocultar todo",

  // Panel de filtros
  filterPanelAddFilter: "Agregar filtro",
  filterPanelDeleteIconLabel: "Eliminar",
  filterPanelOperators: "Operadores",
  filterPanelOperatorAnd: "Y",
  filterPanelOperatorOr: "O",
  filterPanelColumns: "Columna",
  filterPanelInputLabel: "Valor",
  filterPanelInputPlaceholder: "Filtrar valor",

  // Menú de columnas
  columnMenuLabel: "Menú",
  columnMenuShowColumns: "Mostrar columnas",
  columnMenuFilter: "Filtrar",
  columnMenuHideColumn: "Ocultar",
  columnMenuUnsort: "Desordenar",
  columnMenuSortAsc: "Orden ascendente",
  columnMenuSortDesc: "Orden descendente",

  // Paginación del Footer
  footerPaginationRowsPerPage: "Filas por página:",
  footerPaginationLabelRowsPerPage: "Filas por página:",
  footerPaginationDisplayedRows: ({ from, to, count }) =>
    `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`,
  footerPaginationNext: "Siguiente página",
  footerPaginationPrevious: "Página anterior",
  footerPaginationFirst: "Primera página",
  footerPaginationLast: "Última página",

  // Ordenamiento y celdas
  sortLabel: "Ordenar",
  booleanCellTrueLabel: "sí",
  booleanCellFalseLabel: "no",
  actionsCellMore: "más",

  // Encabezados de columna
  columnHeaderFiltersTooltipActive: (count) =>
    count > 1 ? `${count} filtros activos` : `${count} filtro activo`,
  columnHeaderFiltersLabel: "Mostrar filtros",
  columnHeaderSortIconLabel: "Ordenar",
};


export default localeTextES;
