import React, { useState } from "react";
import styles from "./InterviewAdditionalPriorityContent.module.scss";
import classnames from "classnames";
import {useStoreActions, useStoreState} from "~/store/hooks";
import {
  ButtonGroup,
  Grid,
  Button as MaterialButton,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText
} from "@material-ui/core";
import { Objective } from "~/types/api/objective";
import Button from "~/ui/components/Button";
import EditPriorityForm from "~/ui/components/Priorities/EditPriorityFormModal";
import { IFormActionProps, IFormInputValue } from "~/types/forms";
import { createOrUpdateDirect } from "~/ui/components/Priorities/EditPriorityFormContent/EditPriorityFormContent";
import useNotifications from "~/ui/hooks/useNotifications";
import { IObjectiveDataType } from "~/types/objective/store";
import { createEditMessageText, isNullOrUndefined } from "~/ui/constants/utils";
import { BOTH_PERSONS_OPTION } from "~/services/interview";
import useMountEvents from "~/ui/hooks/useMountEvents";
import { getBothPhotoSrc, getFirstName, getFullName, getPersonTypeEnum, getPhotoUrlOrDefault } from "~/ui/constants/user";
import ConfirmationModal from "~/ui/components/Dialogs/ConfirmationModal";
import FormWrapper from "~/ui/components/Forms/FormWrapper";
import InputField from "~/ui/components/Forms/InputField";
import Input from "~/ui/components/Forms/Input";
import SelectAutocomplete from "~/ui/components/Forms/SelectAutocomplete";
import SelectAvatarTemplate from "~/ui/components/Forms/SelectAutocomplete/components/SelectAvatarTemplate";
import { InterviewResponse } from "~/types/api/interviewResponse";
import api from "~/services/api";
import validate from "./form/validate";
import { AxiosResponse } from "axios";
import { extractServerError } from "~/services/api/errors";
import inputStyles from "~/ui/components/Forms/InputField/InputField.module.scss";

interface IProps {
  priority: Objective;
  metricOfSuccessID: Number;
  dimensionOfLifeID: Number;
}

const InterviewAdditionalPriorityContent = ({priority, metricOfSuccessID, dimensionOfLifeID}: IProps) => {
  const notifications = useNotifications();

  const { selectedInterview } = useStoreState((state) => state.interview);
  const { selectedHousehold } = useStoreState((state) => state.household);

  const { persons } = useStoreState((state) => state.person);

  const {onSelect, onRemove, onPopulate, onRefresh} = useStoreActions(actions => actions.objective);

  const isSaved = !isNullOrUndefined(priority?.ObjectiveID);

  const [showForm, setInlineFormVisibility] = useState<boolean>(false);
  const [editPriority, setEditPriority] = React.useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [person, setPerson] = useState<any>();
  const [response, setResponse] = useState<InterviewResponse>();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [objectiveDescription, setObjectiveDescription] = React.useState(priority?.Description);

  const initialValues = {
    PersonID: priority.PersonID,
    Description: priority.Description,
    WhyIsThisImportant: response?.WhyIsThisImportant,
    ResponseText: response?.ResponseText
  }

  const toggleEditPriority = () => {
    setEditPriority(!editPriority);
  }

  const isBoth = () => {
    return !isNullOrUndefined(response?.AppliesTo) && response?.AppliesTo === 0;
  }

  const deleteItem = () => {
    onRemove({
      type: IObjectiveDataType.OBJECTIVE,
      objective: priority,
      objectiveId: priority?.ObjectiveID
    });
  }

  const updateFields = async (fields: IFormInputValue[]) => {
    let updated = Object.assign({}, priority);
    if (fields) {
      fields?.forEach(f => {
        if (f.field) {
          updated = { ...updated, [f.field]: f.value };
        }
      })
    }

    await createOrUpdateDirect(
      updated as Objective,
      selectedInterview?.Interview?.HouseholdID,
      selectedInterview?.Interview?.InterviewID,
      notifications,
      onRefresh,
      undefined);
  }

  const handleSelect = async () => {
    onSelect({
      type: IObjectiveDataType.OBJECTIVE,
      objective: priority,
      objectiveId: priority?.ObjectiveID
    });
  }

  /**
   * Create or update the response.
   * @param values
   * @param setErrors
   */
   const createOrUpdate = async (values: any, { setErrors }: IFormActionProps) => {
    if (!showForm) return;
    if(isNullOrUndefined(objectiveDescription)) {
      return;
    }

    setIsSubmitting(true);
    
    let responseValues = {
      AppliesTo: values?.PersonID,
      WhyIsThisImportant: values?.WhyIsThisImportant,
      ResponseText: values?.ResponseText
    }
    notifications.toggleLoading(true);
    try {
      // Create or update response
      const res: AxiosResponse = await (response?.InterviewResponseID ?
          api.interviewresponse.update(
              selectedInterview?.Interview?.HouseholdID,
              selectedInterview?.Interview?.InterviewID,
              response?.InterviewResponseID,
              responseValues) :
          api.interviewresponse.create(
              selectedInterview?.Interview?.HouseholdID,
              selectedInterview?.Interview?.InterviewID,
              0,
              responseValues));
      await handleSelect();

      const objectiveResult = await api.objective.update(
        selectedInterview?.Interview?.HouseholdID,
        selectedInterview?.Interview?.InterviewID,
        priority?.ObjectiveID,
        {
          ...priority,
          Description: objectiveDescription,
          PersonID: res?.data?.AppliesTo,
          ClientID: res?.data?.AppliesTo,
          InterviewResponseID: res?.data?.InterviewResponseID,
        });

        
      setResponse(res?.data);
      await onRefresh({
          type: IObjectiveDataType.OBJECTIVE,
          objective: objectiveResult?.data,
          objectiveId: objectiveResult?.data?.ObjectiveID
      });

      notifications.addSuccessNotification("Response added successfully!");
      setErrors({ successMessage: `Response successfully ${createEditMessageText(response?.InterviewResponseID)}!`});
      setIsSubmitting(false);
      setInlineFormVisibility(false);
    } catch (err) {
      setErrors({ backError: extractServerError(err) });
    }
    notifications.toggleLoading(false);
  };

  const populatePerson = () => {
    if (priority?.PersonID && (Number(priority?.PersonID) !== 0)) {
      setPerson(persons?.find(p => p.PersonID === priority?.PersonID));
    } else if (Number(priority?.PersonID) == 0) {
      setPerson(BOTH_PERSONS_OPTION);
    } else {
      setPerson(undefined);
    }
  }

  const populateResponse = async () => {
    const res = await api.interviewresponse.get(selectedInterview?.Interview?.HouseholdID, selectedInterview?.Interview?.InterviewID, priority?.InterviewResponseID as number);
    setResponse(res?.data as InterviewResponse);
  }

  useMountEvents({
    onMounted: async () => {
      populatePerson();
      populateResponse();
    },
    onChange: async () => {
      populatePerson();
      populateResponse();
    },
    watchItems: [priority?.PersonID, priority?.InterviewResponseID]
  });

  return (
    <>
      <FormWrapper initialValues={initialValues}
                   validationSchema={validate}
                   onSubmit={createOrUpdate}
                   className={classnames({ [styles.unsaved]: !isSaved } )}>
        <div className={classnames(styles.response_container)}>
          <Grid container spacing={1}>
            <Grid item xs={2}>
              { !showForm && isBoth() ?
                <ListItem className={classnames(styles.avatar, styles.question_clickable)}
                          onClick={() => {
                            handleSelect();
                            setInlineFormVisibility(true)
                          }}>
                  <ListItemAvatar>
                    <Avatar variant="square">
                      <Avatar variant="square" className={classnames(styles.avatar)} src={getBothPhotoSrc()} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Both"  />
                </ListItem>
                : null }
              { !showForm && !isBoth() && person ?
                <ListItem className={classnames(styles.avatar, styles.question_clickable)}
                          onClick={() => {
                            handleSelect();
                            setInlineFormVisibility(true)
                          }}>
                  <ListItemAvatar>
                    <Avatar variant="square">
                      <Avatar variant="square" className={classnames(styles.avatar)} src={getPhotoUrlOrDefault(person)} />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={getFullName(person)}
                                secondary={getPersonTypeEnum(person?.PersonTypeID)}  />
                </ListItem>
                : null }
              { showForm ?
                  <InputField type="autocomplete"
                              name="PersonID"
                              component={SelectAutocomplete}
                              templateComponent={SelectAvatarTemplate}
                              items={selectedHousehold?.Persons ? [...selectedHousehold?.Persons, BOTH_PERSONS_OPTION] : [BOTH_PERSONS_OPTION]}
                              label="Client"
                              labelField="FullName"
                              valueField="PersonID"
                              value={priority?.PersonID}
                              orientation="horizontal"
                              disableClearable={true}/>
              : null }
            </Grid>
            <Grid item xs={4}>
              <div className={classnames(styles.text_body, { [styles.question_clickable]: (!showForm) })}
                   onClick={() => {
                     handleSelect();
                     if(!showForm) setInlineFormVisibility(true);
                   }}>
                { showForm ?
                    <InputField type="textarea"
                                name="ResponseText"
                                component={Input}
                                label="ResponseText"
                                placeholder="ResponseText"/>
                    : <span>{priority?.Description}</span> }
              </div>
            </Grid>
              <Grid item xs={4}>
                <div className={classnames(styles.text_body, { [styles.question_clickable]: (!showForm) })}
                     onClick={() => {
                       handleSelect();
                       if(!showForm) setInlineFormVisibility(true);
                     }}>
                  { showForm ?
                      <InputField type="textarea"
                                  name="WhyIsThisImportant"
                                  component={Input}
                                  label="Why is this important?"
                                  placeholder="Why is this important?"/>
                    : <span>{response?.WhyIsThisImportant}</span> }
                </div>
              </Grid>
            <Grid item xs={2}>
              <div className={styles.buttons_container}>
                <ButtonGroup variant="text" color="default" fullWidth>
                  { showForm ?
                    <Button
                      type="submit"
                      text="Save"
                      color="default" />
                    : null }
                  { !showForm ?
                    <MaterialButton
                      type="button"
                      color="default"
                      onClick={() => {
                        handleSelect();
                        setInlineFormVisibility(!showForm);
                      }}>
                      Edit
                    </MaterialButton>
                    : null }
                  { !showForm && !isSaved ?
                    <Button
                      type="submit"
                      text="Cancel"
                      color="default"
                      onClick={() => {
                        handleSelect();
                        setInlineFormVisibility(!showForm);
                      }}/>
                    : null }
                  { showForm ?
                    <Button
                      type="submit"
                      text="Cancel"
                      color="default"
                      onClick={() => {
                        handleSelect();
                        setInlineFormVisibility(!showForm);
                      }}/>
                    : null }
                  { !showForm && isSaved ?
                    <Button
                      type="button"
                      text={`Delete`}
                      color="default"
                      onClick={() => {
                        handleSelect();
                        setShowDeleteConfirmation(true);
                      }}/>
                    : null }
                  <ConfirmationModal isOpen={showDeleteConfirmation}
                      onConfirm={deleteItem}
                      onCancel={() => {
                        handleSelect();
                        setShowDeleteConfirmation(false);
                      }}/>
                </ButtonGroup>
              </div>
              {/* <div className={styles.star}>
                <div className={styles.buttons_container}>
                  <Tooltip title="Add/Remove from Starred Responses">
                    <IconButton className={classnames({ [styles.star_filled]: response.Starred })}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  toggleStarred();
                                  setIsCurrentlyStarred(!isCurrentlyStarred);
                                }}
                                onFocus={(event) => event.stopPropagation()}
                                aria-label="question-star">
                      <Icon>{ response?.Starred ? 'star' : 'star_border'}</Icon>
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Add/Remove from Hidden Responses">
                    <IconButton onClick={(event) => {
                                  event.stopPropagation();
                                  toggleHidden();
                                  setIsCurrentlyHidden(!isCurrentlyHidden);
                                }}
                                onFocus={(event) => event.stopPropagation()}
                                aria-label="question-eye">
                      <Icon>{ response?.Hidden ? 'visibility_off' : 'visibility'}</Icon>
                    </IconButton>
                  </Tooltip>
                  </div>
              </div> */}
            </Grid>
          </Grid>
          { showForm ?
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <div className={classnames(styles.text_body, { [styles.question_clickable]: !showForm, [styles.headline_required]: isSubmitting && isNullOrUndefined(objectiveDescription) })}
                      onClick={() => {
                        if(!showForm) setInlineFormVisibility(true);
                      }}>
                    { showForm ?
                      <div>
                        <Input type="textarea"
                              label="What would be the headline for this priority?"
                              field={{
                                name: "objectiveDescription",
                                value: objectiveDescription,
                                onChange: (event: any) => setObjectiveDescription(event?.target?.value)
                              }} />
                        { isSubmitting && isNullOrUndefined(objectiveDescription) ?
                          <div className={inputStyles.input_error}>
                            Field is required
                          </div>
                          : null }
                      </div>
                      : `${priority?.Description}` }
                  </div>
                </Grid>
              </Grid>
              : null }
          {/* { !isSaved ?
            <div className="m-t-10 text-right">
              <Chip className={styles.unsaved_text}
                    label="Unsaved"
                    size="small" />
            </div>
            : null} */}
        </div>
      </FormWrapper>
      <EditPriorityForm item={priority}
            isOpen={editPriority}
            onClose={() => setEditPriority(false)}></EditPriorityForm>
    </>
  );
}

export default InterviewAdditionalPriorityContent;
