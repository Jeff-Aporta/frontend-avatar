import { useState, useEffect } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import { Chip, Tooltip, Typography } from "@mui/material";

export function DialogSimple({
  children,
  text,
  title_text,
  button_text,
  variant,
  className,
  ...rest
}) {
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

  return (
    <>
      <VisiblePart
        {...rest}
        className={className}
        handleClickOpen={handleClickOpen}
        children={children}
      />

      <HiddenPart
        open={open}
        handleClose={handleClose}
        title_text={title_text}
        variant={variant}
        text={text}
        button_text={button_text}
      />
    </>
  );
}

function VisiblePart({ className, handleClickOpen, children, ...rest }) {
  return (
    <div
      {...rest}
      className={`d-inline-block ${className ?? ""}`}
      onClick={handleClickOpen}
    >
      {children}
    </div>
  );
}

function HiddenPart({
  open,
  handleClose,
  title_text,
  variant,
  text,
  button_text,
}) {
  return (
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
  );
}
