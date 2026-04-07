import React, {ReactElement} from 'react';
import Modal from "~/ui/components/Dialogs/Modal";

interface IProps {
    title?: string;
    closeText?: string;
    submitText?: string;
    isOpen: boolean;
    onConfirm: () => unknown;
    onCancel: () => unknown;
}

const UnsavedPopup = ({
                               title = "You have unsaved changes. Are you sure you want to leave?",
                               closeText = "Continue editing",
                               submitText = "Don't save",
                             isOpen,
                             onConfirm,
                             onCancel
                           }: IProps): ReactElement => {

    return (
            <Modal 
                title={title}
                isOpen={isOpen} 
                handleClose={onCancel}
                closeText={closeText}
                submitText={submitText}
                handleSubmit={onConfirm}>
            </Modal>
    )
}

export default UnsavedPopup;
