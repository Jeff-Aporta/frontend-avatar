import { useState, useEffect } from "react";
import { Notifier, href } from "@jeff-aporta/camaleon";
import { PaperP } from "@jeff-aporta/camaleon";
import {
  Button,
  CircularProgress,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";

export function Unauthorize({ message }) {
  return (
    <Notifier>
      <CountdownRedirect message={message} />
    </Notifier>
  );
}

function CountdownRedirect({ message }) {
  const [counter, setCounter] = useState(10);

  useEffect(() => {
    if (counter > 0) {
      const timer = setTimeout(() => setCounter((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
    window.location.href = href({ view: "/" });
  }, [counter]);

  return (
    <>
      <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
        {message}. Será redirigido en {counter} segundos.
      </Alert>
      <PaperP
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "inline-flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgressWithLabel
          value={counter}
          maxvalue={10}
          label={counter.toString().padStart(2, "0") + "s"}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<HomeIcon />}
          onClick={() => (window.location.href = href({ view: "/" }))}
        >
          Ir al inicio
        </Button>
      </PaperP>
    </>
  );
}

function CircularProgressWithLabel(props) {
  return (
    <Box
      sx={{
        position: "relative",
      }}
    >
      <CircularProgress
        size="100px"
        variant="determinate"
        {...{
          ...props,
          value: (props.value / props.maxvalue) * 100,
        }}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          sx={{ color: "text.secondary" }}
        >
          {props.label}
        </Typography>
      </Box>
    </Box>
  );
}
