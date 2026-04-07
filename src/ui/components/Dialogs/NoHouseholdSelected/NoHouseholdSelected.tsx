
import React, {ReactElement} from 'react';
import EmptyContainer from '../../Containers/EmptyContainer';
import Modal from '../Modal';

interface IProps {
  open: boolean;
  handleClose: any;
}

const NoHouseholdSelected = ({open, handleClose}: IProps) => {

    return (
      <Modal title={'No HouseHold Selected'} isOpen={open} handleClose={handleClose} width="md" hideFooter={true}>
              <p>Please Select Household from the List</p>
            </Modal>
    )
}

export default NoHouseholdSelected;