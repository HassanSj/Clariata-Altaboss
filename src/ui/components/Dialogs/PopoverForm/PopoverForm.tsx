import React from 'react';
import {Avatar, Badge, Box, Button, Chip, DialogActions, DialogTitle, Icon, Popover, Tooltip} from "@material-ui/core";
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import IconButton from "@material-ui/core/IconButton";
import classnames from "classnames";
import styles from './PopoverForm.module.scss';
import {getPhotoSrc} from "~/ui/constants/user";
import {Photo} from "~/types/api/photo";
import {IFormInputValue} from "~/types/forms";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    typography: {
      padding: theme.spacing(2),
    },
  }),
);

interface IProps {
  fields?: IFormInputValue[];
  title?: string;
  caption?: string;
  headerActions?: any;
  classes?: any;
  icon: string;
  photo?: Photo;
  badge?: string | number
  tooltip: string;
  triggerLabel?: string;
  triggerType?: 'iconbutton' | 'add_chip' | 'chip' | 'component';
  triggerVariant?: 'default' | 'outlined';
  triggerColor?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  triggerSize?: 'small' | 'medium' | 'large';
  children?: any;
  onUpdate?: any;
  onOpen?: any;
  onClose?: any;
  component?: any;
}

const PopoverForm = ({
                       fields,
                       title,
                       headerActions,
                       classes,
                       icon,
                       photo,
                       badge,
                       tooltip,
                       component,
                       children,
                       onUpdate,
                       onOpen,
                       onClose,
                       triggerLabel = 'No label',
                       triggerVariant = 'default',
                       triggerType = 'iconbutton',
                       triggerSize = 'medium'
                     }: IProps) => {
  const styleClasses = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleUpdate = () => {
    if (onUpdate) {
      onUpdate();
    }
    handleClose();
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (onOpen && !anchorEl) onOpen();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    if (onClose) onClose();
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      {(triggerType === 'iconbutton') ?
        <Tooltip title={tooltip}>
          <IconButton onClick={handleClick}>
            <Badge badgeContent={badge} color="secondary">
              <Icon>{icon}</Icon>
            </Badge>
          </IconButton>
        </Tooltip>
        : null}
      {(triggerType === 'chip') ?
        <Tooltip title={tooltip}>
          <Chip avatar={photo ? <Avatar src={getPhotoSrc(photo)}/> : undefined}
                label={triggerLabel}
                variant={triggerVariant}
                deleteIcon={<Icon>{icon}</Icon>}
                onDelete={handleClick}
                className={classnames(classes)}
          />
        </Tooltip>
        : null}
      {(triggerType === 'component') ?
        <Tooltip title={tooltip}>
              <span onClick={handleClick} className={styles.custom_trigger}>
                {component}
              </span>
        </Tooltip>
        : null}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}>
        <DialogTitle className={styles.popover_header}>
          <span className={styles.popover_header_title}>{title}</span>
          {headerActions ? headerActions : null}
          <IconButton className={styles.close_icon}
                      edge="end"
                      color="inherit"
                      onClick={handleClose}
                      aria-label="close">
            <Icon>close</Icon>
          </IconButton>
        </DialogTitle>
        <Box className={styles.popover_content}>
          {children}
        </Box>
        <DialogActions>
          <Button onClick={handleUpdate} color='default'>
            Save
          </Button>
          <Button onClick={handleClose} color='default'>
            Close
          </Button>
        </DialogActions>
      </Popover>
    </>
  )
}

export default PopoverForm;
