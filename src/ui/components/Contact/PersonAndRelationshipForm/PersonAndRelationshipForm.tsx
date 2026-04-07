import React, {ReactElement, useState} from 'react';
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
import {
  ApiRequestType,
  getPersonTypeFromPersonalRelationshipType,
  OwnerModelType,
  OwnerType
} from "~/ui/constants/api";
import initialValues from "~/ui/components/Contact/RelationshipForm/form/initialValues";
import useNotifications from "~/ui/hooks/useNotifications";
import useMountEvents from "~/ui/hooks/useMountEvents";
import useOnChange from "~/ui/hooks/useOnChange";
import {PersonalRelationshipType} from "~/types/api/personalRelationshipType";
import ConfirmationModal from "~/ui/components/Dialogs/ConfirmationModal";
import {
    InverzPersonRelationshipTypes,
    PersonRelationshipTypeEnum,
    PersonRelationshipTypeNames
} from "~/ui/constants/person";

interface IProps {
    item?: PersonalRelationship;
    relationshipTypeId?: number;
    ownerType: OwnerType,
    isOpen: boolean;
    onClose: () => unknown;
}

/**
 * This form was used for the quick add menu on the contact page
 * That menu is no longer needed. TODO: Remove the form in the future
 * @param item
 * @param ownerType
 * @param relationshipTypeId
 * @param isOpen
 * @param onClose
 * @constructor
 */
const PersonAndRelationshipForm = ({ item, ownerType, relationshipTypeId, isOpen, onClose }: IProps): ReactElement => {
    const notifications = useNotifications();

    const { user } = useStoreState(state => state.user);
    const { selectedHousehold } = useStoreState(state => state.household);
    const { selectedPerson } = useStoreState(state => state.person);
    const { onSelect, onPopulate } = useStoreActions(actions => actions.person);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const getRelationshipType = () => {
        if(relationshipTypeId) {
            return PersonRelationshipTypeNames[relationshipTypeId]
        }else{
            return ""
        }
    }

    const isEdit = Boolean(item) && Boolean(item?.PersonalRelationshipID);
    const params: OwnerParams = {
        ownerType,
        requestType: ApiRequestType.CREATE_UPDATE,
        modelId: item?.PersonalRelationshipID,
        modelName: OwnerModelType.RELATIONSHIP,
        userId: user?.UserID,
        personId: selectedPerson?.PersonID,
        householdId: selectedHousehold?.HouseholdID,
    };

    const createOrUpdate = async (values: any, { setErrors }: IFormActionProps) => {
        notifications.toggleLoading(true);
        try {

            // Create person
            // Person type
            const personTypeId = getPersonTypeFromPersonalRelationshipType(relationshipTypeId);
            const person = {
                FirstName: values.FirstName,
                LastName: values.LastName,
                Email: values.Email,
                PhoneMobile: values.PhoneMobile,
                PersonTypeID: personTypeId
            };

            let personResponse
            if (relationshipTypeId !== PersonRelationshipTypeEnum.CHILD) {
                // Create person
                params.modelName = OwnerModelType.PERSON;
                personResponse = await api.person.create(
                  {
                      ...params,
                      ownerType: OwnerType.HOUSEHOLD
                  },
                  person);
            } else {
                if (selectedPerson) {
                    // Create person
                    params.modelName = OwnerModelType.PERSON;
                    personResponse = await api.person.createChild(
                      selectedHousehold?.HouseholdID,
                      selectedPerson?.PersonID,
                      person);
                }
            }

            await onPopulate({});
            // Create relationship
            params.modelName = OwnerModelType.RELATIONSHIP;
            values.PersonID = selectedPerson?.PersonID;
            values.AssociatePersonID = personResponse?.data?.PersonID;
            await api.personalrelationship.createOrUpdate(
                {...params, ownerType: OwnerType.HOUSEHOLD},
                {
                    ...values,
                    PersonalRelationshipTypeID: relationshipTypeId,
                    AssociatePersonID: personResponse?.data?.PersonID
                });

            values.PersonID = personResponse?.data?.PersonID;
            values.AssociatePersonID = selectedPerson?.PersonID;
            await api.personalrelationship.createOrUpdate(
                {...params, ownerType: OwnerType.HOUSEHOLD},
                {
                    ...values,
                    PersonalRelationshipTypeID: InverzPersonRelationshipTypes[relationshipTypeId!],
                    AssociatePersonID: personResponse?.data?.PersonID
                });

            setErrors({ successMessage: `Relationship successfully ${createEditMessageText(item)}!`});
            await onPopulate({});
            await onSelect({ person: selectedPerson });
            onClose();
        } catch (err) {
            setErrors({ backError: extractServerError(err) });
            processServerError(err, 'PersonAndRelationshipForm.createOrUpdate');
        }
        notifications.toggleLoading(false);
    };

    const remove = async () => {
        if (!item) return;
        notifications.toggleLoading(true);
        try {
            params.requestType = ApiRequestType.REMOVE;
            const res = await api.personalrelationship.remove(params, item);
            onPopulate(null);
            onSelect({ person: null });
            onClose();
        } catch (err) {
            processServerError(err, 'PersonAndRelationshipForm.remove');
        }
        notifications.toggleLoading(false);
    };

    return (
        <>
            <Modal title={`${createEditHeaderText(item)} ${getRelationshipType()}`} isOpen={isOpen} handleClose={onClose} width="sm" hideFooter={true}>
                <FormWrapper initialValues={item ? item : initialValues} validationSchema={validate} onSubmit={createOrUpdate}>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <InputField type="text"
                                        name="FirstName"
                                        component={Input}
                                        placeholder="First Name"
                                        label="First Name"
                                        required={true}/>
                        </Grid>
                        <Grid item xs={6}>
                            <InputField type="text"
                                        name="LastName"
                                        component={Input}
                                        placeholder="Last Name"
                                        label="Last Name"
                                        required={true}/>
                        </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <InputField type="tel"
                                        name="PhoneMobile"
                                        component={Input}
                                        placeholder="Phone Mobile"
                                        label="Phone Mobile" />
                        </Grid>
                        <Grid item xs={6}>
                            <InputField type="email"
                                        name="EmailAddress"
                                        component={Input}
                                        placeholder="Email Address"
                                        label="Email Address" />
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

export default PersonAndRelationshipForm;
