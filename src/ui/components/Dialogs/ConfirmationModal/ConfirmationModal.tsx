import React, {ReactElement} from 'react';
import styles from './ConfirmationModal.module.scss';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Icon,
    IconButton,
    Typography
} from "@material-ui/core";

interface IProps {
    title?: string;
    content?: string;
    confirmText?: string;
    cancelText?: string;
    isOpen: boolean;
    onConfirm: () => unknown;
    onCancel: () => unknown;
}

const ConfirmationModal = ({
                               title = 'Confirm',
                               content = 'Are you sure you want to delete this item?',
                               confirmText = 'Confirm',
                               cancelText = 'Cancel',
                               isOpen,
                               onConfirm,
                               onCancel
                           }: IProps): ReactElement => {

    return (
        <>
            <Dialog
                fullWidth
                maxWidth="sm"
                open={isOpen}
                onClose={onCancel}
                scroll="body"
                aria-labelledby='max-width-dialog-title'>
                <DialogTitle id='max-width-dialog-title'>
                    {title}
                    <IconButton className={styles.close_icon}
                                edge="end"
                                color="inherit"
                                onClick={onCancel}
                                aria-label="close">
                        <Icon>close</Icon>
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Typography>
                        {content}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        onConfirm();
                        onCancel();
                    }} color='primary'>
                        {confirmText}
                    </Button>
                    <Button onClick={onCancel} color='default'>
                        {cancelText}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default ConfirmationModal;
