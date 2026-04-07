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
import {AddressItem} from "~/types/api/addressItem";
import {ApiRequestType, OwnerModelType, OwnerType} from "~/ui/constants/api";
import {OwnerParams} from "~/types/relations";
import useNotifications from "~/ui/hooks/useNotifications";
import ConfirmationModal from "~/ui/components/Dialogs/ConfirmationModal";
import {IObjectiveDataType} from "~/types/objective/store";
import {downloadHouseholdAddress} from "~/ui/pages/Profile/components/ProfileDetailsHeader";
import {AxiosResponse} from "axios";
import {listChildren} from "~/services/api/address";
import { mutate } from 'swr';

interface IProps {
    item?: AddressItem;
    ownerType: OwnerType,
    isOpen: boolean;
    onClose: () => unknown;
}

const AddressForm = ({ item, ownerType, isOpen, onClose }: IProps): ReactElement => {
    const notifications = useNotifications();

    const { user } = useStoreState(state => state.user);
    //const { selectedHousehold } = useStoreState(state => state.household);
    //const { selectedPerson } = useStoreState(state => state.person);
    const { onSelect,onUpdate } = useStoreActions(actions => actions.person);
    const { contactId, householdId } = useStoreState(state => state.selected);

    const userActions = useStoreActions(actions => actions.user);
    const householdActions = useStoreActions(actions => actions.household);
    const objectiveActions = useStoreActions( actions => actions.objective)

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const isEdit = Boolean(item) && Boolean(item?.AddressItemID);

    const params: OwnerParams = {
        ownerType,
        requestType: ApiRequestType.CREATE_UPDATE,
        modelId: item?.AddressItemID,
        modelName: OwnerModelType.ADDRESS,
        userId: user?.UserID,
        personId: contactId,
        householdId: householdId,
    };

    const hhAddresses = async () => {
        return await downloadHouseholdAddress(householdId)
    }

    const personAddresses = async ():Promise<AddressItem[]>=> {
        const op: OwnerParams = {
            requestType: ApiRequestType.LIST,
            ownerType: OwnerType.PERSON,
            modelName: OwnerModelType.ADDRESS,
            personId: contactId,
            householdId: householdId
        };

        const res: AxiosResponse = await api.address.list(op);
        return res?.data ?? []
    }

    const handlePrimary = async (values: AddressItem) => {
        if(ownerType === OwnerType.PERSON || ownerType === OwnerType.HOUSEHOLD) {
            const allAddresses = ownerType === OwnerType.HOUSEHOLD ? await hhAddresses() : await personAddresses()

            if (values.MainAddress) {
                const otherMain = allAddresses.find(a => a.MainAddress)

                if(otherMain) {
                    if (otherMain.AddressItemID !== values.AddressItemID) {
                        const choice = confirm("There is an other primary address. Do you want to change it?")

                        if (choice) {
                            otherMain.MainAddress = false
                            await api.address.createOrUpdate(params, otherMain);

                            const children = (await api.address.listChildren(otherMain.AddressItemID!, householdId))?.data ?? []

                            await Promise.all(children.map(async itm => {
                                itm.MainAddress = false

                                const prms: OwnerParams = {
                                    ownerType,
                                    requestType: ApiRequestType.CREATE_UPDATE,
                                    modelId: itm.AddressItemID,
                                    modelName: OwnerModelType.ADDRESS,
                                    userId: user?.UserID,
                                    personId: contactId,
                                    householdId: householdId,
                                };
                                await api.address.createOrUpdate(prms, itm);
                            }))
                        } else {
                            values.MainAddress = false
                        }
                    }
                }
            }
        }
    }

    const handleChildren = async (id: number, values: AddressItem) => {
        const children = (await api.address.listChildren(id, householdId))?.data ?? []

        await Promise.all(children.map(async itm => {
            itm.MainAddress = values.MainAddress
            itm.AddressDescription = values.AddressDescription
            itm.StreetAddress = values.StreetAddress
            itm.City = values.City
            itm.StateRegion = values.StateRegion
            itm.Country = values.Country
            itm.PostalCode = values.PostalCode
            itm.Country = values.Country

            const prms: OwnerParams = {
                ownerType,
                requestType: ApiRequestType.CREATE_UPDATE,
                modelId: itm.AddressItemID,
                modelName: OwnerModelType.ADDRESS,
                userId: user?.UserID,
                personId: contactId,
                householdId: householdId,
            };
            await api.address.createOrUpdate(prms, itm);
        }))
    }

    const createOrUpdate = async (values: AddressItem, { setErrors }: IFormActionProps) => {
        notifications.toggleLoading(true);
        await handlePrimary(values)

        try {
            const resp = await api.address.createOrUpdate(params, values);
            const updated: AddressItem = resp.data as AddressItem
            await handleChildren(updated.AddressItemID!, values)
            setErrors({ successMessage: `Address successfully ${createEditMessageText(item)}!`});
            //await updateStore()
            const urlAddresses = `${process.env.NEXT_PUBLIC_API_URL}/household/${householdId}/person/${contactId}/address/list`;      
            mutate(urlAddresses)
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
            await api.address.remove(params, item);
            //await updateStore()
            onClose();
        } catch (err) {
            processServerError(err, 'AddressForm.remove');
        }
        notifications.toggleLoading(false);
    };

    /**
     * Update related store entities.
     */
    // const updateStore = async () => {
    //     if (ownerType === OwnerType.PERSON) {
    //         onSelect({ person: selectedPerson });
    //         onUpdate({ person: selectedPerson });
    //     }
    //     else if (ownerType === OwnerType.HOUSEHOLD) {
    //         await householdActions.onPopulate(null);
    //         await householdActions.onSelect({ household: selectedHousehold });
    //     }
    //     else if (ownerType === OwnerType.USER) {
    //         userActions.onPopulate(null);
    //     }else if(ownerType === OwnerType.OBJECTIVE){
    //         objectiveActions.onPopulate({type: IObjectiveDataType.OBJECTIVE})
    //     }
    // }

    return (
        <>
            <Modal title={`${createEditHeaderText(item)} Address`} isOpen={isOpen} handleClose={onClose} width="sm" hideFooter={true}>
                <FormWrapper initialValues={item ? item : initialValues} validationSchema={validate} onSubmit={createOrUpdate}>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <InputField type="text" name="AddressDescription" component={Input} placeholder="Friendly Name" label="Friendly name" />
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <InputField type="text" name="StreetAddress" component={Input} placeholder="Street address" label="Street address"/>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <InputField type="text" name="City" component={Input} placeholder="City" label="City"/>
                        </Grid>
                        <Grid item xs={6}>
                            <InputField type="text" name="StateRegion" component={Input} placeholder="State" label="State" />
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <InputField type="text" name="PostalCode" component={Input} placeholder="Zip" label="Zip"/>
                        </Grid>
                        <Grid item xs={6}>
                            <InputField type="text" name="Country" component={Input} placeholder="Country" label="Country"/>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <InputField type="checkbox"
                                        name="MainAddress"
                                        component={Input}
                                        label="Primary address" />
                        </Grid>
                    </Grid>
                    <DialogActions>
                        <Button
                            type="submit"
                            text={`${createEditHeaderSubmitText(item)} Address`}
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

export default AddressForm;
