import React, {ReactElement} from 'react';
import styles from './Modal.module.scss';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Icon,
  IconButton
} from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';

interface IProps {
  title: string | any;
  subtitle?: string;
  isOpen: boolean;
  submitText?: string;
  closeText?: string;
  width?: 'xs' | 'xl' | 'sm' | 'md' | 'lg' | false;
  handleSubmit?: () => unknown;
  handleClose: () => unknown;
  children: React.ReactNode;
  header?: React.ReactNode;
  headerActions?: React.ReactNode;
  toolbar?: React.ReactNode;
  footer?: React.ReactNode;
  hideFooter?: boolean;
  fullScreen?: boolean;
}

const Modal = ({
                 title,
                 subtitle,
                 isOpen,
                 submitText,
                 closeText = 'Close',
                 width = 'md',
                 handleSubmit,
                 handleClose,
                 children,
                 header,
                 headerActions,
                 toolbar,
                 footer,
                 hideFooter = false,
                 fullScreen = false
               }: IProps): ReactElement => {
  return (
    <>
      <Dialog
        fullWidth
        fullScreen={fullScreen }
        maxWidth={width}
        open={isOpen}
        onClose={(_, reason) => {
          if (reason !== "backdropClick") {
            handleClose();
          }
        }}
        scroll="body"
        aria-labelledby='max-width-dialog-title'>
        { (!header) ?
          <DialogTitle id='max-width-dialog-title'>
            {title}
            { headerActions ? headerActions : null }
            <IconButton className={styles.close_icon}
                        edge="end"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close">
              <CloseIcon/>
            </IconButton>
          </DialogTitle>
        : null }
        { header ? header : null }
        { toolbar ?
          <div className={styles.toolbar_container}>
            {toolbar}
          </div>
          : null }
        <DialogContent className="full-width">
          {subtitle ? <DialogContentText>{subtitle}</DialogContentText> : null}
          {children}
        </DialogContent>
        {(!hideFooter && !footer) ?
          <DialogActions>
            { handleSubmit ?
              <Button onClick={handleSubmit} color='primary'>
                {submitText}
              </Button>
              : null }
            <Button onClick={handleClose} color='default'>
              {closeText}
            </Button> 
          </DialogActions>
        : null }
        {(footer) ?
          <DialogActions>
            {footer}
          </DialogActions>
          : null }
      </Dialog>
    </>
  )
}

export default Modal;
