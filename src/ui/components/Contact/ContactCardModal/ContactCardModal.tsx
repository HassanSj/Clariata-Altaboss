import React, {ReactElement} from 'react';
import Modal from "~/ui/components/Dialogs/Modal";
import {Person} from "~/types/api/person";
import ContactCard from "~/ui/components/Contact/ContactCard";
import {OwnerType} from "~/ui/constants/api";
import {DialogActions} from "@material-ui/core";
import Button from "~/ui/components/Button";

interface IProps {
  person?: Person;
  ownerType?: OwnerType;
  isOpen: boolean;
  onClose: () => unknown;
  markIsDirty: () => void;
  exit: () => void;
}

const ContactCardModal = ({ person, ownerType, isOpen, onClose, markIsDirty, exit }: IProps): ReactElement => {

  const closeEdit = () => {
    console.log('Close')
  }

  const showEdit = () => {
    console.log('Show')
  }

  const setIsDirty = () => {
    markIsDirty();
}

  return (
    <>
      <Modal title={`${person?.FirstName} ${person?.LastName}`} isOpen={isOpen} handleClose={onClose} width="lg" hideFooter={true}>
        <ContactCard ownerType={ownerType} person={person} isModal={true} closeEdit={closeEdit} showEdit={showEdit}  markIsDirty={() => setIsDirty()} exit={exit}/>
        <DialogActions>
          <Button
            type="button"
            text={`Close`}
            variant="contained"
            size="large"
            color="default"
            onClick={onClose}
          />
        </DialogActions>
      </Modal>
    </>
  );
};

export default ContactCardModal;
