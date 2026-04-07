import React, {ReactElement, useState} from 'react';
import {useStoreActions, useStoreState} from "~/store/hooks";
import Modal from "~/ui/components/Dialogs/Modal";
import {
    convertStringToDate, convertStringToDateText,
    createEditHeaderSubmitText,
    createEditHeaderText,
    createEditMessageText,
    getDateType
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
import {WorkHistoryItem} from "~/types/api/workHistoryItem";
import {ApiRequestType, OwnerModelType, OwnerType} from "~/ui/constants/api";
import {OwnerParams} from "~/types/relations";
import useNotifications from "~/ui/hooks/useNotifications";
import ConfirmationModal from "~/ui/components/Dialogs/ConfirmationModal";
import SelectDate from "~/ui/components/Forms/SelectDate";
import {formatDate} from "@telerik/kendo-intl";
import {
    CompanyPhoneTypeOptions,
    initCustomDateFields,
    RoleTypeOptions,
    setCustomDateFields,
    WorkTypeOptions
} from "~/ui/constants/person";
import {objectiveYesNoTypes} from "~/ui/constants/objectives";

interface IProps {
    item?: WorkHistoryItem;
    ownerType: OwnerType,
    isOpen: boolean;
    onClose: () => unknown;
}

const WorkForm = ({ item, ownerType, isOpen, onClose }: IProps): ReactElement => {
    const notifications = useNotifications();

    const { user } = useStoreState(state => state.user);
    const { selectedHousehold } = useStoreState(state => state.household);
    const { selectedPerson } = useStoreState(state => state.person);
    const { onSelect } = useStoreActions(actions => actions.person);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const { contactId } = useStoreState(state => state.selected)

    const isEdit = Boolean(item) && Boolean(item?.WorkHistoryItemID);
    const params: OwnerParams = {
        ownerType,
        requestType: ApiRequestType.CREATE_UPDATE,
        modelId: item?.WorkHistoryItemID,
        modelName: OwnerModelType.WORKHISTORY,
        userId: user?.UserID,
        personId: contactId,
        householdId: selectedHousehold?.HouseholdID,
    };

    const dateFields = ['StartDate','EndDate','PlannedRetirementDate','PlannedSuccessionDate','RetirementDate','SuccessionDate']

    let itemInitial: WorkHistoryItem|undefined;
    if(item) {
        itemInitial = JSON.parse(JSON.stringify(item))

        initCustomDateFields(itemInitial, dateFields, item!)
    }

    const createOrUpdate = async (values: WorkHistoryItem, { setErrors }: IFormActionProps) => {
        notifications.toggleLoading(true);
        try {
            setCustomDateFields(values, dateFields)
            await api.workhistory.createOrUpdate(params, values);
            setErrors({ successMessage: `Work history successfully ${createEditMessageText(item)}!`});
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
            await api.workhistory.remove(params, item);
            onSelect({ person: selectedPerson });
            onClose();
        } catch (err) {
            processServerError(err, 'WorkForm.remove');
        }
        notifications.toggleLoading(false);
    };

    return (
        <>
            <Modal title={`${createEditHeaderText(item)} Work`} isOpen={isOpen} handleClose={onClose} width="md" hideFooter={true}>
                <FormWrapper initialValues={item ? itemInitial : initialValues} validationSchema={validate} onSubmit={createOrUpdate}>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <InputField type="text"
                                        name="Company"
                                        component={Input}
                                        placeholder="Company"
                                        label="Company"
                                        required={true} />
                        </Grid>
                        <Grid item xs={6}>
                            <InputField type="text"
                                        name="Title"
                                        component={Input}
                                        placeholder="Title"
                                        label="Title"/>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={4}>
                            <InputField type="select"
                                        labelField="label"
                                        valueField="value"
                                        items={objectiveYesNoTypes}
                                        name="FamilyOwned"
                                        component={Input}
                                        label="Is this a Family Owned Enterprise"
                                        required={true}/>
                        </Grid>
                        <Grid item xs={4}>
                            <InputField type="select"
                                        labelField="label"
                                        valueField="value"
                                        items={objectiveYesNoTypes}
                                        name="CurrentlyWorking"
                                        component={Input}
                                        label="Presently Working"/>
                        </Grid>
                        <Grid item xs={4}>
                            <InputField type="select"
                                        labelField="label"
                                        valueField="value"
                                        items={WorkTypeOptions}
                                        name="Type"
                                        component={Input}
                                        label="Type"/>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <InputField type="text"
                                        name="PhoneNumber"
                                        component={Input}
                                        placeholder="Phone Number"
                                        label="Phone Number"/>
                        </Grid>
                        <Grid item xs={6}>
                            <InputField type="select"
                                        labelField="label"
                                        valueField="value"
                                        items={CompanyPhoneTypeOptions}
                                        name="PhoneNumberType"
                                        component={Input}
                                        placeholder="Phone Number Type"
                                        label="Phone Number Type"/>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={4}>
                            <InputField type="text"
                                        name="City"
                                        component={Input}
                                        placeholder="City"
                                        label="City" />
                        </Grid>
                        <Grid item xs={4}>
                            <InputField type="text"
                                        name="State"
                                        component={Input}
                                        placeholder="State"
                                        label="State" />
                        </Grid>
                        <Grid item xs={4}>
                            <InputField type="text"
                                        name="ZIP"
                                        component={Input}
                                        placeholder="ZIP"
                                        label="ZIP" />
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <InputField type="text"
                                        name="Address"
                                        component={Input}
                                        placeholder="Address"
                                        label="Address" />
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <InputField type="text"
                                        name="WebSite"
                                        component={Input}
                                        placeholder="Website"
                                        label="Website" />
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <InputField type="text"
                                        name="Description"
                                        component={Input}
                                        placeholder="Additional Information"
                                        label="Additional Information" />
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <InputField type="datetext"
                                        name="StartDate"
                                        component={Input}
                                        placeholder="Start Date" label="Start Date" />
                        </Grid>
                        <Grid item xs={6}>
                            <InputField type="datetext"
                                        name="EndDate"
                                        component={Input}
                                        placeholder="End Date"
                                        label="End Date"/>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <InputField type="datetext"
                                        name="SuccessionDate"
                                        component={Input}
                                        placeholder="Succession Date" label="Succession Date" />
                        </Grid>
                        <Grid item xs={6}>
                            <InputField type="datetext"
                                        name="RetirementDate"
                                        component={Input}
                                        placeholder="Retirement Date"
                                        label="Retirement Date"/>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            {/* <InputField type="datetext"
                                        name="PlannedSuccessionDate"
                                        component={Input}
                                        placeholder="Planned Succession Date" label="Planned Succession Date" /> */}
                        </Grid>
                        <Grid item xs={6}>
                            {/* <InputField type="datetext"
                                        name="PlannedRetirementDate"
                                        component={Input}
                                        placeholder="Planned Retirement Date"
                                        label="Planned Retirement Date"/> */}
                        </Grid>
                    </Grid>
                    <DialogActions>
                        <Button
                            type="submit"
                            text={`${createEditHeaderSubmitText(item)} Work`}
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

export default WorkForm;
