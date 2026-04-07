import React, {ReactElement, useState} from 'react';
import {useStoreActions, useStoreState} from "~/store/hooks";
import Modal from "~/ui/components/Dialogs/Modal";
import {createEditHeaderSubmitText, createEditHeaderText, toDate} from "~/ui/constants/utils";
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
import {Person} from "~/types/api/person";
import {
    FamilyTitle,
    FamilyTitles,
    PersonTypes,
    ProfessionalTitle,
    ProfessionalTitles
} from "~/ui/constants/person";
import useNotifications from "~/ui/hooks/useNotifications";
import {OwnerParams} from "~/types/relations";
import {ApiRequestType, OwnerModelType, OwnerType, PersonType} from "~/ui/constants/api";
import {TabProps} from "~/ui/components/Containers/VerticalTabs/VerticalTabs";
import styles from "~/ui/components/ActionItems/EditActionItem/EditActionItem.module.scss";
import VerticalTabs from "~/ui/components/Containers/VerticalTabs";
import ConfirmationModal from "~/ui/components/Dialogs/ConfirmationModal";
import {objectiveYesNoTypes} from "~/ui/constants/objectives";
import validateSimple from './form/validateSimple';
import { MaritalStatus } from '~/types/api/maritalStatus';
import useSWR from 'swr';
import { getAccessToken } from '~/services/auth';
import { fetcher } from '~/types/api/fetcher';

interface IProps {
    person?: Person;
    simple?: boolean;
    persontype?: PersonType;
    isOpen: boolean;
    selectPerson?: (person : Person) => Promise<unknown>;
    onClose: () => unknown;
    markIsDirty: () => void;
}

const EditContact = ({ person, isOpen, onClose, simple, persontype, selectPerson, markIsDirty}: IProps): ReactElement => {
    const notifications = useNotifications();

    const { user } = useStoreState(state => state.user);
    const { householdId } = useStoreState(state => state.selected);
    //const { maritalStatuses } = useStoreState(state => state.constants);
    const { data: maritalStatuses } = useSWR<MaritalStatus[]>([`${process.env.NEXT_PUBLIC_API_URL}/maritalstatus/list`, getAccessToken()], fetcher);
    //const { onPopulate, onSelect } = useStoreActions(actions => actions.person);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const isEdit = Boolean(person) && Boolean(person?.PersonID);

    const params: OwnerParams = {
        ownerType: OwnerType.HOUSEHOLD,
        requestType: ApiRequestType.CREATE_UPDATE,
        modelId: person?.PersonID,
        modelName: OwnerModelType.PERSON,
        userId: user?.UserID,
        personId: person?.PersonID,
        householdId: householdId,
    };

    // Create or update
    const createOrUpdate = async (values: Person, { setErrors }: IFormActionProps) => {
        notifications.toggleLoading(true);
        const populatedValues = {
            ...values,
            PersonTypeID : simple ? persontype : values?.PersonTypeID
        }
        try {
            params.requestType = ApiRequestType.CREATE_UPDATE;
            const res = await api.person.createOrUpdate(params, populatedValues);
            setErrors({ successMessage: 'Contact successfully created!'});
            const resUpdated = await api.person.getFull(res?.data?.PersonID, householdId);
            //await onPopulate({});
            if(selectPerson)
            {
                await selectPerson(resUpdated);
            }
            onClose();
        } catch (err) {
            setErrors({ backError: extractServerError(err) });
        }

        // @ts-ignore
        if(window.buildDiagram){
            // @ts-ignore
            await window.buildDiagram()
        }
        notifications.toggleLoading(false);
    };

    const remove = async() => {
        if (!person?.PersonID) return;
        notifications.toggleLoading(true);
        try {
            params.requestType = ApiRequestType.REMOVE;
            const res = api.person.remove(params, person);
            notifications.addSuccessNotification("Contact successfully deleted!");
            // clear selected
            //await onSelect(null);
            // Re populate
            //await onPopulate(null);
        } catch (err) {
            processServerError(err, 'EditContact.remove');
        }
        notifications.toggleLoading(false);
    };

    // @ts-ignore
    const [currentValues, setCurrentValues] = useState<Person | undefined>(person ? person : initialValues);
    const onValuesChange = (changes: any) => {
        markIsDirty();
        setCurrentValues(changes);
    }

    const tabs: TabProps[] = [
        {
            index: 0,
            label: 'Dates',
            content: (
              <>
                  <Grid container spacing={1}>
                      <Grid item xs={6}>
                          <InputField type="date" name="DateOfBirth" component={Input}  placeholder="Date Of Birth" label="Date Of Birth" />
                      </Grid>
                      <Grid item xs={6}>
                          <InputField type="text" name="Birthplace" component={Input}  placeholder="Birthplace" label="Birthplace" />
                      </Grid>
                  </Grid>
                  <Grid container spacing={1}>
                      <Grid item xs={6}>
                          <InputField type="select"
                                      labelField="label"
                                      valueField="value"
                                      items={objectiveYesNoTypes}
                                      name="Deceased"
                                      component={Input}
                                      
                                      label="Deceased?"
                                      placeholder="Deceased"/>
                      </Grid>
                      <Grid item xs={6}>
                          { currentValues?.Deceased ?
                            <InputField type="date" name="DateOfDeath" component={Input}  placeholder="Date Of Death" label="Date Of Death" />
                          : null }
                      </Grid>
                  </Grid>
              </>
            )
        },
        {
            index: 1,
            label: 'Family',
            content: (
              <>
                  <Grid container spacing={1}>
                      <Grid item xs={4}>
                          <InputField type="select"
                                      name="MaritalStatusID"
                                      component={Input}                                      
                                      placeholder="Marital Status"
                                      label="Marital Status"
                                      items={maritalStatuses}
                                      labelField="MaritalStatus"
                                      valueField="MaritalStatusID" />
                      </Grid>
                      <Grid item xs={4}>
                          <InputField type="date" name="MarriageDate" component={Input}  placeholder="Marriage Date" label="Marriage Date" />
                      </Grid>
                      <Grid item xs={4}>
                          <InputField type="number" name="NumberOfChildren" component={Input}  placeholder="Number Of Children" label="Number Of Children" />
                      </Grid>
                  </Grid>
              </>
            )
        },
        {
            index: 2,
            label: 'Contact',
            content: (
              <>
                  <Grid container spacing={1}>
                      <Grid item xs={12}>
                          <InputField type="email" name="EmailAddress" component={Input}  placeholder="Email Address" label="Email Address" />
                      </Grid>
                  </Grid>
              </>
            )
        },
        {
            index: 3,
            label: 'Work',
            content: (
              <>
                  <Grid container spacing={1}>
                      <Grid item xs={4}>
                          <InputField type="text" name="Company" component={Input}  placeholder="Company" label="Company" />
                      </Grid>
                      <Grid item xs={4}>
                          <InputField type="text" name="Occupation" component={Input}  placeholder="Occupation" label="Occupation" />
                      </Grid>
                  </Grid>
              </>
            )
        },
        {
            index: 4,
            label: 'Other',
            content: (
              <>
                  <Grid container spacing={1}>
                      <Grid item xs={4}>
                          <InputField type="text" name="Location" component={Input}  placeholder="Location" label="Location" />
                      </Grid>
                      <Grid item xs={4}>
                          <InputField type="text" name="ReligiousAffiliation" component={Input}  placeholder="Religious Affiliation" label="Religious Affiliation" />
                      </Grid>
                  </Grid>
              </>
            )
        },
    ];

    const getPersonTitles = () => {
        switch (currentValues?.PersonTypeID){
            case PersonType.FAMILY:
                return FamilyTitles
            case PersonType.PROFESSIONAL:
                return ProfessionalTitles
            default:
                return []
        }
    }

    const showFreePersonTitle = () => {
        return currentValues?.PersonTypeID === PersonType.OTHER ||
            currentValues?.PersonTitleID === FamilyTitle.FREE ||
            currentValues?.PersonTitleID === ProfessionalTitle.FREE
    }

    const alterPersonDates = (p: Person) => {
        const copy: Person = JSON.parse(JSON.stringify(p))
        const keys = ['DateOfBirth','MarriageDate','DateOfDeath']

        keys.forEach((key) => {
            // @ts-ignore
            if(copy[key]){
                // @ts-ignore
                copy[key] = toDate(copy[key],"yyyy-MM-dd")
            }
        })

        return copy
    }

    return (
        <>
            <Modal title={`${createEditHeaderText(person?.PersonID)} Contact`}
                   isOpen={isOpen}
                   handleClose={onClose}
                   width="lg"
                   hideFooter={true}>
                <FormWrapper initialValues={person ? alterPersonDates(person) : initialValues}
                             validationSchema={simple ? validateSimple : validate}
                             onSubmit={createOrUpdate}
                             onValuesChange={onValuesChange}
                             modelName="Contact">
                    {simple ?
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Grid container spacing={1}>
                                <Grid item xs={6}>
                                    <InputField type="text"
                                                name="FirstName"
                                                component={Input}
                                                
                                                placeholder="First Name"
                                                label="First Name" />
                                </Grid>
                                <Grid item xs={6}>
                                    <InputField type="text"
                                                name="LastName"
                                                component={Input}
                                                
                                                placeholder="Last Name"
                                                label="Last Name" />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    :
                    <>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <InputField type="select"
                                        name="PersonTypeID"
                                        component={Input}
                                        
                                        placeholder="Contact Type"
                                        label="Contact Type"
                                        required={true}
                                        items={PersonTypes}
                                        labelField="label"
                                        valueField="value" />
                        </Grid>
                        <Grid item xs={6}>
                            <InputField type="select"
                                        name="PersonTitleID"
                                        component={Input}
                                        
                                        placeholder="Contact Title"
                                        label="Contact Title"
                                        required={true}
                                        items={getPersonTitles()}
                                        labelField="label"
                                        valueField="value" />
                        </Grid>
                    </Grid>
                    { showFreePersonTitle() ?
                        <Grid container spacing={1}>
                            <InputField type="text"
                                        name="PersonTitleFree"
                                        component={Input}
                                        
                                        placeholder="Contact Title Other"
                                        label="Contact Title Other"
                                        required={true}/>
                        </Grid>
                    : null }
                    <br />
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Grid container spacing={1}>
                                <Grid item xs={4}>
                                    <InputField type="text"
                                                name="FirstName"
                                                component={Input}
                                                
                                                placeholder="First Name"
                                                label="First Name" />
                                </Grid>
                                <Grid item xs={4}>
                                    <InputField type="text"
                                                name="MiddleName"
                                                component={Input}
                                                
                                                placeholder="Middle Name"
                                                label="Middle Name" />
                                </Grid>
                                <Grid item xs={4}>
                                    <InputField type="text"
                                                name="LastName"
                                                component={Input}
                                                
                                                placeholder="Last Name"
                                                label="Last Name" />
                                </Grid>
                            </Grid>
                            <Grid container spacing={1}>
                                <Grid item xs={4}>
                                    <InputField type="text"
                                                name="PreferredName"
                                                component={Input}
                                                
                                                placeholder="Preferred Name"
                                                label="Preferred Name" />
                                </Grid>
                                <Grid item xs={4}>
                                    <InputField type="text"
                                                name="OriginalSurname"
                                                component={Input}
                                                
                                                placeholder="Original Surname"
                                                label="Original Surname" />
                                </Grid>
                                <Grid item xs={4}>
                                    <InputField type="text"
                                                name="Suffix"
                                                component={Input}
                                                
                                                placeholder="Suffix"
                                                label="Suffix" />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <div className={styles.task_tabs_container}>
                        <VerticalTabs tabs={tabs}/>
                    </div> 
                    </>}
                    <DialogActions>
                        <Button
                          type="submit"
                          text={`${createEditHeaderSubmitText(person?.PersonID)} Contact`}
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

export default EditContact;
