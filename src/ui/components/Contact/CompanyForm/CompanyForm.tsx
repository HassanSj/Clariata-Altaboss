import React, {ReactElement, useState} from "react";
import {OwnerType} from "~/ui/constants/api";
import {Company} from "~/types/api/company";
import useNotifications from "~/ui/hooks/useNotifications";
import {useStoreState} from "~/store/hooks";
import {IndustryTypeOptions, initCustomDateFields, setCustomDateFields} from "~/ui/constants/person";
import api from "~/services/api";
import {extractServerError, processServerError} from "~/services/api/errors";
import {IFormActionProps} from "~/types/forms";
import Modal from "~/ui/components/Dialogs/Modal";
import {createEditHeaderSubmitText, createEditHeaderText} from "~/ui/constants/utils";
import FormWrapper from "~/ui/components/Forms/FormWrapper";
import validate from "./validate";
import {DialogActions, Grid} from "@material-ui/core";
import InputField from "~/ui/components/Forms/InputField";
import Input from "~/ui/components/Forms/Input";
import Button from "~/ui/components/Button";
import ConfirmationModal from "~/ui/components/Dialogs/ConfirmationModal";

interface IProps {
    item?: Company;
    ownerType: OwnerType,
    isOpen: boolean;
    onClose: () => unknown;
}


const CompanyForm = ({item, isOpen, onClose}: IProps): ReactElement => {
    const notifications = useNotifications();

    const {selectedPerson} = useStoreState(state => state.person);
    const { selectedHousehold } = useStoreState(state => state.household);

    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const isEdit = !!item && !!item?.CompanyID

    const { contactId } = useStoreState(state => state.selected)

    let initialValues: Company = {
        PersonID: contactId ?? 0,
        Name: ""
    }

    const dateFields = ["FoundedDate","AcquisitionDate","SoldDate","ProjectedSellDate","PlannedSuccessionDate"]
    const checkboxFields = ["BoardOfAdvisors","BoardOfDirections","FamilyCouncil","FamilyMissionStatement","FamilyCharter","FamilyStrategy","FamilyMeetings","FamilyCelebration","FamilyDevelopmentPlan","SuccessionPlan"]
    const checkboxFieldLabels = ["Board Of Advisors","Board Of Directions","Family Council","Family Mission/Vision/Core Values Statement","Family Charter","Family Strategy","Family Meetings","Family Celebration","Family Development Plan","Succession Plan"]

    if(isEdit){
        initialValues = JSON.parse(JSON.stringify(item!))

        initCustomDateFields(initialValues,dateFields, item!)
    }

    const remove = async () => {
        notifications.toggleLoading(true);
        try{
            await api.company.remove(selectedHousehold.HouseholdID, contactId, item!)
            onClose();
        }catch (err){
            processServerError(err, 'CompanyForm.remove');
        }
        notifications.toggleLoading(false);
    }

    const createOrUpdate = async (values: Company, { setErrors }: IFormActionProps) => {
        notifications.toggleLoading(true);
        try {
            setCustomDateFields(values, dateFields)
            if(values.CompanyID){
                await api.company.update(selectedHousehold.HouseholdID, contactId, values);
            }else{
                await api.company.create(selectedHousehold.HouseholdID, contactId, values);
            }
            onClose();
        } catch (err) {
            setErrors({ backError: extractServerError(err) });
        }
        notifications.toggleLoading(false);
    }

    return (
        <Modal title={`${createEditHeaderText(item)} Company`} isOpen={isOpen} handleClose={onClose} width="sm" hideFooter={true}>
            <FormWrapper initialValues={initialValues} validationSchema={validate} onSubmit={createOrUpdate}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <InputField type="text"
                                    name="Name"
                                    component={Input}
                                    placeholder="Company Name"
                                    label="For"
                                    required={true}/>
                    </Grid>
                </Grid>
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <InputField type="text"
                                    name="Phone"
                                    component={Input}
                                    placeholder="Phone"
                                    label="Phone"/>
                    </Grid>
                    <Grid item xs={6}>
                        <InputField type="email"
                                    name="Email"
                                    component={Input}
                                    placeholder="Email"
                                    label="Email"/>
                    </Grid>
                </Grid>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <InputField type="text"
                                    name="Address"
                                    component={Input}
                                    placeholder="Address"
                                    label="Address"/>
                    </Grid>
                </Grid>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <InputField type="text"
                                    name="Website"
                                    component={Input}
                                    placeholder="Web address"
                                    label="Web address"/>
                    </Grid>
                </Grid>
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <InputField type="select"
                                    labelField="label"
                                    valueField="value"
                                    items={IndustryTypeOptions}
                                    name="IndustryType"
                                    component={Input}
                                    label="Industry Type"
                                    placeholder="Industry Type"/>
                    </Grid>
                    <Grid item xs={6}>
                        <InputField type="number"
                                    name="EmployeeCount"
                                    component={Input}
                                    placeholder="Number of Employees"
                                    label="Number of Employees"/>
                    </Grid>
                </Grid>

                {/*Date fields*/}

                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <InputField type="datetext"
                                    name="FoundedDate"
                                    component={Input}
                                    placeholder="Year Founded" label="Year Founded" />
                    </Grid>
                    <Grid item xs={6}>
                        <InputField type="datetext"
                                    name="AcquisitionDate"
                                    component={Input}
                                    placeholder="Acquisition Date" label="Acquisition Date" />
                    </Grid>
                </Grid>

                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <InputField type="datetext"
                                    name="SoldDate"
                                    component={Input}
                                    placeholder="Sold Date" label="Sold Date" />
                    </Grid>
                    <Grid item xs={6}>
                        <InputField type="datetext"
                                    name="ProjectedSellDate"
                                    component={Input}
                                    placeholder="Projected Sell Date" label="Projected Sell Date" />
                    </Grid>
                </Grid>

                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <InputField type="datetext"
                                    name="PlannedSuccessionDate"
                                    component={Input}
                                    placeholder="Planned Succession Date" label="Planned Succession Date" />
                    </Grid>
                </Grid>

                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <InputField type="number"
                                    name="Generations"
                                    component={Input}
                                    placeholder="Generations" label="How Many generations old in the Family Business/Enterprise" />
                    </Grid>

                    <Grid item xs={6}>
                        <InputField type="number"
                                    name="FamilyOwnershipPercentage"
                                    component={Input}
                                    placeholder="Ownership percentage" label="Percentage of Business still majority-owned by the family" />
                    </Grid>
                </Grid>

                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <InputField type="number"
                                    name="OwnershipPercentage"
                                    component={Input}
                                    placeholder="Ownership percentage" label="Ownership percentage" />
                    </Grid>
                    <Grid item xs={6}>
                        <InputField type="number"
                                    name="Revenue"
                                    component={Input}
                                    placeholder="Annual Revenue" label="Annual Revenue" />
                    </Grid>
                </Grid>

                <Grid container spacing={1}>
                    <Grid item xs={12} className="text-center">Do you have the following:</Grid>
                    {checkboxFields.map((field, index) => (
                        <Grid item xs={6} key={field}>
                            <InputField type="checkbox"
                                        name={field}
                                        component={Input}
                                        label={checkboxFieldLabels[index]} />
                        </Grid>
                    ))}
                </Grid>

                <DialogActions>
                    <Button
                        type="submit"
                        text={`${createEditHeaderSubmitText(item)} Company`}
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

export default CompanyForm