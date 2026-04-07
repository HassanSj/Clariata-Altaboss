import React, {ReactElement} from "react";
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
import styles from "~/ui/components/Dialogs/ConfirmationModal/ConfirmationModal.module.scss";

interface IProps {
    onCancel: ()=>unknown,
    onConfirmOne: ()=>unknown,
    onConfirmAll: ()=>unknown,
    isOpen: boolean
}

const RecurringActionItemDeleteConfirmationModal = ({onConfirmAll, onConfirmOne, onCancel, isOpen}:IProps): ReactElement => {
    return (
        <>
            <Dialog
                open={isOpen}
                onClose={onCancel}
                scroll="body"
                fullWidth
                maxWidth="sm">
                <DialogTitle>
                    This item belongs to a series of Action Steps
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
                        Do you want to delete all of them or only this one?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {onConfirmAll();onCancel();}} color='primary'>
                        All
                    </Button>
                    <Button onClick={() => {onConfirmOne();onCancel();}} color='primary'>
                        Only One
                    </Button>
                    <Button onClick={onCancel} color='default'>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default RecurringActionItemDeleteConfirmationModal