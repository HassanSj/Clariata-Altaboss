import React from "react";
import {makeStyles, Popover} from "@material-ui/core";

interface IProps {
  value: string | undefined;
  maxLength: number;
  wrap?: "normal" | "nowrap";
}

const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing(1),
    width: 350
  },
}));

const StringValue = ({ value, maxLength, wrap }: IProps) => {
  const classes = useStyles();
  const hasPopover = value ? (value.length > maxLength) : false;
  const trimmedValue = value ? ((value.length > maxLength) ? value.substr(0, maxLength-1) + '…' : value) : '';

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!hasPopover) return;
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    if (!hasPopover) return;
    setAnchorEl(null);
  };

  return (
    <>
      <span aria-owns={open ? 'mouse-over-popover' : undefined}
           aria-haspopup="true"
           onMouseEnter={handleOpen}
           onMouseLeave={handleClose} style={{whiteSpace: wrap}}>
        {trimmedValue}
      </span>
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        disableRestoreFocus>
        {value}
      </Popover>
    </>
  )
}

export default StringValue;