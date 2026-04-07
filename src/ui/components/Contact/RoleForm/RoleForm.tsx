import React, {ReactElement, useState} from "react";
import {OwnerType} from "~/ui/constants/api";
import {Role} from "~/types/api/role";
import useNotifications from "~/ui/hooks/useNotifications";
import {useStoreState} from "~/store/hooks";
import Modal from "~/ui/components/Dialogs/Modal";
import {
    createEditHeaderSubmitText,
    createEditHeaderText,
} from "~/ui/constants/utils";
import FormWrapper from "~/ui/components/Forms/FormWrapper";
import validate from "./validate";
import {DialogActions, Grid} from "@material-ui/core";
import InputField from "~/ui/components/Forms/InputField";
import Input from "~/ui/components/Forms/Input";
import Button from "~/ui/components/Button";
import ConfirmationModal from "~/ui/components/Dialogs/ConfirmationModal";
import {RoleType, RoleTypeOptions} from "~/ui/constants/person";
import api from "~/services/api";
import {extractServerError, processServerError} from "~/services/api/errors";
import {IFormActionProps} from "~/types/forms";

interface IProps {
    item?: Role;
    ownerType: OwnerType,
    isOpen: boolean;
    onClose: () => unknown;
}

const RoleForm = ({item, isOpen, onClose}: IProps): ReactElement => {
    const notifications = useNotifications();

    const {selectedPerson} = useStoreState(state => state.person);
    const { selectedHousehold } = useStoreState(state => state.household);

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const { contactId } = useStoreState(state => state.selected)

    const isEdit = !!item && !!item?.RoleID
    const initialValues: Role = {
        Role: RoleType.EXECUTOR,
        PersonID: contactId,
        ForPerson: "",
        AdditionalInformation: ""
    }

    const remove = async () => {
        notifications.toggleLoading(true);
        try{
            await api.role.remove(selectedHousehold.HouseholdID, contactId, item!)
            onClose();
        }catch (err){
            processServerError(err, 'RoleForm.remove');
        }
        notifications.toggleLoading(false);
    }

    const createOrUpdate = async (values: Role, { setErrors }: IFormActionProps) => {
        notifications.toggleLoading(true);
        try {
            if(values.RoleID){
                await api.role.update(selectedHousehold.HouseholdID, contactId, values);
            }else{
                await api.role.create(selectedHousehold.HouseholdID, contactId, values);
            }
            onClose();
        } catch (err) {
            setErrors({ backError: extractServerError(err) });
        }
        notifications.toggleLoading(false);
    }

    return (
        <Modal title={`${createEditHeaderText(item)} Role`} isOpen={isOpen} handleClose={onClose} width="sm" hideFooter={true}>
            <FormWrapper initialValues={item ? item : initialValues} validationSchema={validate} onSubmit={createOrUpdate}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <InputField type="select"
                                    labelField="label"
                                    valueField="value"
                                    items={RoleTypeOptions}
                                    name="Role"
                                    component={Input}
                                    label="Role"
                                    placeholder="Role"
                                    required={true}/>
                    </Grid>
                </Grid>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <InputField type="text"
                                    name="ForPerson"
                                    component={Input}
                                    placeholder="For"
                                    label="For"
                                    required={true}/>
                    </Grid>
                </Grid>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <InputField type="text"
                                    name="AdditionalInformation"
                                    component={Input}
                                    placeholder="Additional Information"
                                    label="Additional Information"/>
                    </Grid>
                </Grid>
                <DialogActions>
                    <Button
                        type="submit"
                        text={`${createEditHeaderSubmitText(item)} Role`}
                        variant="contained"
                        size="large"
                        color="primary"
                    />
                    {isEdit &&
                        <Button
                            type="button"
                            text={`Delete`}
                            variant="contained"
                            size="large"
                            color="default"
                            onClick={() => setShowDeleteConfirmation(true)}
                        />
                    }
                    <ConfirmationModal isOpen={showDeleteConfirmation}
                                       onConfirm={remove}
                                       onCancel={() => setShowDeleteConfirmation(false)}/>
                </DialogActions>
            </FormWrapper>
        </Modal>
    )
}

export default RoleForm