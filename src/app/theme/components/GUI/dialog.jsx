import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";

import { Theme } from "@jeff-aporta/theme-manager";

import { useState, useEffect } from "react";
import { Chip, Tooltip, Typography } from "@mui/material";

export default FyxDialog;

function FyxDialog(props) {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Hide background content from AT when dialog is open
  useEffect(() => {
    const root = document.getElementById("root");
    if (open) {
      root.setAttribute("aria-hidden", "true");
    } else {
      root.removeAttribute("aria-hidden");
    }
    return () => root.removeAttribute("aria-hidden");
  }, [open]);

  const { children, text, title_text, button_text, placement, variant } = props;

  return (
    <>
      {/* Inert children container when dialog is open */}
      <div
        {...props}
        className={`d-inline-block ${props.className ?? ""}`}
        onClick={handleClickOpen}
      >
        {children}
      </div>
      {/* Render Dialog using portal; siblings (root) will be aria-hidden by MUI */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <Chip label={title_text} />
        </DialogTitle>
        <DialogContent>
          {variant === "div" ? (
            <div>{text}</div>
          ) : (
            <Typography variant="body1">{text}</Typography>
          )}
        </DialogContent>
        <DialogActions className="mt-20px">
          <Button variant="contained" onClick={handleClose}>
            {button_text ?? "Entendido"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
