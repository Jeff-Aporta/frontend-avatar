import fluidCSS from "@jeff-aporta/fluidcss";
import { useLocation } from "react-router-dom";
import {
  FormControl,
  Skeleton,
  useTheme,
  Select,
  MenuItem,
  InputLabel,
  TextField,
  Box,
  IconButton,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import es from "dayjs/locale/es";
import { format } from "date-fns";
import { es as esLocale } from "date-fns/locale";
import { paletteConfig } from "@jeff-aporta/theme-manager";
import React, { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

export { AutoSkeleton, DateRangeControls, UserFilterControl };

function AutoSkeleton({ loading, w = "100%", h = "5vh", ...rest }) {
  if (loading == null || loading == undefined) {
    return <></>;
  }
  return loading ? (
    <Skeleton style={{ height: h, width: `max(100px, ${w})` }} />
  ) : (
    <div {...rest} />
  );
}

function UserFilterControl({
  value = "",
  onChange,
  loading = false,
  placeholder = "Buscar por nombre de usuario",
  label = "Usuario",
  width = 250,
}) {
  const [searchTerm, setSearchTerm] = useState(value);
  const theme = useTheme();
  const palette_config = paletteConfig();

  const handleChange = (event) => {
    const newValue = event.target.value;
    setSearchTerm(newValue);
  };

  const handleSearch = () => {
    if (onChange) {
      onChange(searchTerm);
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    if (onChange) {
      onChange("");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <AutoSkeleton h="10vh" w={`${width}px`} loading={loading}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <TextField
          label={label}
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          sx={{
            width: width,
          }}
        />
        <IconButton onClick={handleSearch} color="primary" sx={{ ml: 1 }}>
          <SearchIcon />
        </IconButton>
        {searchTerm && (
          <IconButton onClick={handleClear} size="small" sx={{ ml: 0.5 }}>
            <ClearIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
    </AutoSkeleton>
  );
}

function DateRangeControls({
  type = "select",
  dateRangeInit,
  dateRangeFin,
  setDateRangeInit,
  setDateRangeFin,
  loading,
  period = "most_recent", // day, week, month
  willPeriodChange = (period) => {},
}) {
  // Inicializar parámetros de URL como driverParams
  const location = useLocation();
  const { driverParams } = global;

  let url_period = driverParams.get("period") || period;
  const url_start_date = driverParams.get("start_date");
  let url_month = driverParams.get("month") || String(dayjs().month());
  let url_week =
    driverParams.get("week") || String(getInitWeek(dayjs().month()));
  // update URL if missing params
  if (
    !location.search.includes("period") ||
    !location.search.includes("month") ||
    !location.search.includes("week")
  ) {
    driverParams.set("period", url_period);
    driverParams.set("month", url_month);
    driverParams.set("week", url_week);
  }

  // Migrar estados a useState para que los selectores sean reactivos
  const [periodValue, setPeriodValue] = useState(url_period);
  const [selectedDate, setSelectedDate] = useState(dateRangeInit);
  const [selectedMonth, setSelectedMonth] = useState(Number(url_month));
  const [selectedWeek, setSelectedWeek] = useState(Number(url_week));

  function getInitWeek(selectedMonth) {
    return selectedMonth == dayjs().month() ? Math.ceil(dayjs().date() / 7) : 1;
  }

  // Configurar dayjs para español
  dayjs.locale(es);

  const handlePeriodChange = (event) => {
    const value = event?.target?.value || periodValue;
    console.log("Period change", value);
    willPeriodChange(value);
    if (value === "most_recent") {
      setPeriodValue(value);
      driverParams.sets({ period: value });
      // no date filters for most_recent
      return;
    }
    setPeriodValue(value);
    const day_value = dayjs(url_start_date);
    setSelectedDate(day_value);
    const day_value_string = day_value.format("YYYY-MM-DD");
    if (value === "day") {
      driverParams.sets({
        start_date: day_value_string,
        end_date: day_value_string,
      });
    }
    const iw = getInitWeek(day_value.month());
    setSelectedWeek(iw);
    let init;
    const end = day_value;
    setDateRangeFin(end);

    switch (value) {
      case "day":
        init = day_value.startOf("day");
        break;
      case "week":
        init = day_value.startOf("week");
        break;
      case "month":
        init = day_value.startOf("month");
        break;
      default:
        init = day_value.startOf("day");
    }
    setDateRangeInit(init);
    driverParams.sets({
      month: String(day_value.month()),
      period: value,
      week: String(iw),
      start_date: init.format("YYYY-MM-DD"),
      end_date: end.format("YYYY-MM-DD"),
    });
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const d = dayjs(date).format("YYYY-MM-DD");
    driverParams.sets({
      start_date: d,
      end_date: d,
    });
    setDateRangeInit(date);
    setDateRangeFin(date);
  };

  // Sync dateRange when date param changes
  useEffect(() => {
    if (periodValue === "day") {
      setDateRangeInit(selectedDate);
      setDateRangeFin(selectedDate);
    }
  }, [selectedDate, periodValue]);

  const getWeekRange = (month, week) => {
    const daysInMonth = dayjs().month(month).daysInMonth();

    switch (week) {
      case 1:
        return { start: 1, end: 7 };
      case 2:
        return { start: 8, end: 14 };
      case 3:
        return { start: 15, end: 21 };
      case 4:
        return { start: 22, end: daysInMonth };
      default:
        return { start: 1, end: 7 };
    }
  };

  const handleWeekChange = (week) => {
    setSelectedWeek(week);
    const { start, end } = getWeekRange(selectedMonth, week);
    const date = dayjs().month(selectedMonth).date(start);

    // Verificar si el rango está en el futuro
    const today = dayjs();
    let startDate, endDate;
    if (date.isAfter(today)) {
      // Si el inicio está en el futuro, usar la fecha actual
      setDateRangeInit(today);
      setDateRangeFin(today);
      startDate = today;
      endDate = today;
    } else {
      // Si está en el pasado o presente, usar el rango normal
      setDateRangeInit(date);
      setDateRangeFin(date.date(end));
      startDate = date;
      endDate = date.date(end);
    }
    driverParams.sets({
      week: String(week),
      month: String(selectedMonth),
      start_date: startDate.format("YYYY-MM-DD"),
      end_date: endDate.format("YYYY-MM-DD"),
    });
    // Actualizar el estado inicial al intervalo actual
    const currentWeek = Math.ceil(today.date() / 7);
    setSelectedWeek(currentWeek);
  };

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    const iw2 = getInitWeek(month);
    setSelectedWeek(iw2);
    const date = dayjs().month(month);
    const start = date.startOf("month");
    const end = date.endOf("month");
    setDateRangeInit(start);
    setDateRangeFin(end);
    driverParams.sets({
      month: String(month),
      week: String(iw2),
      start_date: start.format("YYYY-MM-DD"),
      end_date: end.format("YYYY-MM-DD"),
    });
  };
  // Ejecutar handlePeriodChange al montar el componente
  useEffect(() => {
    // Solo inicializa si las fechas no están definidas
    if (!dateRangeInit || !dateRangeFin) {
      const now = dayjs();
      setDateRangeFin(now);
      setDateRangeInit(now.startOf("day"));
      handlePeriodChange();
    }
  }, []);

  // Si el tipo es "none", no mostrar ningún control
  if (type === "none") {
    return null;
  }

  // Si el tipo es "custom", mostrar los selectores de fecha personalizados
  if (type === "custom") {
    return (
      <div className="d-flex ai-stretch flex-wrap gap-20px">
        <div className={fluidCSS().ltX(700, { width: "100%" }).end()}>
          <AutoSkeleton h="10vh" w="250px" loading={loading}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                className="fullWidth"
                label="Fecha inicio"
                value={dateRangeInit}
                onChange={(date) => setDateRangeInit(date)}
                slotProps={{ textField: { size: "small" } }}
              />
            </LocalizationProvider>
          </AutoSkeleton>
        </div>
        <div className={fluidCSS().ltX(700, { width: "100%" }).end()}>
          <AutoSkeleton h="10vh" w="250px" loading={loading}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                className="fullWidth"
                label="Fecha Fin"
                value={dateRangeFin}
                onChange={(date) => setDateRangeFin(date)}
                slotProps={{ textField: { size: "small" } }}
              />
            </LocalizationProvider>
          </AutoSkeleton>
        </div>
      </div>
    );
  }

  // Implementación con Select (opción por defecto)
  const palette_config = paletteConfig();
  return (
    <div className="d-flex ai-stretch flex-wrap gap-20px">
      <AutoSkeleton h="10vh" w="150px" loading={loading}>
        <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="period-select-label">Período</InputLabel>
          <Select
            labelId="period-select-label"
            id="period-select"
            value={periodValue}
            onChange={handlePeriodChange}
            label="Período"
            MenuProps={{
              disableScrollLock: true, // Evita que se bloquee el scroll
            }}
          >
            <MenuItem value="most_recent">Más recientes</MenuItem>
            <MenuItem value="day">1 día</MenuItem>
            <MenuItem value="week">1 semana</MenuItem>
            <MenuItem value="month">1 mes</MenuItem>
          </Select>
        </FormControl>
      </AutoSkeleton>

      {periodValue === "day" && (
        <AutoSkeleton h="10vh" w="200px" loading={loading}>
          <div style={{ width: "200px", display: "inline-block" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                className="fullWidth"
                label="Seleccionar día"
                value={selectedDate}
                onChange={handleDateChange}
                views={["year", "month", "day"]}
                slotProps={{
                  textField: {
                    size: "small",
                    variant: "outlined",
                  },
                }}
                maxDate={dayjs()}
              />
            </LocalizationProvider>
          </div>
        </AutoSkeleton>
      )}

      {periodValue === "week" && (
        <div
          className={`d-flex ai-center flex-wrap gap-10px ${fluidCSS()
            .ltX(700, { width: "100%" })
            .end()}`}
        >
          <AutoSkeleton h="10vh" w="150px" loading={loading}>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="month-select-label">Mes</InputLabel>
              <Select
                labelId="month-select-label"
                id="month-select"
                value={selectedMonth}
                onChange={(e) => handleMonthChange(Number(e.target.value))}
                label="Mes"
                MenuProps={{
                  disableScrollLock: true, // Evita que se bloquee el scroll
                }}
              >
                {Array.from({ length: 12 }, (_, i) => {
                  const date = dayjs().subtract(i, "month");
                  return (
                    <MenuItem key={date.format("YYYY-MM")} value={date.month()}>
                      {format(new Date(date), "MMMM yyyy", {
                        locale: esLocale,
                      })}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </AutoSkeleton>
          <AutoSkeleton h="10vh" w="150px" loading={loading}>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="week-select-label">Semana</InputLabel>
              <Select
                labelId="week-select-label"
                id="week-select"
                value={selectedWeek}
                onChange={(e) => handleWeekChange(Number(e.target.value))}
                label="Semana"
                MenuProps={{
                  disableScrollLock: true, // Evita que se bloquee el scroll
                }}
              >
                {Array.from({ length: 4 }, (_, i) => {
                  const { start, end } = getWeekRange(selectedMonth, i + 1);
                  const date = dayjs().month(selectedMonth).date(start);

                  // Solo mostrar intervalos que no estén en el futuro
                  if (date.isAfter(dayjs())) {
                    return null;
                  }

                  return (
                    <MenuItem key={i + 1} value={i + 1}>
                      {start === end
                        ? `del ${start}`
                        : `del ${start} al ${end}`}
                    </MenuItem>
                  );
                }).filter(Boolean)}
              </Select>
            </FormControl>
          </AutoSkeleton>
        </div>
      )}

      {periodValue === "month" && (
        <div className={fluidCSS().ltX(700, { width: "100%" }).end()}>
          <AutoSkeleton h="10vh" w="250px" loading={loading}>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
              <InputLabel id="month-select-label">Mes</InputLabel>
              <Select
                labelId="month-select-label"
                id="month-select"
                value={selectedMonth}
                onChange={(e) => handleMonthChange(Number(e.target.value))}
                label="Mes"
                MenuProps={{
                  disableScrollLock: true, // Evita que se bloquee el scroll
                }}
              >
                {Array.from({ length: 12 }, (_, i) => {
                  const date = dayjs().subtract(i, "month");
                  return (
                    <MenuItem key={date.format("YYYY-MM")} value={date.month()}>
                      {format(new Date(date), "MMMM yyyy", {
                        locale: esLocale,
                      })}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </AutoSkeleton>
        </div>
      )}
    </div>
  );
}
