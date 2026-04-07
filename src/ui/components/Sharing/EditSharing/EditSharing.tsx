import React, {ReactElement, useState} from 'react';
import {DialogActions, Grid} from "@material-ui/core";
import {ApiRequestType, OwnerModelType, OwnerType} from "~/ui/constants/api";
import {SharedItem} from "~/types/api/sharedItem";
import Modal from "~/ui/components/Dialogs/Modal";
import {createEditHeaderSubmitText, createEditHeaderText, createEditMessageText} from "~/ui/constants/utils";
import FormWrapper from "~/ui/components/Forms/FormWrapper";
import InputField from "~/ui/components/Forms/InputField";
import Input from "~/ui/components/Forms/Input";
import Button from "~/ui/components/Button";
import useNotifications from "~/ui/hooks/useNotifications";
import {useStoreActions, useStoreState} from "~/store/hooks";
import {IFormActionProps} from "~/types/forms";
import api from "~/services/api";
import {extractServerError, processServerError} from "~/services/api/errors";
import {OwnerParams} from "~/types/relations";
import {ErrorMessage} from "formik";
import validate from "~/ui/components/Sharing/EditSharing/form/validate";
import initialValues from "~/ui/components/Sharing/EditSharing/form/initialValues";
import ConfirmationModal from "~/ui/components/Dialogs/ConfirmationModal";

interface IProps {
    item?: SharedItem;
    isOpen: boolean;
    onClose: () => unknown;
}

const EditSharing = ({ item, isOpen, onClose }: IProps): ReactElement => {
    const notifications = useNotifications();

    const { shareType } = useStoreState(state => state.constants);
    const { user } = useStoreState(state => state.user);
    const { selectedHousehold } = useStoreState(state => state.household);
    const { selectedPerson } = useStoreState(state => state.person);
    const { onPopulatePermissions } = useStoreActions(actions => actions.user);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const isEdit = Boolean(item) && Boolean(item?.SharedItemID);

    const params: OwnerParams = {
        ownerType: OwnerType.HOUSEHOLD,
        requestType: ApiRequestType.CREATE_UPDATE,
        modelId: item?.SharedItemID,
        modelName: OwnerModelType.SHAREDITEM,
        userId: user?.UserID,
        personId: selectedPerson?.PersonID,
        householdId: selectedHousehold?.HouseholdID,
    };

    const createOrUpdate = async (values: SharedItem, { setErrors }: IFormActionProps) => {
        notifications.toggleLoading(true);
        try {
            const res = await api.shareditem.createOrUpdate(params, values);
            setErrors({ successMessage: `Permission successfully ${createEditMessageText(item)}!`});
            onPopulatePermissions(null);
            onClose();
        } catch (err) {
            setErrors({ backError: extractServerError(err) });
        }
        notifications.toggleLoading(false);
    };

    const remove = async () => {
        if (!item || !item?.SharedItemID) return;
        notifications.toggleLoading(true);
        try {
            params.requestType = ApiRequestType.REMOVE;
            const res = await api.address.remove(params, item);
            onPopulatePermissions(null);
            onClose();
        } catch (err) {
            processServerError(err, 'EditSharing.remove');
        }
        notifications.toggleLoading(false);
    };

    return (
        <>
            <Modal title={`${createEditHeaderText(item)} Permission`} isOpen={isOpen} handleClose={onClose} width="sm" hideFooter={true}>
                <FormWrapper initialValues={item ? item : initialValues} validationSchema={validate} onSubmit={createOrUpdate}>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <InputField type="email"
                                        name="EmailAddress"
                                        component={Input}
                                        placeholder="Email Address"
                                        label="Email Address"
                                        required={true} />
                            <ErrorMessage name="EmailAddress" />
                        </Grid>
                        <Grid item xs={6}>
                            <InputField type="select"
                                        name="ShareTypeID"
                                        component={Input}
                                        placeholder="Permission"
                                        label="Permission"
                                        items={shareType}
                                        labelField="ShareType"
                                        valueField="ShareTypeID"
                                        required={true} />
                            <ErrorMessage name="ShareTypeID" />
                        </Grid>
                    </Grid>
                    <DialogActions>
                        <Button
                            type="submit"
                            text={`${createEditHeaderSubmitText(item)} Permission`}
                            variant="contained"
                            size="large"
                            color="primary"
                        />
                        { isEdit ?
                          <Button
                            type="button"
                            text={`Delete`}
                            variant="contained"
                            size="large"
                            color="default"
                            onClick={() => setShowDeleteConfirmation(true)}
                          />
                          : null }
                        <ConfirmationModal isOpen={showDeleteConfirmation}
                                           onConfirm={remove}
                                           onCancel={() => setShowDeleteConfirmation(false)} />
                    </DialogActions>
                </FormWrapper>
            </Modal>
        </>
    );
}

export default EditSharing;
