import React, {ReactElement, useState} from 'react';
import {useStoreActions, useStoreState} from "~/store/hooks";
import Modal from "~/ui/components/Dialogs/Modal";
import {createEditHeaderSubmitText, createEditHeaderText, createEditMessageText} from "~/ui/constants/utils";
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
import {PhoneNumberItem} from "~/types/api/phoneNumberItem";
import {OwnerParams} from "~/types/relations";
import {ApiRequestType, OwnerModelType, OwnerType} from "~/ui/constants/api";
import useNotifications from "~/ui/hooks/useNotifications";
import ConfirmationModal from "~/ui/components/Dialogs/ConfirmationModal";
import useSWR, { mutate } from 'swr';
import { PhoneNumberType } from '~/types/api/phoneNumberType';
import { fetcher } from '~/types/api/fetcher';
import { getAccessToken } from '~/services/auth';

interface IProps {
    item?: PhoneNumberItem;
    ownerType: OwnerType,
    isOpen: boolean;
    onClose: () => unknown;
    isNewPerson?: boolean
}

const PhoneNumberForm = ({ item, ownerType, isOpen, onClose,isNewPerson}: IProps): ReactElement => {
    const notifications = useNotifications();

    //const {phoneNumberTypes} = useStoreState(state => state.constants);
    const { data: phoneNumberTypes } = useSWR<PhoneNumberType[]>([`${process.env.NEXT_PUBLIC_API_URL}/phonenumbertype/list`, getAccessToken()], fetcher);
    const { user } = useStoreState(state => state.user);
    //const { selectedHousehold } = useStoreState(state => state.household);
    //const { selectedPerson } = useStoreState(state => state.person);
    // const { onAddPhoneNumber, onAddAddress } = useStoreActions(actions => actions.contact);
    const { contactId, householdId } = useStoreState(state => state.selected);
    
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const isEdit = Boolean(item) && Boolean(item?.PhoneNumberItemID);
    const params: OwnerParams = {
        ownerType,
        requestType: ApiRequestType.CREATE_UPDATE,
        modelId: item?.PhoneNumberItemID,
        modelName: OwnerModelType.PHONENUMBER,
        userId: user?.UserID,
        personId: contactId,
        householdId: householdId
    };

    const createOrUpdate = async (values: PhoneNumberItem, { setErrors }: IFormActionProps) => {
        notifications.toggleLoading(true);
        try {
            console.log(values);
            console.log(params);
            const res = await api.phonenumber.createOrUpdate(params, values);
            setErrors({ successMessage: `Phone number successfully ${createEditMessageText(item)}!`});
            //onSelect({ person: contactId });  
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
            const res = await api.phonenumber.remove(params, item);
            //onSelect({ person: selectedPerson });
            onClose();
        } catch (err) {
            processServerError(err, 'PHoneNumberForm.remove');
        }
        notifications.toggleLoading(false);
    };

    return (
        <>
            <Modal title={`${createEditHeaderText(item)} Phone Number`} isOpen={isOpen} handleClose={onClose} width="sm" hideFooter={true}>
                <FormWrapper initialValues={item ? item : initialValues} validationSchema={validate} onSubmit={createOrUpdate}>
                    <Grid container spacing={1}>
                        <Grid item xs={4}>
                            <InputField type="select"
                                        name="PhoneNumberTypeID"
                                        component={Input}
                                        placeholder="Type"
                                        label="Type"
                                        items={phoneNumberTypes}
                                        labelField="Description"
                                        valueField="PhoneNumberTypeID"
                                        required={true} />
                        </Grid>
                        <Grid item xs={8}>
                            <InputField type="tel"
                                        name="PhoneNumber"
                                        component={Input}
                                        placeholder="Phone number"
                                        label="Phone number"
                                        required={true} />
                        </Grid>
                    </Grid>
                    <DialogActions>
                        <Button
                            type="submit"
                            text={`${createEditHeaderSubmitText(item)} Phone Number`}
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

export default PhoneNumberForm;
