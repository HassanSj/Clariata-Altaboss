import React, {ReactElement, useState} from 'react';
import {useStoreActions, useStoreState} from "~/store/hooks";
import Modal from "~/ui/components/Dialogs/Modal";
import {
    createEditHeaderSubmitText,
    createEditHeaderText,
    createEditMessageText,
    logSimple
} from "~/ui/constants/utils";
import FormWrapper from "~/ui/components/Forms/FormWrapper";

import initialValues from './form/initialValues';
import validate from './form/validate';
import api from "~/services/api";
import {extractServerError, processServerError} from "~/services/api/errors";
import {DialogActions, Grid} from "@material-ui/core";
import Button from "~/ui/components/Button";
import {IFormActionProps} from "~/types/forms";
import InputField from "~/ui/components/Forms/InputField";
import Input from "~/ui/components/Forms/Input";
import {EducationItem} from "~/types/api/educationItem";
import {ApiRequestType, OwnerModelType, OwnerType} from "~/ui/constants/api";
import {OwnerParams} from "~/types/relations";
import useNotifications from "~/ui/hooks/useNotifications";
import ConfirmationModal from "~/ui/components/Dialogs/ConfirmationModal";
import {initCustomDateFields, setCustomDateFields} from "~/ui/constants/person";

interface IProps {
    item?: EducationItem;
    ownerType: OwnerType,
    isOpen: boolean;
    onClose: () => unknown;
}

const EducationForm = ({ item, ownerType, isOpen, onClose }: IProps): ReactElement => {
    const notifications = useNotifications();

    const { user } = useStoreState(state => state.user);
    const { selectedHousehold } = useStoreState(state => state.household);
    const { selectedPerson } = useStoreState(state => state.person);
    const { onSelect } = useStoreActions(actions => actions.person);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const { contactId } = useStoreState(state => state.selected)

    const isEdit = Boolean(item) && Boolean(item?.EducationItemID);
    const params: OwnerParams = {
        ownerType,
        requestType: ApiRequestType.CREATE_UPDATE,
        modelId: item?.EducationItemID,
        modelName: OwnerModelType.EDUCATION,
        userId: user?.UserID,
        personId: contactId,
        householdId: selectedHousehold?.HouseholdID,
    };

    const dateFields = ["CompletionDate","GraduationDate"]
    let itemInitial;
    if(item) {
        itemInitial = JSON.parse(JSON.stringify(item))

        initCustomDateFields(itemInitial, dateFields, item!)
    }

    const createOrUpdate = async (values: EducationItem, { setErrors }: IFormActionProps) => {
        logSimple('createOrUpdate', {
            values
        });
        notifications.toggleLoading(true);
        try {
            setCustomDateFields(values, dateFields)

            await api.education.createOrUpdate(params, values);
            setErrors({ successMessage: `Education successfully ${createEditMessageText(item)}!`});
            onSelect({ person: selectedPerson });
            onClose();
        } catch (err) {
            setErrors({ backError: extractServerError(err) });
        }
        notifications.toggleLoading(false);
    };


    const remove = async () => {
        if (!item) return;
        notifications.toggleLoading(true);
        try {
            params.requestType = ApiRequestType.REMOVE;
            await api.education.remove(params, item);
            onSelect({ person: selectedPerson });
            onClose();
        } catch (err) {
            processServerError(err, 'EducationForm.remove');
        }
        notifications.toggleLoading(false);
    };

    return (
        <>
            <Modal title={`${createEditHeaderText(item)} Education`} isOpen={isOpen} handleClose={onClose} width="sm" hideFooter={true}>
                <FormWrapper initialValues={item ? itemInitial : initialValues} validationSchema={validate} onSubmit={createOrUpdate}>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <InputField type="text"
                                        name="InstitutionName"
                                        component={Input}
                                        placeholder="Institution"
                                        label="Institution"
                                        required={true} />
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <InputField type="datetext"
                                        name="CompletionDate"
                                        component={Input}
                                        placeholder="Completion Date"
                                        label="Completion Date" />
                        </Grid>
                        {/*<Grid item xs={6}>*/}
                        {/*    <InputField type="datetext"*/}
                        {/*                name="GraduationDate"*/}
                        {/*                component={Input}*/}
                        {/*                placeholder="Graduation Date"*/}
                        {/*                label="Graduation Date" />*/}
                        {/*</Grid>*/}
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <InputField type="text"
                                        name="EducationDescription"
                                        component={Input}
                                        placeholder="Degree, diploma, or certificate"
                                        label="Degree, diploma, or certificate" />
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <InputField type="text"
                                        name="Location"
                                        component={Input}
                                        placeholder="Location"
                                        label="Location" />
                        </Grid>
                    </Grid>
                    <DialogActions>
                        <Button
                            type="submit"
                            text={`${createEditHeaderSubmitText(item)} Education`}
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
};

export default EducationForm;
