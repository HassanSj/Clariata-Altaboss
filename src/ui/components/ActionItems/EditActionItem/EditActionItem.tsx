import React, {ReactElement} from 'react';
import Modal from "~/ui/components/Dialogs/Modal";
import api from "~/services/api";
import { createEditHeaderText, logSimple} from "~/ui/constants/utils";
import {ActionItem} from "~/types/api/actionItem";
import {IObjectiveDataType} from "~/types/objective/store";
import {Objective} from "~/types/api/objective";
import {prepareActionItemForCreateUpdate} from "~/ui/components/ActionItems/EditActionItemSimple/EditActionItemSimple";
import EditActionItemSimple from "~/ui/components/ActionItems/EditActionItemSimple";


interface IProps {
    objective?: Objective;
    parent?: ActionItem;
    item?: ActionItem;
    isOpen: boolean;
    onClose: () => unknown;
    onDelete?: () => unknown;
}

export const createOrUpdateDirect = async (values: ActionItem, householdId: number, dreamInterviewId: number, notifications: any, onRefresh: any, onClose?: any, needsPreparing = true, showMessage = true) => {
    if(showMessage)
        notifications.toggleLoading(true);
    try {
        if (needsPreparing) values = prepareActionItemForCreateUpdate(values)

        const res = await (!values?.ActionItemID ?
            api.actionitem.create(householdId, values.ObjectiveID, values) :
            api.actionitem.update(householdId, values.ObjectiveID, values?.ActionItemID, values));

        const updated = await api.actionitem.getFull(householdId, values.ObjectiveID, dreamInterviewId, res?.data?.ActionItemID!);
        const updatedParent = (res?.data?.ParentActionItemID)
            ? await api.actionitem.getFull(householdId, values.ObjectiveID, dreamInterviewId, res?.data?.ParentActionItemID)
            : undefined
        const payload = {
            type: IObjectiveDataType.ACTION_ITEM,
            actionItem: {
                ...updated,
                ParentActionItem: updatedParent
            },
            actionItemId: updated?.ActionItemID
        };

        await onRefresh(payload);
        if (onClose) onClose();
        if(showMessage)
            notifications.addSuccessNotification('Task successfully saved!');
    } catch (err) {
        logSimple('createOrUpdateDirect', err);
        notifications.addErrorNotification('An error occurred while updating the task.')
    }
    if(showMessage)
        notifications.toggleLoading(false);
}

const EditActionItem = ({ item, isOpen, onClose, onDelete, objective}: IProps): ReactElement => {
    return (
        <>
            <Modal title={`${createEditHeaderText(item?.ActionItemID)} Action Step`}
                   isOpen={isOpen}
                   handleClose={onClose}
                   width="lg"
                   hideFooter={true}>
                <EditActionItemSimple onClose={onClose} item={item} onDelete={onDelete} objective={objective}/>
            </Modal>
        </>
    );
};

export default EditActionItem;
