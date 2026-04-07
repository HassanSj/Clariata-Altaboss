import Modal from "~/ui/components/Dialogs/Modal";
import React from "react";

interface IProps {
  isOpen: boolean;
  onClose: () => unknown;
}

const DirectionStrategySummary = ({ isOpen, onClose }: IProps) => {

  return (
    <>
      <Modal title={`Strategy Summary`}
             isOpen={isOpen}
             handleClose={onClose}
             width="sm"
             hideFooter={true}>
        Strategy Summary
      </Modal>
    </>
  )
}

export default DirectionStrategySummary;
