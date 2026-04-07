import React, {ReactElement, useState} from 'react';
import {useStoreActions, useStoreState} from "~/store/hooks";
import Modal from "~/ui/components/Dialogs/Modal";
import {addEditHeaderText, addEditMessageText, hasItems} from "~/ui/constants/utils";
import FormWrapper from "~/ui/components/Forms/FormWrapper";
import initialValues from './form/initialValues';
import validate from './form/validate';
import api from "~/services/api";
import {extractServerError, processServerError} from "~/services/api/errors";
import {DialogActions, Grid, Button as MuiButton, Link} from "@material-ui/core";
import Button from "~/ui/components/Button";
import {IFormActionProps} from "~/types/forms";
import InputField from "~/ui/components/Forms/InputField";
import useNotifications from "~/ui/hooks/useNotifications";
import {Objective} from "~/types/api/objective";
import SelectAutocomplete from "~/ui/components/Forms/SelectAutocomplete";
import SelectAvatarTemplate from "~/ui/components/Forms/SelectAutocomplete/components/SelectAvatarTemplate";
import {ObjectiveStakeholder} from "~/types/api/objectiveStakeholder";
import {IObjectiveDataType} from "~/types/objective/store";
import ConfirmationModal from "~/ui/components/Dialogs/ConfirmationModal";
import useMountEvents from "~/ui/hooks/useMountEvents";
import {PersonType} from "~/ui/constants/api";
import EditContact from '../../Contact/EditContact';
import { Person } from '~/types/api/person';

interface IProps {
  objective: Objective;
  item?: ObjectiveStakeholder;
  personTypeFilters?: PersonType[];
  personNotTypeFilters?: PersonType[];
  isOpen: boolean;
  onClose: () => unknown;
}

const EditPriorityStakeholder = ({ objective, item, personTypeFilters, personNotTypeFilters, isOpen, onClose }: IProps): ReactElement => {
  const notifications = useNotifications();

  const { persons } = useStoreState(state => state.person);
  const { selectedHousehold } = useStoreState(state => state.household);
  const { onRefresh  } = useStoreActions(actions => actions.objective);

  const [filteredPersons, setFilteredPersons] = useState(persons);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showCreatePersonModal, setShowCreatePersonModal] = useState(false);
  const isEdit = Boolean(item) && Boolean(item?.ObjectiveStakeholderID);
  const isFamily = (personTypeFilters ? personTypeFilters?.indexOf(PersonType.FAMILY)  > -1 : false)
    || (personNotTypeFilters ? personNotTypeFilters?.indexOf(PersonType.FAMILY) < 0 : false);

  const createAndSelect = async (person : Person) => {
    initialValues.PersonID = person?.PersonID;
  }

  const createOrUpdate = async (values: ObjectiveStakeholder, { setErrors }: IFormActionProps) => {
    notifications.toggleLoading(true);
    try {
      const { HouseholdID } = selectedHousehold;
      values.ObjectiveID = objective?.ObjectiveID;
      // @ts-ignore
      // const res = await (!isEdit ? api.objectivestakeholder.create(HouseholdID, objective?.ObjectiveID, values) : api.objectivestakeholder.update(HouseholdID, objective?.ObjectiveID, item?.ObjectiveStakeholderID, values));
      const res = await api.objectivestakeholder.create(HouseholdID, objective?.ObjectiveID, values);
      if (!objective?.Stakeholders) objective.Stakeholders = [];
      objective.Stakeholders.push(res.data);
      const payload = {
        type: IObjectiveDataType.OBJECTIVE,
        objective,
        objectiveId: objective?.ObjectiveID
      };
      await onRefresh(payload);
      // await onSelect(payload);
      setErrors({ successMessage: `Stakeholder successfully ${addEditMessageText(item)}!`});
      handleClose();
    } catch (err) {
      setErrors({ backError: extractServerError(err) });
    }
    notifications.toggleLoading(false);
  };

  const remove = async () => {
    if (!item) return;
    notifications.toggleLoading(true);
    try {
      const { HouseholdID } = selectedHousehold;
      const res = await api.objectivestakeholder.remove(HouseholdID, objective?.ObjectiveID, item?.ObjectiveStakeholderID, item);
      handleClose();
    } catch (err) {
      processServerError(err, 'EditPriorityStakeholder.remove');
    }
    notifications.toggleLoading(false);
  };

  const filterAndSetPersons = () => {
    let ppl;
    if (hasItems(personTypeFilters) && personTypeFilters) {
      ppl = persons?.filter(s => {
        return s?.PersonTypeID ? (personTypeFilters?.indexOf(s?.PersonTypeID) > -1) : false;
      });

    } else if (hasItems(personNotTypeFilters) && personNotTypeFilters) {
      ppl = persons?.filter(s => {
        return s?.PersonTypeID ? (personNotTypeFilters?.indexOf(s?.PersonTypeID) < 0) : false;
      });
    } else {
      ppl = persons
    }

    if(objective?.Stakeholders && objective.Stakeholders.length >= 1)
    {
      ppl = ppl.filter(p => !objective.Stakeholders?.some(s => s.PersonID === p.PersonID));
    }
    ppl = ppl.filter(p => p.Deceased !== true)
    setFilteredPersons(ppl);
  }

  const handleClose = () => {
    initialValues.PersonID = undefined;
    onClose();
  }

  useMountEvents({
    onMounted: async () => {
      filterAndSetPersons();
    },
    onChange: async () => {
      filterAndSetPersons();
    },
    watchItems: [persons]
  });

  return (
    <>
      <Modal title={`${addEditHeaderText(item)} ${isFamily ? 'Family Member' : 'External Stakeholder'}`} isOpen={isOpen} handleClose={handleClose} width="sm" hideFooter={true}>
        <FormWrapper initialValues={isEdit ? item : initialValues} validationSchema={validate} onSubmit={createOrUpdate}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <InputField type="autocomplete"
                          name="PersonID"
                          component={SelectAutocomplete}
                          templateComponent={SelectAvatarTemplate}
                          isMultiselect={false}
                          placeholder="Person"
                          label="Person"
                          items={filteredPersons}
                          labelField="FullName"
                          valueField="PersonID"/>
            </Grid>
          </Grid>
          <DialogActions>
            <Button
              type="submit"
              text={`Add ${isFamily ? 'Family Member' : 'External Stakeholder'}`}
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
            <EditContact isOpen={showCreatePersonModal}
              onClose={() => setShowCreatePersonModal(false)} simple={true} persontype={isFamily ? PersonType.FAMILY : PersonType.PROFESSIONAL} selectPerson={createAndSelect}/>
          </DialogActions>
        </FormWrapper>
      </Modal>
    </>
  );
};

export default EditPriorityStakeholder;
