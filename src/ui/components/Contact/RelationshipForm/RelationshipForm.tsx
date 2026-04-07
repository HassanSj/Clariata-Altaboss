import React, {ReactElement, useEffect, useState} from 'react';
import {useStoreActions, useStoreState} from "~/store/hooks";
import Modal from "~/ui/components/Dialogs/Modal";
import {createEditHeaderSubmitText, createEditHeaderText, createEditMessageText} from "~/ui/constants/utils";
import FormWrapper from "~/ui/components/Forms/FormWrapper";

import validate from './form/validate';
import api from "~/services/api";
import {extractServerError, processServerError} from "~/services/api/errors";
import {DialogActions, Grid} from "@material-ui/core";
import Button from "~/ui/components/Button";
import {IFormActionProps} from "~/types/forms";
import InputField from "~/ui/components/Forms/InputField";
import Input from "~/ui/components/Forms/Input";
import {PersonalRelationship} from "~/types/api/personalRelationship";
import {OwnerParams} from "~/types/relations";
import {ApiRequestType, OwnerModelType, OwnerType} from "~/ui/constants/api";
import initialValues from "~/ui/components/Contact/RelationshipForm/form/initialValues";
import useNotifications from "~/ui/hooks/useNotifications";
import SelectAutocomplete from "~/ui/components/Forms/SelectAutocomplete";
import SelectAvatarTemplate from "~/ui/components/Forms/SelectAutocomplete/components/SelectAvatarTemplate";
import ConfirmationModal from "~/ui/components/Dialogs/ConfirmationModal";
import {
    InverzPersonRelationshipTypes,
    PersonRelationshipCategory,
    PersonRelationshipTypeOptions,
    RelationshipCategoryType
} from "~/ui/constants/person";
import RelationshipCategorySelection from "~/ui/components/Contact/RelationshipForm/RelationshipCategorySelection";
import useSWR from 'swr';
import { fetcher } from '~/types/api/fetcher';
import { getAccessToken } from '~/services/auth';
import { Person } from '~/types/api/person';

interface IProps {
    item?: PersonalRelationship;
    ownerType: OwnerType,
    isOpen: boolean;
    onClose: () => unknown;
}

const RelationshipForm = ({ item, ownerType, isOpen, onClose }: IProps): ReactElement => {
    const notifications = useNotifications();

    const { contactId, householdId  } = useStoreState(state => state.selected);
    //const { persons } = useStoreState(state => state.person);
    const url =  `${process.env.NEXT_PUBLIC_API_URL}/household/${householdId}/person/list`;
    const { data: persons} = useSWR<Person[]>([url, getAccessToken()], fetcher, {refreshInterval: 200});
    const personalUrl =  `${process.env.NEXT_PUBLIC_API_URL}/household/${householdId}/person/${contactId}/personalrelationship/list`;
    const { data : selectedRelationships} = useSWR<PersonalRelationship[]>([personalUrl, getAccessToken()], fetcher, {refreshInterval: 200});
    const { user } = useStoreState(state => state.user);
    //const { selectedHousehold } = useStoreState(state => state.household);
    //const { selectedPerson } = useStoreState(state => state.person);
    //const { selectedRelationships } = useStoreState(state => state.person);
    //const { onSelect } = useStoreActions(actions => actions.person);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<RelationshipCategoryType>(item?.Category ?? PersonRelationshipCategory.FAMILY)



    const isEdit = Boolean(item) && Boolean(item?.PersonalRelationshipID);
    const params: OwnerParams = {
        ownerType,
        requestType: ApiRequestType.CREATE_UPDATE,
        modelId: item?.PersonalRelationshipID,
        modelName: OwnerModelType.RELATIONSHIP,
        userId: user?.UserID,
        personId: contactId,
        householdId: householdId,
    };

    const createOrUpdate = async (values: PersonalRelationship, { setErrors }: IFormActionProps) => {
        notifications.toggleLoading(true);
        const finalOwnerType = isEdit ? OwnerType.PERSON : OwnerType.HOUSEHOLD
        try {
            values.Category = selectedCategory
            values.PersonID = contactId;

            await api.personalrelationship.createOrUpdate({...params, ownerType:finalOwnerType}, values);

            setErrors({ successMessage: `Relationship successfully ${createEditMessageText(item)}!`});
            //await onSelect({ person: person });
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
            await api.personalrelationship.remove(params, item);
            //onSelect({ person: person });
            onClose();
        } catch (err) {
            processServerError(err, 'RelationshipForm.remove');
        }
        notifications.toggleLoading(false);
    };

    /**
     * Type options filtered by category
     */
    const typeOptions = () => {
        return PersonRelationshipTypeOptions.filter(opt => opt.category === selectedCategory)
    }

    /**
     * Filter people for relationship
     */
    const peopleOptions = () => {
        const existingIDs = selectedRelationships?.map(rel => rel.AssociatePersonID) ?? []
        const list : Person[] = [];
        persons?.map(person => { 
            let exclude = existingIDs.filter(x => x == person.PersonID);
            console.log(exclude);
            exclude ? list.push(person) :  console.log("NULL");
        });
        
        return (            
            selectedCategory == PersonRelationshipCategory.FAMILY ? list?.filter(person => person.PersonID !== contactId).filter(person => person.PersonTypeID == 2 || person.PersonTypeID == 3).filter(person => !existingIDs.includes(person.PersonID))?? [] : list?.filter(person => person.PersonID !== contactId).filter(person => person.PersonTypeID == 4 || person.PersonTypeID == 5).filter(person => !existingIDs.includes(person.PersonID))?? []
        ).sort((a, b) => {
            return (a?.FirstName ?? "") < (b.FirstName ?? "") ? -1 : 1
        })
    }
   

    return (
        <>
            <Modal title={`${createEditHeaderText(item)} Relationship`} isOpen={isOpen} handleClose={onClose} width="sm" hideFooter={true}>
                <FormWrapper
                    initialValues={item ? item : initialValues}
                    validationSchema={validate}
                    onSubmit={createOrUpdate}>
                    <Grid container spacing={1}>
                        <Grid item>
                            <RelationshipCategorySelection selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}/>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={4}>
                            <InputField type="select"
                                        name="PersonalRelationshipTypeID"
                                        component={Input}
                                        placeholder="Type"
                                        label="Type"
                                        items={typeOptions()}
                                        labelField="title"
                                        valueField="value"
                                        required={true}/>
                        </Grid>
                        <Grid item xs={8}>
                            <InputField type="select"
                                        name="AssociatePersonID"
                                        component={SelectAutocomplete}
                                        templateComponent={SelectAvatarTemplate}
                                        placeholder="Person"
                                        label="Person"
                                        items={peopleOptions()}
                                        labelField="FirstName"
                                        valueField="PersonID"
                                        required={true} />
                        </Grid>
                    </Grid>
                    <DialogActions>
                        <Button
                            type="submit"
                            text={`${createEditHeaderSubmitText(item)} Relationship`}
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

export default RelationshipForm;
