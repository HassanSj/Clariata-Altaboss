import React, {ReactElement} from 'react';
import Modal from "~/ui/components/Dialogs/Modal";
import {createEditHeaderText} from "~/ui/constants/utils";
import {Objective} from "~/types/api/objective";
import EditPriorityFormContent from '../EditPriorityFormContent';

interface IProps {
  item?: Objective;
  isOpen: boolean;
  onClose: () => unknown;
  showSelectionBar?: boolean;
}

const EditPriorityFormModal = ({item, isOpen, onClose}: IProps): ReactElement => {

  return (
    <>
      <Modal title={`${createEditHeaderText(item)} Priority`}
             isOpen={isOpen}
             handleClose={onClose}
             width="lg"
             hideFooter={true}>
        {item? 
        <EditPriorityFormContent item={item} onClose={onClose}/> 
        : <EditPriorityFormContent onClose={onClose}/>  }

      </Modal>
      
    </>
  );
};

export default EditPriorityFormModal;
