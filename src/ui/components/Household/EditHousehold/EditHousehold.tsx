import React, { ReactElement, useEffect, useState } from 'react';
import initialValues from './form/initialValues';
import validate from './form/validate';
import InputField from "~/ui/components/Forms/InputField";
import Input from "~/ui/components/Forms/Input";
import FormWrapper from "~/ui/components/Forms/FormWrapper";
import Button from "~/ui/components/Button";
import Modal from "~/ui/components/Dialogs/Modal";
import api from "~/services/api";
import { extractServerError } from "~/services/api/errors";
import { Household } from "~/types/api/household";
import { Checkbox, DialogActions } from "@material-ui/core";
import { useStoreActions, useStoreState } from "~/store/hooks";
import { createEditHeaderSubmitText, createEditHeaderText } from "~/ui/constants/utils";
import { IFormActionProps } from "~/types/forms";
import ConfirmationModal from "~/ui/components/Dialogs/ConfirmationModal";
import { OwnerParams } from '~/types/relations';
import { ApiRequestType, OwnerModelType, OwnerType, PersonType } from '~/ui/constants/api';
import { Person } from '~/types/api/person';
import { FamilyTitle, PersonTitle } from "~/ui/constants/person";
import router from 'next/router';
import { AxiosResponse } from 'axios';
import useSWR, { mutate } from 'swr';
import privateAxios from '~/services/api/privateAxios';
import { getAccessToken } from '~/services/auth';
import { fetcher } from '~/types/api/fetcher';

interface IProps {
  household?: Household;
  isOpen: boolean;
  onClose: () => unknown;
  PermissionEdit: Boolean|null;
}

const EditHousehold = ({ PermissionEdit, household, isOpen, onClose }: IProps): ReactElement => {
  const { householdId } = useStoreState(state => state.selected);
  const urlHousehold = `${process.env.NEXT_PUBLIC_API_URL}/household/${householdId}`;
  const {data: selectedHousehold} = useSWR<Household>([urlHousehold, getAccessToken()], fetcher, { refreshInterval: 1000 });

  const url = `${process.env.NEXT_PUBLIC_API_URL}/household/${household?.HouseholdID}/person/list`;
  const { data: persons} = useSWR<Person[]>([url, getAccessToken()], fetcher);

  const spouses = persons?.filter((person: Person) => ([PersonType.PRIMARY] || [PersonType.HOUSEHOLD])
              .some((type) => type === person.PersonTypeID));

  //const { selectedHousehold } = useStoreState((state) => state.household);
  //const { select, onPopulate, populate, onSelect, onRemove } = useStoreActions(actions => actions.household);
  //const profileActions = useStoreActions(actions => actions.person);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const { user } = useStoreState(state => state.user);
  const [permissionEdit,setpermissionEdit]=useState<Boolean|null>(PermissionEdit)

  useEffect(()=>{
    setpermissionEdit(PermissionEdit)
  })

  // Set household being edited if ID is specified
  const isEdit = Boolean(household?.HouseholdID);
  const editValues = {
    HouseholdName: household?.HouseholdName,
    // EvaluationID: evaluations.find((evaluation: ClientEvaluation) => evaluation.HouseholdID === household?.HouseholdID)?.ClientEvaluationID,
    Spouse1FirstName: spouses?.find(person => person.PersonID == household?.PrimaryPerson1ID)?.FirstName,
    Spouse1LastName: spouses?.find(person => person.PersonID == household?.PrimaryPerson1ID)?.LastName,
    Spouse2FirstName: spouses?.find(person => person.PersonID == household?.PrimaryPerson2ID)?.FirstName,
    Spouse2LastName: spouses?.find(person => person.PersonID == household?.PrimaryPerson2ID)?.LastName,
    LiveData: household?.LiveData,
  }
  const selected = isEdit ? editValues : initialValues;

  const params: OwnerParams = {
    ownerType: OwnerType.HOUSEHOLD,
    requestType: ApiRequestType.CREATE_UPDATE,
    // modelId: person?.PersonID,
    modelName: OwnerModelType.PERSON,
    userId: user?.UserID,
    // personId: person?.PersonID,
    // householdId: selectedHousehold?.HouseholdID,
  };

  // Create household action
  const createOrUpdate = async (values: any, { setErrors }: IFormActionProps) => {
    try {
      const updatedHousehold: Household = household ? household : {} as Household;
      updatedHousehold.HouseholdName = values?.HouseholdName;
      updatedHousehold.LiveData = values?.LiveData;

      if (!household?.HouseholdID && values?.Spouse2FirstName)
        updatedHousehold.PrimaryPerson2ID = 1;

      const res = await (household?.HouseholdID ? api.household.update(household?.HouseholdID, updatedHousehold) : api.household.create(updatedHousehold));

      //updating selected household on creating new household
      //onSelect({ household: res.data })

      setErrors({ successMessage: 'Household successfully created!' });

      if (values?.Spouse1FirstName) {
        params.modelId = res.data?.PrimaryPerson1ID;
        params.personId = res.data?.PrimaryPerson1ID;
        params.householdId = res.data?.HouseholdID;
        const updatedSpouse = (res.data?.PrimaryPerson1ID ? (await api.person.get(res.data?.PrimaryPerson1ID as number, res.data?.HouseholdID as number)).data : {}) as Person;
        updatedSpouse.FirstName = values?.Spouse1FirstName;
        updatedSpouse.LastName = values?.Spouse1LastName;
        updatedSpouse.HouseholdID = res.data?.HouseholdID;
        updatedSpouse.PersonTypeID = PersonType.PRIMARY;
        updatedSpouse.PersonTitleID = FamilyTitle.PRIMARY

        const updatedPerson = await api.person.createOrUpdate(params, updatedSpouse);
        updatedHousehold.PrimaryPerson1ID = updatedPerson.data.PersonID
        setErrors({ successMessage: 'Spouse 1 successfully created!' });
      }

      if (values?.Spouse2FirstName) {
        params.modelId = res.data?.PrimaryPerson2ID;
        params.personId = res.data?.PrimaryPerson2ID;
        params.householdId = res.data?.HouseholdID;
        const updatedSpouse = (res.data?.PrimaryPerson2ID ? (await api.person.get(res.data?.PrimaryPerson2ID as number, res.data?.HouseholdID as number)).data : {}) as Person;
        updatedSpouse.FirstName = values?.Spouse2FirstName;
        updatedSpouse.LastName = values?.Spouse2LastName;
        updatedSpouse.HouseholdID = res.data?.HouseholdID;
        updatedSpouse.PersonTypeID = PersonType.FAMILY;
        updatedSpouse.PersonTitleID = FamilyTitle.PRIMARY
        const updatedPerson = await api.person.createOrUpdate(params, updatedSpouse);
        updatedHousehold.PrimaryPerson2ID = updatedPerson.data.PersonID
        setErrors({ successMessage: 'Spouse 2 successfully created!' });
      }

      await api.household.update(updatedHousehold.HouseholdID, updatedHousehold)
      //await profileActions.onPopulate({})
      //onPopulate(null);
      mutate(urlHousehold);
      mutate('household/list');
      onClose();
    } catch (err) {
      //setErrors({ backError: extractServerError(err) });
    }

  };


  // Delete
  const remove = async () => {
    if (!household?.HouseholdID) {
      return;
    }
    // onRemove({
    //   householdID: household?.HouseholdID,
    //   household: selectedHousehold
    // });

    await api.household.remove(household?.HouseholdID, household);
    //onSelect(null);
    // onPopulate(null);
    // populate(null);
    mutate(urlHousehold);
    mutate('household/list');
    onClose();
  }
  return (
    <>
      <Modal title={`${createEditHeaderText(household?.HouseholdID)} Household`} isOpen={isOpen} handleClose={onClose} width="sm" hideFooter={true}>
        <FormWrapper initialValues={selected}
          validationSchema={validate}
          onSubmit={createOrUpdate}
          modelName="Household">
          <div>
            <InputField type="text"
              name="HouseholdName"
              component={Input}
              placeholder="Household Name"
              label="Household Name"
              required={true} />
            <InputField type="text"
              name="Spouse1FirstName"
              component={Input}
              placeholder="Spouse 1 First Name"
              label="Spouse 1 First Name"
              required={false} />
            <InputField type="text"
              name="Spouse1LastName"
              component={Input}
              placeholder="Spouse 1 Last Name"
              label="Spouse 1 Last Name"
              required={false} />
            <InputField type="text"
              name="Spouse2FirstName"
              component={Input}
              placeholder="Spouse 2 First Name"
              label="Spouse 2 First Name"
              required={false} />
            <InputField type="text"
              name="Spouse2LastName"
              component={Input}
              placeholder="Spouse 2 Last Name"
              label="Spouse 2 Last Name"
              required={false} />
            {/* <InputField type="checkbox"
              name="LiveData"
              component={Input}
              placeholder="Live Data"
              label="Live Data"
              required={false} /> */}
          </div>
          <DialogActions>
            <Button
              type="submit"
              text={`${createEditHeaderSubmitText(household?.HouseholdID)} Household`}
              variant="contained"
              size="large"
              color="primary"
            />
            {isEdit ?
              <>
                {permissionEdit ?
                  null :
                  <Button
                    type="button"
                    text={`Delete`}
                    variant="contained"
                    size="large"
                    color="default"
                    onClick={() => setShowDeleteConfirmation(true)}
                  />
                }
              </>
              : null}
            <ConfirmationModal isOpen={showDeleteConfirmation}
              onConfirm={remove}
              onCancel={() => setShowDeleteConfirmation(false)} />
          </DialogActions>
        </FormWrapper>
      </Modal>
    </>
  );
};

export default EditHousehold;
