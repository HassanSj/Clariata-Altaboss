import React, {useEffect, useState} from "react";
import {WizardState, WizardStep} from "~/types/wizard/wizard";
import {QuestionAndResponse} from "~/types/api/questionAndResponse";
import styles from "./InterviewStepQuestionResponseUpdated.module.scss";
import classnames from "classnames";
import {InterviewResponse} from "~/types/api/interviewResponse";
import {
  Avatar,
  Button as MaterialButton,
  ButtonGroup,
  Checkbox,
  Chip,
  Grid,
  Icon,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
  Tooltip
} from "@material-ui/core";
import {useStoreActions, useStoreState} from "~/store/hooks";
import {Person} from "~/types/api/person";
import api from "~/services/api";

import {createEditMessageText, isNullOrUndefined} from "~/ui/constants/utils";
import Button from "~/ui/components/Button";
import {getBothPhotoSrc, getFullName, getPersonTypeEnum} from "~/ui/constants/user";
import InterviewStepQuestionResponseForm from "~/ui/components/Wizard/Interviews/InterviewStepQuestionResponseForm";
import useNotifications from "~/ui/hooks/useNotifications";
import {IFormActionProps} from "~/types/forms";
import {extractServerError, processServerError, IError} from "~/services/api/errors";
import initialValues from './form/initialValues';
import validate from './form/validate';
import validateDream from './form/validateDream';
import FormWrapper from "~/ui/components/Forms/FormWrapper";
import InputField from "~/ui/components/Forms/InputField";
import Input from "~/ui/components/Forms/Input";
import inputStyles from "~/ui/components/Forms/InputField/InputField.module.scss";
import useMountEvents from "~/ui/hooks/useMountEvents";
import SelectAutocomplete from "~/ui/components/Forms/SelectAutocomplete";
import SelectAvatarTemplate from "~/ui/components/Forms/SelectAutocomplete/components/SelectAvatarTemplate";
import {removeItemAtIndex} from "~/ui/constants/data";
import {WizardDataType, WizardType} from "~/ui/constants/wizard";
import {Objective} from "~/types/api/objective";
import {AxiosResponse} from "axios";
import ConfirmationModal from "~/ui/components/Dialogs/ConfirmationModal";
import {IObjectiveDataType} from "~/types/objective/store";
import {BOTH_PERSONS_OPTION} from "~/services/interview";
import {getPhotoUrlOrDefault} from "~/ui/constants/user";
import { InterviewDataType } from "~/ui/constants/interview";

interface IProps {
  wizard: WizardState;
  step: WizardStep;
  subStep: WizardStep;
  question: QuestionAndResponse;
  questionIndex: number;
  response: InterviewResponse;
  responseIndex: number;
  parentQuestionIndex: number | undefined;
  isDiscoverInterview: boolean;
  isNew?: boolean;
  allSelected?: boolean;
  isForReport?: boolean;
  detectChange?: (change: boolean) => unknown;
}

const useStyles = makeStyles(theme => ({
  iconButtonLabel: {
    display: 'flex',
    flexDirection: 'column',
  },
}));

const InterviewStepQuestionResponse = ({ wizard,
                                         step,
                                         subStep,
                                         question,
                                         questionIndex,
                                         response,
                                         responseIndex,
                                         parentQuestionIndex,
                                         isDiscoverInterview,
                                         isNew = false,
                                         allSelected = false,
                                         isForReport = false,
                                         detectChange
}: IProps) => {
  const notifications = useNotifications();

  const { households, selectedHousehold } = useStoreState((state) => state.household);
  const { persons } = useStoreState((state) => state.person);
  const { selectedInterview } = useStoreState((state) => state.interview);
  const { onSubmitResponse, onSetIsSaved } = useStoreActions(actions => actions.interview);
  const { onSelect, onUpdateResponse, onRemoveResponse, onToggleShowResponseForm, onToggleStarredResponse, onToggleHiddenResponse } = useStoreActions(actions => actions.wizard);
  const { activeSubStep, activeQuestion, activeResponse, activeResponseIndex, activeResponseId, showResponseForm } = useStoreState(state => state.wizard);
  const { objectives } = useStoreState((state) => state.objective);
  const objectiveActions = useStoreActions(actions => actions.objective);

  // Set household being edited if ID is specified
  const isSaved = !isNullOrUndefined(response?.InterviewResponseID);
  const isEdit = Boolean(response?.InterviewResponseID);
  const isAlternate = (responseIndex % 2 === 0);
  const isDreamInterview = (wizard?.type === WizardType.DREAM_INTERVIEW);

  // Local state
  const [objectiveDescription, setObjectiveDescription] = React.useState<string>();
  const [WhyIsThisImportant, setWhyIsThisImportant] = React.useState<string>();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showEdit, setShowEdit] = React.useState(false);
  const [person, setPerson] = React.useState<Person | undefined>();
  const [objective, setObjective] = React.useState<Objective | undefined>();

  // Detecting change on input fields
  const [clientChanged, setClientChanged] = React.useState<boolean>(false);
  const [priorityChanged, setPriorityChanged] = React.useState<boolean>(false);
  const [whyChanged, setWhyChanged] = React.useState<boolean>(false);

  
  const [unsavedStarred,toggleUnsavedStarred] = React.useState<boolean>(false);
  const [unsavedHidden,toggleUnsavedHidden] = React.useState<boolean>(false);

  // starred/hidden
  const [isCurrentlyHidden, setIsCurrentlyHidden] = React.useState<boolean>(response?.Hidden as boolean);
  const [isCurrentlyStarred, setIsCurrentlyStarred] = React.useState<boolean>(response?.Starred as boolean);

  const primaryPersons = persons?.filter(p => p?.PersonID == selectedHousehold?.PrimaryPerson1ID || p?.PersonID == selectedHousehold?.PrimaryPerson2ID);
  const [selectablePersons, setSelectablePersons] = React.useState((primaryPersons && primaryPersons?.length > 1) ? [...primaryPersons, BOTH_PERSONS_OPTION] : (primaryPersons && primaryPersons?.length == 1) ? [primaryPersons[0]] : [BOTH_PERSONS_OPTION]);

  const classes = useStyles();

  const [editKey, setEditKey] = React.useState<number>(0);


  const toggleStarred = async (newResponse?: InterviewResponse) => {

    const currentResponse = newResponse ? newResponse : response;

    try {
      if(isCurrentlyHidden != isCurrentlyStarred && isCurrentlyHidden)
      {
        await onToggleHiddenResponse({
          parentIndex: parentQuestionIndex,
          response: currentResponse,
          responseIndex,
          questionIndex,
          hidden: !isCurrentlyHidden
        });
        setIsCurrentlyHidden(!isCurrentlyHidden);
      }

      const newValue = {
        ...currentResponse,
        Starred: !isCurrentlyStarred
      };

      const res: AxiosResponse = await(!isCurrentlyStarred ?
        api.interviewresponse.addStarred(selectedHousehold?.HouseholdID, currentResponse.InterviewID as number, currentResponse.InterviewResponseID as number) :
        api.interviewresponse.removeStarred(selectedHousehold?.HouseholdID, currentResponse.InterviewID as number, currentResponse.InterviewResponseID as number));
      await onToggleStarredResponse({
        parentIndex: parentQuestionIndex,
        response: currentResponse,
        responseIndex,
        questionIndex,
        starred: !isCurrentlyStarred
      })
      setIsCurrentlyStarred(!isCurrentlyStarred);
    } catch (err) {
      processServerError(err, 'InterviewStepResponse.toggleStarred');
    }
  }

  const toggleHidden = async (newResponse?: InterviewResponse) => {

    const currentResponse = newResponse ? newResponse : response;

    try {
      if(isCurrentlyHidden != isCurrentlyStarred && isCurrentlyStarred)
      {
        await onToggleStarredResponse({
          parentIndex: parentQuestionIndex,
          response : currentResponse,
          responseIndex,
          questionIndex,
          starred: !isCurrentlyStarred
        });
        setIsCurrentlyStarred(!isCurrentlyStarred);
      }

      await(!isCurrentlyHidden ?
        api.interviewresponse.addHidden(selectedHousehold?.HouseholdID, currentResponse.InterviewID as number, currentResponse.InterviewResponseID as number) :
        api.interviewresponse.removeHidden(selectedHousehold?.HouseholdID, currentResponse.InterviewID as number, currentResponse.InterviewResponseID as number));
      await onToggleHiddenResponse({
        parentIndex: parentQuestionIndex,
        response: currentResponse,
        responseIndex,
        questionIndex,
        hidden: !isCurrentlyHidden
      })
      setIsCurrentlyHidden(!isCurrentlyHidden);
    } catch (err) {
      processServerError(err, 'InterviewStepResponse.toggleHidden');
    }

  }

  useEffect(() => setChecked(allSelected), [allSelected]);
  if(detectChange)
  {
    useEffect(() => {detectChange((clientChanged || priorityChanged || whyChanged))}, [clientChanged, priorityChanged, whyChanged]);
  }

  const [headlineError, setHeadlineError] = React.useState<boolean>(false)

  /**
   * Create or update the response.
   * @param values
   * @param setErrors
   */
  const createOrUpdate = async (values: InterviewResponse, { setErrors }: IFormActionProps) => {
    if( isDreamInterview && !objectiveDescription){
      setHeadlineError(true)
      return
    }else{
      setHeadlineError(false)
    }

    if (!showForm()) return;
    // Make sure objective headline is set
    if (isDreamInterview && isNullOrUndefined(objectiveDescription)) {
      return;
    }
    setIsSubmitting(true);
    notifications.toggleLoading(true);
    try {
      // Create or update response
      const res: AxiosResponse = await (response?.InterviewResponseID ?
          api.interviewresponse.update(
              selectedInterview?.Interview?.HouseholdID,
              selectedInterview?.Interview?.InterviewID,
              response?.InterviewResponseID,
              values) :
          api.interviewresponse.create(
              selectedInterview?.Interview?.HouseholdID,
              selectedInterview?.Interview?.InterviewID,
              question?.Question?.QuestionID,
              values));
      // Create or update objective for dream interview
      if (isDreamInterview) {
        if (response?.InterviewResponseID && objective) {
          const objectiveResult = await api.objective.update(
            selectedInterview?.Interview?.HouseholdID,
            selectedInterview?.Interview?.InterviewID,
            objective?.ObjectiveID,
            {
              ...objective,
              Description: objectiveDescription,
              PersonID: res?.data?.AppliesTo,
              ClientID: res?.data?.AppliesTo,
              Champion: res?.data?.AppliesTo,
              InterviewResponseID: res?.data?.InterviewResponseID,
            });

          setObjective(objectiveResult?.data);
          setObjectiveDescription(objectiveResult?.data.Description);
          setWhyIsThisImportant(objectiveResult?.data.Why);
        } else if (!response?.InterviewResponseID
          && subStep?.metricOfSuccess?.MetricOfSuccessID
          && subStep?.dimensionOfLife?.DimensionOfLifeID) {
          const objectiveResult = await api.objective.create(
            selectedInterview?.Interview?.HouseholdID,
            selectedInterview?.Interview?.InterviewID,
            {
              InterviewID: selectedInterview?.Interview?.InterviewID,
              QuestionID: question?.Question?.QuestionID,
              InterviewResponseID: res?.data?.InterviewResponseID,
              MetricOfSuccessID: subStep?.metricOfSuccess?.MetricOfSuccessID,
              DimensionOfLifeID: subStep?.dimensionOfLife?.DimensionOfLifeID,
              Description: objectiveDescription,
              PersonID: res?.data?.AppliesTo,
              ClientID: res?.data?.AppliesTo,
              Champion: res?.data?.AppliesTo,
              HouseholdID: selectedHousehold?.HouseholdID,
              TemplateTypeID: 1
            });
          setObjective(objectiveResult?.data);
          setObjectiveDescription(objectiveResult?.data.Description);
          setWhyIsThisImportant(objectiveResult?.data.Why);
        }

        // Re populate objectives
        await objectiveActions.onPopulate({
          type: IObjectiveDataType.OBJECTIVE
        });


      }

      // Update store
      await onSubmitResponse({
        householdId: selectedInterview?.Interview?.HouseholdID,
        interviewId: selectedInterview?.Interview?.InterviewID,
        questionId: question?.Question?.QuestionID,
        question,
        questionIndex,
        response: res?.data,
        responseIndex,
        parentIndex: parentQuestionIndex,
      });

      await onSetIsSaved({
        type: InterviewDataType.FORM,
        saved: false
      })

      //update starred/hidden
      if(!isEdit) {
        if(unsavedHidden) await toggleHidden(res?.data as InterviewResponse);
        else if(unsavedStarred) await toggleStarred(res?.data as InterviewResponse);
      }

      notifications.addSuccessNotification("Response added successfully!");
      setErrors({ successMessage: `Response successfully ${createEditMessageText(response?.InterviewResponseID)}!`});
      setIsSubmitting(false);
      await onToggleShowResponseForm(false);
    } catch (err) {
      setErrors({ backError: extractServerError(err as IError) });
    }
    notifications.toggleLoading(false);
  };

  /**
   * Remove the response.
   */
  const remove = async() => {
    if (!response?.InterviewResponseID){
      onCancelEdit();
      return;
    }
    notifications.toggleLoading(true);
    try {
      // Delete response
      const res = await api.interviewresponse.remove(
        selectedInterview?.Interview?.HouseholdID,
        selectedInterview?.Interview?.InterviewID,
        response?.InterviewResponseID,
        response);

      // Delete objective
      if (isDreamInterview && response?.InterviewResponseID && objective) {
        api.objective.remove(
          selectedInterview?.Interview?.HouseholdID,
          selectedInterview?.Interview?.InterviewID,
          objective?.ObjectiveID,
          objective);
      }

      // Update store
      await onSubmitResponse({
        householdId: selectedInterview?.Interview?.HouseholdID,
        interviewId: selectedInterview?.Interview?.InterviewID,
        questionId: question?.Question?.QuestionID,
        question,
        questionIndex,
        response: res?.data,
        responseIndex,
        parentIndex: parentQuestionIndex
      });
      notifications.addSuccessNotification("Response deleted successfully!");
    } catch (err) {
      notifications.addErrorNotification("Error deleting response.");
    }
    notifications.toggleLoading(false);
  }

  /**
   * Handle cancelling an in-progress edit.
   */
  const onCancelEdit = async () => {
    setEditKey(Date.now())
    if (isSaved) {
      await onToggleShowResponseForm(false);
    } else {
      question.Responses = removeItemAtIndex(question.Responses, responseIndex);
      await onUpdateResponse({
        questionIndex,
        parentIndex: parentQuestionIndex,
        question
      });
    }
    await onSetIsSaved({
      type: InterviewDataType.FORM,
      saved: false
    })
  }

  /**
   * Triggered when another response is selected and this response was the previous selected.
   */
  const onUnselect = async () => {
    // Hide inline form if step changes or selected response isn't this response
    if (!isStepSelected() || !isSelected()) {
      // Remove response if it's unsaved
      if (!response?.InterviewResponseID) {
        onCancelEdit();
      }
    }
  }

  /**
   * Check if this response is the actively selected one.
   */
  const isSelected = () => {
    const isQuestionSelected = (question?.Question?.QuestionID === activeQuestion?.Question?.QuestionID);
    const isResponseSelected = (response?.InterviewResponseID === activeResponseId);
    return isQuestionSelected && (isNullOrUndefined(response?.InterviewResponseID) || isResponseSelected);
  }

  /**
   * Check whether to display inline form.
   */
  const showForm = () => {
    return isSelected() && showResponseForm;
  }

  /**
   * Check if both is selected.
   */
  const isBoth = () => {
    return !isNullOrUndefined(response?.AppliesTo) && response?.AppliesTo === 0;
  }

  /**
   * Check if this response's step is selected.
   */
  const isStepSelected = () => {
    return (activeSubStep?.index === subStep?.index);
  }

  /**
   * Show/hide inline form.
   */
  const toggleInlineForm = async () => {
    setEditKey(Date.now())
    if (!isSelected()) {
      await onSelect({
        type: WizardDataType.RESPONSE,
        question,
        response,
        responseIndex,
        showResponseForm: true
      });
    } else {
      await onToggleShowResponseForm(true);
    }
    await onSetIsSaved({
      type: InterviewDataType.FORM,
      saved: true
    })
  }

  /**
   * Show/hide inline form.
   */
  const setInlineFormVisibility = async (show: boolean) => {
    if (!isSelected()) {
      await onSelect({
        type: WizardDataType.RESPONSE,
        question,
        response,
        responseIndex,
        showResponseForm: show
      });
    } else {
      await onToggleShowResponseForm(show);
    }
    await onSetIsSaved({
      type: InterviewDataType.FORM,
      saved: show
    })
  }

  /**
   * Get the role for this reponse (i.e. AppliesTo)
   */
  const getPersonRole = () => {
    const result = (response?.AppliesTo && selectablePersons)
      ? selectablePersons.find((p: Person) => p.PersonID === response?.AppliesTo) : undefined;

    return result;
  }

  /**
   * Find and set the response's objective if it's the dream interview.
   */
  const findAndSetObjective = () => {
    if (isNullOrUndefined(response?.InterviewResponseID) && objectives && isDreamInterview) return;
    const itemObjective = objectives?.find((o: Objective) => o.InterviewResponseID === response?.InterviewResponseID);
    setObjective(itemObjective);
    setObjectiveDescription(itemObjective?.Description);
    setWhyIsThisImportant(itemObjective?.Why);
  }

  // report changes for printing
  const [checked, setChecked] = React.useState(allSelected);
  const handleCheck = () => {
    setChecked(!checked);
  }
  
  useMountEvents({
    onMounted: async () => {
      setPerson(getPersonRole());
      findAndSetObjective();
    },
    onUnmounted: async () => {
      await onUnselect();
    },
    onChange: async () => {
      // setSelectablePersons(selectedHousehold?.Persons?.length == 2 ? [...selectedHousehold?.Persons, BOTH_PERSONS_OPTION] : [selectedHousehold?.Persons]);
      setPerson(getPersonRole());
      await onUnselect();
      // if(!isUnsaved && showResponseForm) await onCancelEdit();
      const primaryPersons = persons?.filter(p => p?.PersonID == selectedHousehold?.PrimaryPerson1ID || p?.PersonID == selectedHousehold?.PrimaryPerson2ID);
      setSelectablePersons((primaryPersons && primaryPersons?.length > 1) ? [...primaryPersons, BOTH_PERSONS_OPTION] : (primaryPersons && primaryPersons?.length == 1) ? [primaryPersons[0]] : [BOTH_PERSONS_OPTION]);
    },
    watchItems: [response, activeResponse, activeSubStep, households, persons]
  });

  const handleTextAreaChanges = (event: any) => {
    if(isDreamInterview && !isForReport) {
      switch(event?.target?.name) {
        case "ResponseText": {
          setPriorityChanged(event.target.value == response?.ResponseText ? false : true);
          break;
        }
        case "WhyIsThisImportant": {
          setWhyChanged(event.target.value == response?.WhyIsThisImportant ? false : true);
          break;
        }
      }
    }
  }

  return (
      showForm() || isBoth() || selectablePersons.find((p:any) => person ? p?.PersonID == person.PersonID : p?.PersonID == 0) ? 
      <>
        <FormWrapper initialValues={isEdit ? response : initialValues}
                    validationSchema={isDreamInterview ? validateDream : validate}
                    onSubmit={createOrUpdate}
                    onChange={handleTextAreaChanges}
                    key={editKey}
                    className={classnames({ [styles.unsaved]: !isSaved } )}>
          <div className={classnames(styles.response_container, { [styles.response_container_alternate]: isAlternate })}>
            <Grid container spacing={1}>
              {isForReport ?
                <Grid item xs={1}>
                  <Checkbox
                    checked={checked}
                    onClick={(event) => event.stopPropagation()}
                    onChange={handleCheck}
                    inputProps={{ 'aria-label': 'primary checkbox' }}/>
                </Grid> : null}
              {/* <Grid item xs={2} className={classnames({[styles.appliesto_required]: isSubmitting && isNullOrUndefined(clientID)})}> */}
              <Grid item xs={2}>
                { !showForm() && isBoth() ?
                  <ListItem className={classnames(styles.avatar, styles.question_clickable)}
                            onClick={() => setInlineFormVisibility(true)}>
                    {/* <ListItemAvatar>
                      <Avatar variant="square">
                        <Avatar variant="square" className={classnames(styles.avatar)} src={selectablePersons.length > 1 ? getBothPhotoSrc() : getPhotoUrlOrDefault(selectablePersons[0])} />
                      </Avatar>
                    </ListItemAvatar> */}
                    <ListItemText primary={selectablePersons.length > 1 ? "Both" : selectablePersons[0].FullName}  />
                  </ListItem>
                  : null }
                { !showForm() && !isBoth() && person ?
                  <ListItem className={isForReport ? classnames(styles.avatar) : classnames(styles.avatar, styles.question_clickable)}
                            onClick={() => isForReport ? undefined : setInlineFormVisibility(true)}>
                    {/* <ListItemAvatar>
                      <Avatar variant="square">
                        <Avatar variant="square" className={classnames(styles.avatar)} src={getPhotoUrlOrDefault(person)} />
                      </Avatar>
                    </ListItemAvatar> */}
                    <ListItemText primary={getFullName(person)}
                                  secondary={getPersonTypeEnum(person?.PersonTypeID)}  />
                  </ListItem>
                  : null }
                { showForm() ?
                <>
                  <div className={styles.text_header}>Client</div>
                    <InputField type="autocomplete"
                                name="AppliesTo"
                                component={SelectAutocomplete}
                                templateComponent={SelectAvatarTemplate}
                                items={selectablePersons}
                                // label="Client"
                                labelField="FullName"
                                valueField="PersonID"
                                value={ selectablePersons.length === 1 && response?.AppliesTo === 0  ? selectablePersons[0].PersonID : response?.AppliesTo }
                                orientation="horizontal"
                                disableClearable={true}
                                onChange={(event: { target: { value: any; }; }) => {
                                  setClientChanged(event.target.value != response.AppliesTo);
                                }} />
                </>
                : null }
              </Grid>
              {/* <Grid item xs={isDiscoverInterview ? (question.Question.QuestionID == 321 ? 3 : 8) : 4}> */}

              {/* View for Discover */}
              { isDiscoverInterview ?
              <>
                  <Grid item xs={5}>
                  <div className={classnames(styles.text_body, { [styles.question_clickable]: (!showForm() && !isForReport) })}
                      onClick={() => {
                        if(!showForm() && !isForReport) setInlineFormVisibility(true);
                      }}>
                    { showForm() ?
                        <InputField type="textarea"
                                    name="ResponseText"
                                    component={Input}
                                    label={question.Question.QuestionID == 321 ? "Description" : "Response"}
                                    placeholder="Placeholder"/>
                        : <div className={styles.with_border}>{response?.ResponseText}</div> }
                  </div>
                </Grid>
                <Grid item xs={5} className={styles.buttons_flex}>
                <Grid container spacing={1}>
                  <Grid item xs={1}/>
                  <Grid item xs={3}>
                    <div className={styles.star}>
                        <ButtonGroup fullWidth={true} style={{justifyContent: "center"}}>
                          <Tooltip title="Add/Remove from Starred Responses">
                            <IconButton className={classnames({ [styles.star_filled]: response.Starred },  styles.white_rounded_bg)}
                                        onClick={(event) => {
                                          event.stopPropagation();
                                          if(isEdit) 
                                            toggleStarred();
                                          else {
                                            toggleUnsavedHidden(unsavedStarred);
                                            toggleUnsavedStarred(!unsavedStarred);
                                          }
                                        }}
                                        onFocus={(event) => event.stopPropagation()}
                                        aria-label="question-star">
                              <Icon>{ isCurrentlyStarred || unsavedStarred ? 'star' : 'star_border'}</Icon>
                              {/* <div className={styles.legend}>Star</div> */}
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Add/Remove from Hidden Responses">
                            <IconButton onClick={(event) => {
                                          event.stopPropagation();
                                          if(isEdit) 
                                            toggleHidden();
                                          else {
                                            toggleUnsavedStarred(unsavedHidden);
                                            toggleUnsavedHidden(!unsavedHidden);
                                          }
                                        }}
                                        onFocus={(event) => event.stopPropagation()}
                                        // aria-label="question-eye"
                                        classes={{label: classes.iconButtonLabel}}
                                        className={styles.white_rounded_bg}>
                              <Icon>{ isCurrentlyHidden || unsavedHidden ? 'visibility_off' : 'visibility'}</Icon>
                              {/* <div className={styles.legend}>Hide</div> */}
                            </IconButton>
                          </Tooltip>
                        </ButtonGroup>
                    </div>
                  </Grid>
                  <Grid item xs={4}>
                    { !showForm() && !isSaved ?
                        <MaterialButton className={styles.formButton}
                          color="default"
                          variant="contained"
                          type="reset"
                          fullWidth={true}
                          onClick={() => onCancelEdit()}>
                          Cancel
                        </MaterialButton>
                        : null }
                    { showForm() ?
                        <MaterialButton className={styles.formButton}
                          color="default"
                          variant="contained"
                          type="button"
                          fullWidth={true}
                          onClick={() => onCancelEdit()}>
                          Cancel
                        </MaterialButton>
                        : null }
                    { !showForm() && isSaved ?
                        <MaterialButton className={styles.formButton}
                          color="default"
                          variant="contained"
                          type="button"
                          fullWidth={true}
                          onClick={() => setShowDeleteConfirmation(true)}>
                          Delete
                        </MaterialButton>
                        : null }
                  </Grid>
                  <Grid item xs={4}>
                    { showForm() ?
                        // <Button
                        //   type="submit"
                        //   text="Save"
                        //   color="default" />
                        <MaterialButton className={styles.formButton}
                          color="secondary"
                          variant="contained"
                          type="submit"
                          fullWidth={true}>
                            Save
                        </MaterialButton>
                        : null }
                    { !showForm() ?
                        <MaterialButton className={styles.formButton}
                          color="primary"
                          variant="contained"
                          type="button"
                          fullWidth={true}
                          onClick={() => toggleInlineForm()}>
                          Edit
                        </MaterialButton>
                        : null }
                  </Grid>
                </Grid>
                <ConfirmationModal isOpen={showDeleteConfirmation}
                                        onConfirm={remove}
                                        onCancel={() => setShowDeleteConfirmation(false)} />
                  
              </Grid>
              </> : null  }
              {isDreamInterview && showForm() ? 
              <>
              <Grid item xs={10}>
                <div className={classnames(styles.text_body, { [styles.question_clickable]: (!showForm() && !isForReport) })}
                    onClick={() => {
                      if(!showForm() && !isForReport) setInlineFormVisibility(true);
                    }}>
                      <InputField type="textarea"
                                  name="ResponseText"
                                  component={Input}
                                  label="PRIORITY"
                                  // label={question.Question.QuestionID == 321 ? "Description" : "Response"}
                                  placeholder="Placeholder"/>
                </div>
                </Grid>
                <Grid item xs={2}></Grid>
                <Grid item xs={5}>
                <div className={classnames(styles.text_body, { [styles.question_clickable]: (!showForm() && !isForReport) })}
                    onClick={() => {
                      if(!showForm() && !isForReport) setInlineFormVisibility(true);
                    }}>
                      <InputField type="textarea"
                                  name="WhyIsThisImportant"
                                  label="WHY IS IT IMPORTANT?"
                                  component={Input}
                                  // label="Response"
                                  placeholder="Response"/>
                      
                      
                </div>
              </Grid>              
              <Grid item xs={5}>
                  <div className={classnames(styles.text_body, { [styles.question_clickable]: (!showForm() && !isForReport) })}
                    onClick={() => {
                      if(!showForm() && !isForReport) setInlineFormVisibility(true);
                    }}>
                      <Input type="textarea"
                                  label="What would be the headline for this priority? (7 words or less)"
                                  field={{
                                    name: "objectiveDescription",
                                    value: objectiveDescription,
                                    onChange: (event: any) => setObjectiveDescription(event?.target?.value)
                                  }} />
                </div>
                </Grid>
              </>                
                : 
                <>
                <Grid item xs={3}>
                  <div className={classnames(styles.text_body, { [styles.question_clickable]: (!showForm() && !isForReport) })}
                    onClick={() => {
                      if(!showForm() && !isForReport) setInlineFormVisibility(true);
                    }}>
                    <span>{objectiveDescription}</span>
                </div>
                </Grid>
                <Grid item xs={7}>
                  <div className={classnames(styles.text_body, { [styles.question_clickable]: (!showForm() && !isForReport) })}
                    onClick={() => {
                      if(!showForm() && !isForReport) setInlineFormVisibility(true);
                    }}>
                    <span>{response?.WhyIsThisImportant}</span>
                </div>
              </Grid> 
              </>
              }
              {/* <Grid item xs={5}>
                <div className={classnames(styles.text_body, { [styles.question_clickable]: (!showForm() && !isForReport) })}
                    onClick={() => {
                      if(!showForm() && !isForReport) setInlineFormVisibility(true);
                    }}>
                  { showForm() ?
                      <InputField type="textarea"
                                  name="ResponseText"
                                  component={Input}
                                  // label={question.Question.QuestionID == 321 ? "Description" : "Response"}
                                  placeholder="Placeholder"/>
                      : isDreamInterview ? <span>{objectiveDescription}</span> : <div className={styles.with_border}>{response?.ResponseText}</div> }
                </div>
              </Grid> */}
              {/* { isDreamInterview || question.Question.QuestionID == 321 ? 
                <Grid item xs={5}>
                  <div className={classnames(styles.text_body, { [styles.question_clickable]: (!showForm() && !isForReport) })}
                    onClick={() => {
                      if(!showForm() && !isForReport) setInlineFormVisibility(true);
                    }}>
                  { showForm() ?
                      <InputField type="textarea"
                                  name="WhyIsThisImportant"
                                  component={Input}
                                  // label="Response"
                                  placeholder="Response"/>
                    : <div className={styles.with_border}>{response?.WhyIsThisImportant}</div> }
                </div>
                </Grid>
              : null } */}
              {!isForReport ?
              <>
              {(isDreamInterview || question.Question.QuestionID == 321) ? 
                <>
                  {/* {showForm() && isDreamInterview ?
                    <Grid container spacing={1}>
                      <Grid item xs={2}/>
                      <Grid item xs={10}>
                      <div className={classnames(styles.text_body, { [styles.question_clickable]: !showForm(), [styles.headline_required]: isSubmitting && isNullOrUndefined(objectiveDescription) })}
                          onClick={() => {
                            if(!showForm()) setInlineFormVisibility(true);
                          }}>
                        { showForm() ?
                          <div>
                            <Input type="textarea"
                                  label="What would be the headline for this priority?"
                                  field={{
                                    name: "objectiveDescription",
                                    value: objectiveDescription,
                                    onChange: (event: any) => setObjectiveDescription(event?.target?.value)
                                  }} />
                            { headlineError ?
                              <div className={inputStyles.input_error}>
                                Field is required
                              </div>
                              : null }
                          </div>
                          : <div className={styles.with_border}>{objective?.Description}</div> }
                      </div>
                      </Grid>
                    </Grid>
                  : null } */}
                  <Grid container spacing={1}>
                    <Grid item xs={6}></Grid>
                    <Grid item xs={5} className={styles.buttons_flex}>
                      <Grid container spacing={1}>
                        <Grid item xs={1}/>
                        <Grid item xs={3}>
                          {/* <div className={styles.star}>
                            <ButtonGroup fullWidth={true} style={{justifyContent: "center"}}>
                              <Tooltip title="Add/Remove from Starred Responses">
                                <IconButton className={classnames({ [styles.star_filled]: response.Starred },  styles.white_rounded_bg)}
                                            onClick={(event) => {
                                              event.stopPropagation();
                                              if(isEdit) 
                                                toggleStarred();
                                              else {
                                                toggleUnsavedHidden(unsavedStarred);
                                                toggleUnsavedStarred(!unsavedStarred);
                                              }
                                            }}
                                            onFocus={(event) => event.stopPropagation()}
                                            aria-label="question-star">
                                  <Icon>{ isCurrentlyStarred || unsavedStarred ? 'star' : 'star_border'}</Icon>
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Add/Remove from Hidden Responses">
                                <IconButton onClick={(event) => {
                                              event.stopPropagation();
                                              if(isEdit)
                                                toggleHidden();
                                              else {
                                                toggleUnsavedStarred(unsavedHidden);
                                                toggleUnsavedHidden(!unsavedHidden);
                                              }
                                            }}
                                            onFocus={(event) => event.stopPropagation()}
                                            // aria-label="question-eye"
                                            classes={{label: classes.iconButtonLabel}}
                                            className={styles.white_rounded_bg}>
                                  <Icon>{ isCurrentlyHidden || unsavedHidden ? 'visibility_off' : 'visibility'}</Icon>
                                </IconButton>
                              </Tooltip>
                            </ButtonGroup>
                          </div> */}
                        </Grid>
                        <Grid item xs={4}>
                          { !showForm() && !isSaved ?
                              <MaterialButton className={styles.formButton}
                                color="default"
                                variant="contained"
                                type="button"
                                fullWidth={true}
                                onClick={() => onCancelEdit()}>
                                Cancel
                              </MaterialButton>
                              : null }
                          { showForm() ?
                              <MaterialButton className={styles.formButton}
                                color="default"
                                variant="contained"
                                type="reset"
                                fullWidth={true}
                                onClick={() => onCancelEdit()}>
                                Cancel
                              </MaterialButton>
                              : null }
                          { !showForm() && isSaved ?
                              <MaterialButton className={styles.formButton}
                                color="default"
                                variant="contained"
                                type="button"
                                fullWidth={true}
                                onClick={() => setShowDeleteConfirmation(true)}>
                                Delete
                              </MaterialButton>
                              : null }
                        </Grid>
                        <Grid item xs={4}>
                          { showForm() ?
                              // <Button
                              //   type="submit"
                              //   text="Save"
                              //   color="default" />
                              <MaterialButton className={styles.formButton}
                                color="secondary"
                                variant="contained"
                                type="submit"
                                fullWidth={true}>
                                  Save
                              </MaterialButton>
                              : null }
                          { !showForm() ?
                              <MaterialButton className={styles.formButton}
                                color="primary"
                                variant="contained"
                                type="button"
                                fullWidth={true}
                                onClick={() => toggleInlineForm()}>
                                Edit
                              </MaterialButton>
                              : null }
                        </Grid>
                      </Grid>
                      <ConfirmationModal isOpen={showDeleteConfirmation}
                                            onConfirm={remove}
                                            onCancel={() => setShowDeleteConfirmation(false)} />
                    </Grid>
                  </Grid>          
                </>
              : 
              <>
                {/* <Grid item xs={5} className={styles.buttons_flex}>
                  <Grid container spacing={1}>
                    <Grid item xs={1}/>
                    <Grid item xs={3}>
                      <div className={styles.star}>
                          <ButtonGroup fullWidth={true} style={{justifyContent: "center"}}>
                            <Tooltip title="Add/Remove from Starred Responses">
                              <IconButton className={classnames({ [styles.star_filled]: response.Starred },  styles.white_rounded_bg)}
                                          onClick={(event) => {
                                            event.stopPropagation();
                                            if(isEdit) 
                                              toggleStarred();
                                            else {
                                              toggleUnsavedHidden(unsavedStarred);
                                              toggleUnsavedStarred(!unsavedStarred);
                                            }
                                          }}
                                          onFocus={(event) => event.stopPropagation()}
                                          aria-label="question-star">
                                <Icon>{ isCurrentlyStarred || unsavedStarred ? 'star' : 'star_border'}</Icon>
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Add/Remove from Hidden Responses">
                              <IconButton onClick={(event) => {
                                            event.stopPropagation();
                                            if(isEdit) 
                                              toggleHidden();
                                            else {
                                              toggleUnsavedStarred(unsavedHidden);
                                              toggleUnsavedHidden(!unsavedHidden);
                                            }
                                          }}
                                          onFocus={(event) => event.stopPropagation()}
                                          classes={{label: classes.iconButtonLabel}}
                                          className={styles.white_rounded_bg}>
                                <Icon>{ isCurrentlyHidden || unsavedHidden ? 'visibility_off' : 'visibility'}</Icon>
                              </IconButton>
                            </Tooltip>
                          </ButtonGroup>
                      </div>
                    </Grid>
                    <Grid item xs={4}>
                      { !showForm() && !isSaved ?
                          <MaterialButton className={styles.formButton}
                            color="default"
                            variant="contained"
                            type="reset"
                            fullWidth={true}
                            onClick={() => onCancelEdit()}>
                            Cancel
                          </MaterialButton>
                          : null }
                      { showForm() ?
                          <MaterialButton className={styles.formButton}
                            color="default"
                            variant="contained"
                            type="button"
                            fullWidth={true}
                            onClick={() => onCancelEdit()}>
                            Cancel
                          </MaterialButton>
                          : null }
                      { !showForm() && isSaved ?
                          <MaterialButton className={styles.formButton}
                            color="default"
                            variant="contained"
                            type="button"
                            fullWidth={true}
                            onClick={() => setShowDeleteConfirmation(true)}>
                            Delete
                          </MaterialButton>
                          : null }
                    </Grid>
                    <Grid item xs={4}>
                      { showForm() ?
                          // <Button
                          //   type="submit"
                          //   text="Save"
                          //   color="default" />
                          <MaterialButton className={styles.formButton}
                            color="secondary"
                            variant="contained"
                            type="submit"
                            fullWidth={true}>
                              Save
                          </MaterialButton>
                          : null }
                      { !showForm() ?
                          <MaterialButton className={styles.formButton}
                            color="primary"
                            variant="contained"
                            type="button"
                            fullWidth={true}
                            onClick={() => toggleInlineForm()}>
                            Edit
                          </MaterialButton>
                          : null }
                    </Grid>
                  </Grid>
                  <ConfirmationModal isOpen={showDeleteConfirmation}
                                          onConfirm={remove}
                                          onCancel={() => setShowDeleteConfirmation(false)} />
                    
                </Grid> */}
              </>}
              </> : null}
              
            </Grid>
            
            { !isSaved ?
              <div className="m-t-10 text-right">
                <Chip className={styles.unsaved_text}
                      label="Unsaved"
                      size="small" />
              </div>
              : null}
          </div>
        </FormWrapper>
        <InterviewStepQuestionResponseForm wizard={wizard}
          step={step}
          subStep={subStep}
          question={question}
          questionIndex={questionIndex}
          response={response}
          responseIndex={responseIndex}
          parentQuestionIndex={parentQuestionIndex}
          isOpen={showEdit}
          onClose={() => setShowEdit(false)}
          isDiscoverInterview={isDiscoverInterview}/>
      </>
    : null
  );
}

export default InterviewStepQuestionResponse;