import React, {ReactElement, useState} from 'react';
import {useStoreActions, useStoreState} from "~/store/hooks";
import {convertStringToDate, convertStringToDateText, createEditHeaderSubmitText, createEditMessageText, defaultDate, getDateType} from "~/ui/constants/utils";
import FormWrapper from "~/ui/components/Forms/FormWrapper";
import initialValues from './form/initialValues';
import validate from './form/validate';
import api from "~/services/api";
import {extractServerError, IError, processServerError} from "~/services/api/errors";
import {Box, Checkbox, DialogActions, Grid, TextField} from "@material-ui/core";
import Button from "~/ui/components/Button";
import {IFormActionProps} from "~/types/forms";
import InputField from "~/ui/components/Forms/InputField";
import Input from "~/ui/components/Forms/Input";
import useNotifications from "~/ui/hooks/useNotifications";
import {Objective} from "~/types/api/objective";
import SelectAutocomplete from "~/ui/components/Forms/SelectAutocomplete";
import SelectAvatarTemplate from "~/ui/components/Forms/SelectAutocomplete/components/SelectAvatarTemplate";
import {IObjectiveDataType} from "~/types/objective/store";
import {TabProps} from "~/ui/components/Containers/VerticalTabs/VerticalTabs";
import {ApiRequestType, OwnerModelType, OwnerType, PersonType} from "~/ui/constants/api";
import styles from "~/ui/components/ActionItems/EditActionItem/EditActionItem.module.scss";
import VerticalTabs from "~/ui/components/Containers/VerticalTabs";
import {
  objectiveFundingNeeds,
  objectiveFundingTypes,
  objectiveImportanceCategories,
  objectiveKnowledgeLevels,
  objectiveKnowledgeTask,
  objectivePersonalImpacts,
  objectiveStatuses,
  objectiveYesNoTypes
} from "~/ui/constants/objectives";
import ConfirmationModal from "~/ui/components/Dialogs/ConfirmationModal";
import {BOTH_PERSONS_OPTION} from "~/services/interview";
import {Photo} from "~/types/api/photo";
import useMountEvents from "~/ui/hooks/useMountEvents";
import {OwnerParams} from "~/types/relations";
import {getDefaultPhotoSrc} from "~/ui/constants/user";
import EditPriorityStakeholder from "~/ui/components/Priorities/EditPriorityStakeholder";
import PriorityStakeholderList from "~/ui/components/Priorities/PriorityStakeholderList";
import {Person} from "~/types/api/person";
import {Alert} from "@material-ui/lab";
import EditActionItem from '~/ui/components/ActionItems/EditActionItem';
import PhotoForm from '../../Contact/PhotoForm';
import { withFormik } from 'formik';
import moment from 'moment';
import NumberFormatInput from "~/ui/components/Forms/NumberFormatInput";
import {formatDate} from "@telerik/kendo-intl";
import { getAccessToken, getSessionGUID } from '~/services/auth';
import useSWR from 'swr';
import { fetcher } from '~/types/api/fetcher';
import { DimensionOfLife } from '~/types/api/dimensionOfLife';
import { MetricOfSuccess } from '~/types/api/metricOfSuccess';
import { IntervalType } from '~/types/api/intervalType';

interface IProps {
  item?: Objective;
  onClose?: () => unknown;
}

export const createOrUpdateDirect = async (values: Objective,
                                           householdId: number,
                                           dreamInterviewId: number,
                                           notifications: any,
                                           onRefresh: any,
                                           onClose?: any) => {
  notifications.toggleLoading(true);
  try {
    // Create priority
    // @ts-ignore
    const res = await (!values?.ObjectiveID ?
      api.objective.create(householdId, dreamInterviewId, values) :
      api.objective.update(householdId, dreamInterviewId, values?.ObjectiveID, values));
    const payload = {
      type: IObjectiveDataType.OBJECTIVE,
      objective: res?.data,
      objectiveId: res?.data?.ObjectiveID
    };
    await onRefresh(payload);
    // Create response
    // TODO
    // Close, if applicble
    if (onClose) onClose();
    notifications.addSuccessNotification('Priority successfully saved!');
  } catch (err) {
    notifications.addErrorNotification('An error occurred while updating the priority.')
  }
  notifications.toggleLoading(false);
};



const EditPriorityFormContent = ({item, onClose}: IProps): ReactElement => {
  const notifications = useNotifications();
  const editValues = {
    ...item,
    Assistance: item?.AssistanceNeeded ? 1 : item?.DIY ? 2 : null,
    PriorityNow: item?.TimeframeID,
    // StartDate: item?.StartDate && new Date(item?.StartDate).getTime() != defaultDate?.getTime() ? convertStringToDateText(item?.StartDate, item?.StartDateType) : undefined,
    // ProjectedEndDate: item?.ProjectedEndDate && new Date(item?.ProjectedEndDate).getTime() != defaultDate?.getTime() ? convertStringToDateText(item?.ProjectedEndDate, item?.EndDateType) : undefined,
      ProjectedEndDate: convertStringToDateText(item?.ProjectedEndDate, Number(item?.EndDateType))!,
      StartDate: convertStringToDateText(item?.StartDate, Number(item?.StartDateType))!
  }

  //const {dimensionsOfLife, metricsOfSuccess, intervalTypes} = useStoreState(state => state.constants);
  const { data: dimensionsOfLife } = useSWR<DimensionOfLife[]>([`${process.env.NEXT_PUBLIC_API_URL}/dimensionoflife/list`, getAccessToken()], fetcher);
  const { data: metricsOfSuccess } = useSWR<MetricOfSuccess[]>([`${process.env.NEXT_PUBLIC_API_URL}/metricofsuccess/list`, getAccessToken()], fetcher);
  const { data: intervalTypes } = useSWR<IntervalType[]>([`${process.env.NEXT_PUBLIC_API_URL}/intervaltype/list`, getAccessToken()], fetcher);
  const {persons} = useStoreState(state => state.person);
  const {selectedHousehold} = useStoreState(state => state.household);
  const [selectablePersons, setSelectablePersons] = React.useState((selectedHousehold?.Persons && selectedHousehold?.Persons?.length > 1) ? [...selectedHousehold?.Persons, BOTH_PERSONS_OPTION] : (selectedHousehold?.Persons && selectedHousehold?.Persons?.length == 1) ? [selectedHousehold?.Persons[0]] : [BOTH_PERSONS_OPTION]);
  const {dreamInterviewId} = useStoreState(state => state.interview);
  const {onPopulate, onSelect, onRefresh} = useStoreActions(actions => actions.objective);

  const [stakeholderPersonType, setStakeholderPersonType] = useState<PersonType[]>();
  const [stakeholderPersonNotType, setStakeholderPersonNotType] = useState<PersonType[]>();
  const [showEditStakeholder, setShowEditStakeholder] = useState(false);
  const [currentTab, setCurrentTab] = React.useState(0);

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showEditSuccessImage, setShowEditSuccessImage] = useState(false);
  const [dateWrongFlag, setDateWrongFlag] = useState(false);
  const isEdit = Boolean(item) && Boolean(item?.ObjectiveID);
  
  const [successImage, setSuccessImage] = useState<Photo | undefined>();
  const [showEditActionItem, setShowEditActionItem] = React.useState(false);

  const {completedPrioritySections} = useStoreState(state => state.objective);

  // Current form values
  const [currentValues, setCurrentValues] = useState<any | undefined>(item ? item : initialValues);
  const onValuesChange = (changes: any) => {
    setCurrentValues(changes);
  }

  const familyPersons = persons ? persons.filter((p: Person) =>
    ((p.PersonTypeID === PersonType.PRIMARY) || p.PersonTypeID === PersonType.FAMILY)) : [];

  const params: OwnerParams = {
    ownerType: OwnerType.OBJECTIVE,
    requestType: ApiRequestType.CREATE_UPDATE,
    objectiveId: item?.ObjectiveID,
    modelName: OwnerModelType.PHOTO,
    householdId: selectedHousehold?.HouseholdID,
  };

  const setTabComplete = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if(item)
    {
      const tmp = JSON.parse(JSON.stringify((completedPrioritySections ?? {})[item.ObjectiveID] ?? {}));

      tmp[currentTab] = e.target.checked

      e?.target?.checked ? await api.objective.complete(selectedHousehold?.HouseholdID, item?.ObjectiveID, currentTab + 1) : await api.objective.unComplete(selectedHousehold?.HouseholdID, item?.ObjectiveID, currentTab + 1)

      onSelect({
          type: IObjectiveDataType.COMPLETED_PRIORITY,
          objectiveId: item.ObjectiveID,
          completedPrioritySections: tmp
      })
    }
  }

  const validateStartDateIsBeforeEndDate = (values: any) => {
    let error;
    const startDateString = currentValues?.StartDate;
    const endDateString = currentValues?.ProjectedEndDate;
    if(startDateString && endDateString)
    {
        let startDate = moment(startDateString, 'YYYY');
        if (moment(startDateString, 'M/YYYY', true).isValid()) startDate = moment(startDateString, 'M/YYYY');
        if (moment(startDateString, 'MM/YYYY', true).isValid()) startDate = moment(startDateString, 'MM/YYYY');
        if (moment(startDateString, 'M/D/YYYY', true).isValid()) startDate = moment(startDateString, 'M/D/YYYY');
        if (moment(startDateString, 'MM/DD/YYYY', true).isValid()) startDate = moment(startDateString, 'MM/DD/YYYY');

        let endDate = moment(endDateString, 'YYYY');
        if (moment(endDateString, 'M/YYYY', true).isValid()) endDate = moment(endDateString, 'M/YYYY');
        if (moment(endDateString, 'MM/YYYY', true).isValid()) endDate = moment(endDateString, 'MM/YYYY');
        if (moment(endDateString, 'M/D/YYYY', true).isValid()) endDate = moment(endDateString, 'M/D/YYYY');
        if (moment(endDateString, 'MM/DD/YYYY', true).isValid()) endDate = moment(endDateString, 'MM/DD/YYYY');
        
        if(startDate > endDate) {
            error = 'Start Date Cannot be after End Date';
            if (!dateWrongFlag) setDateWrongFlag(true);
        } else {
            if (dateWrongFlag) setDateWrongFlag(false);
        } 
    } else {
        if (dateWrongFlag) setDateWrongFlag(false);
    } 
    return error;
  }

  const isTabCompleted = (index?: number, completed?: boolean) => {
    if(item) {
      if(index === undefined)
          index = currentTab

      if(typeof completed !== 'undefined' && completed) {
          return true;
      }else{
          if(completedPrioritySections) {
              return (completedPrioritySections[item?.ObjectiveID] ?? {})[index] ?? false;
          }else{
              return false;
          }
      }
    }
    return false;
  }


  const createOrUpdate = async (values: any, {setErrors}: IFormActionProps) => {
    notifications.toggleLoading(true);
    try {
        let assistance = values?.Assistance;
        if (Number(values?.Assistance) === 2) 
        {
            assistance = {
                AssistanceNeeded: 0,
                DIY: 1
            };
        }
        else if (Number(values?.Assistance) === 1)
        {
            assistance = {
                AssistanceNeeded: 1,
                DIY: 0
            };
        }
        else {
          assistance = {
            AssistanceNeeded: 0,
            DIY: 0
        };
        }
        const {HouseholdID} = selectedHousehold;
        const populatedValues = {
            ...values,
            ...assistance,
            TimeframeID: values?.PriorityNow ? values.PriorityNow : 0,
            PriorityNow: values?.PriorityNow ? values.PriorityNow : 0,
            TemplateType: 1,
            HouseholdID: selectedHousehold?.HouseholdID,
            InterviewID: dreamInterviewId,
            ClientID: values?.Champion,
            StartDate: values?.StartDate ? formatDate(convertStringToDate(values.StartDate, Number(getDateType(values.StartDate))), "yyyy-MM-dd") : undefined,
            ProjectedEndDate: values?.ProjectedEndDate ? formatDate(convertStringToDate(values.ProjectedEndDate, Number(getDateType(values.ProjectedEndDate))), "yyyy-MM-dd") : undefined,
            StartDateType: values?.StartDate ? getDateType(values.StartDate): undefined,
            EndDateType: values?.ProjectedEndDate ? getDateType(values.ProjectedEndDate): undefined,
        }

        // @ts-ignore
        const res = await (!isEdit ? api.objective.create(HouseholdID, dreamInterviewId, populatedValues) : api.objective.update(HouseholdID, dreamInterviewId, item.ObjectiveID, populatedValues));
        const payload = {
            type: IObjectiveDataType.OBJECTIVE,
            objective: res?.data,
            objectiveId: res?.data?.ObjectiveID
        };
        const refreshed = await onRefresh(payload);
        await onSelect({
            ...payload,
            objective: refreshed
        });
        setErrors({successMessage: `Priority successfully ${createEditMessageText(item)}!`});
        if (onClose) onClose();
        await onPopulate({type: IObjectiveDataType.OBJECTIVE});
    } catch (err) {
        setErrors({backError: extractServerError(err)});
    }
    notifications.toggleLoading(false);
  };

  const remove = async () => {
    if (!item) return;
    notifications.toggleLoading(true);
    try {
      const {HouseholdID} = selectedHousehold;
      await api.objective.remove(HouseholdID, dreamInterviewId, item?.ObjectiveID, item);
      if (onClose) onClose();
      onPopulate({type: IObjectiveDataType.OBJECTIVE});
    } catch (err) {
      processServerError(err, 'EditPriorityForm.remove');
    }
    notifications.toggleLoading(false);
  };

  const getAndSetSuccessImage = async () => {
    if (item?.SuccessImage) {
      try {
        params.requestType = ApiRequestType.CREATE_UPDATE;
        params.modelId = item?.SuccessImage;
        const res = await api.photo.get(params);
      } catch (err) {
        processServerError(err, 'EditPriorityForm.getAndSetSuccessImage');
      }
    }
  }

  useMountEvents({
    onMounted: async () => {
      getAndSetSuccessImage();
    }
  });



  const tabs: TabProps[] = [
    {
        index: 0,
        label: 'Champion',
        check: isTabCompleted(0, (item?.Champion !== 0)),
        content: (
            <>
                <Grid container spacing={1}>
                    <Grid container item xs={12}>
                        <InputField type="autocomplete"
                                    name="Champion"
                                    component={SelectAutocomplete}
                                    templateComponent={SelectAvatarTemplate}
                                    isMultiselect={false}
                                    placeholder="Champion"
                                    label="Champion"
                                    items={familyPersons}
                                    labelField="FullName"
                                    valueField="PersonID"/>
                    </Grid>
                </Grid>
            </>
        )
    },
    {
        index: 1,
        label: 'Who else?',
        check: isTabCompleted(1),
        badge: item?.Stakeholders ? item?.Stakeholders?.length : 0,
        content: (
            <>
                <Grid container spacing={1}>
                    <Grid container item xs={6}>
                        <div className="m-b-20 full-width text-right">
                            <Button
                                type="button"
                                text="Add Family Member Stakeholder"
                                color="primary"
                                variant="contained"
                                onClick={() => {
                                    setStakeholderPersonType([PersonType.PRIMARY, PersonType.FAMILY]);
                                    setStakeholderPersonNotType([]);
                                    setShowEditStakeholder(true);
                                }}
                            />
                        </div>
                        <PriorityStakeholderList objective={item}
                                                 personTypeFilters={[PersonType.PRIMARY, PersonType.FAMILY]}/>
                    </Grid>
                    <Grid container item xs={6}>
                        <div className="m-b-20 full-width text-right">
                            <Button
                                type="button"
                                text="Add External Stakeholder"
                                color="primary"
                                variant="contained"
                                onClick={() => {
                                    setStakeholderPersonNotType([PersonType.PRIMARY, PersonType.FAMILY, PersonType.HOUSEHOLD]);
                                    setStakeholderPersonType([]);
                                    setShowEditStakeholder(true);
                                }}
                            />
                        </div>
                        <PriorityStakeholderList objective={item}
                                                 personNotTypeFilters={[PersonType.PRIMARY, PersonType.FAMILY, PersonType.HOUSEHOLD]}/>
                    </Grid>
                </Grid>
            </>
        )
    },
    {
        index: 2,
        check: isTabCompleted(2,(item?.ProjectedEndDate !== new Date() && item?.ScheduleFrequencyID !== 0 && item?.AmountOfTimeNeeded !== '' && item?.ScheduleDetail !== '')),
        label: 'Scheduling',
        isDateWrong: dateWrongFlag,
        content: (
            <>
                <Grid container spacing={1}>
                    <Grid container item xs={4}>
                        <InputField type="datetext"
                                name="ProjectedEndDate"
                                component={Input}
                                label="When would you like to complete this priority?"
                                placeholder="End Date"
                                validate={validateStartDateIsBeforeEndDate}/>
                    </Grid>
                    <Grid container item xs={4}>
                        <InputField type="select"
                                    labelField="IntervalType"
                                    valueField="IntervalTypeID"
                                    items={intervalTypes}
                                    name="ScheduleFrequencyID"
                                    component={Input}
                                    label="How often do you plan to work on this priority?"
                                    placeholder="How often do you plan to work on this priority?"/>
                    </Grid>
                    <Grid container item xs={4}>
                        <InputField type="number"
                                    name="AmountOfTimeNeeded"
                                    component={Input}
                                    label="Amount of time per occurrence (Hours)"
                                    placeholder="Amount of time per occurrence"/>
                    </Grid>
                </Grid>
                <Grid container spacing={1}>
                    <Grid container item xs={12}>
                        <InputField type="text"
                                    name="ScheduleDetail"
                                    component={Input}
                                    label="Schedule detail (e.g. 8:00 AM, Wednesdays, First Monday of the month, Annually on Dec 1st)"
                                    placeholder="Schedule detail (e.g. 8:00 AM, Wednesdays, First Monday of the month, Annually on Dec 1st)"/>
                    </Grid>
                </Grid>
            </>
        )
    },
    {
        index: 3,
        check: isTabCompleted(3, (item?.KnowledgeYesNo !== 0 && item?.KnowledgeNeeded !== 0 && item?.KnowledgeTask !== 0 && item?.KnowledgeAdvisorHelp !== '')),
        label: 'Knowledge',
        content: (
            <>
                <Grid container spacing={1}>
                    <Grid container item xs={12}>
                        <InputField type="select"
                                    labelField="label"
                                    valueField="value"
                                    items={objectiveYesNoTypes}
                                    name="KnowledgeYesNo"
                                    component={Input}
                                    label="Do you know what it will take to pursue this priority?"
                                    placeholder="Do you know what it will take to pursue this priority?"/>
                    </Grid>
                </Grid>
                <Grid container spacing={1}>
                    <Grid container item xs={12}>
                        <InputField type="select"
                                    labelField="label"
                                    valueField="value"
                                    items={objectiveKnowledgeLevels}
                                    name="KnowledgeNeeded"
                                    component={Input}
                                    label="What level of knowledge will you need in pursuing this priority?"
                                    placeholder="What level of knowledge will you need in pursuing this priority?"/>
                    </Grid>
                </Grid>
                <Grid container spacing={1}>
                    <Grid container item xs={12}>
                        <InputField type="select"
                                    labelField="label"
                                    valueField="value"
                                    items={objectiveKnowledgeTask}
                                    name="KnowledgeTask"
                                    component={Input}
                                    label="What needs to be done to get you the knowledge you need to pursue this priority?"
                                    placeholder="What needs to be done to get you the knowledge you need to pursue this priority?"/>
                    </Grid>
                </Grid>
                <Grid container spacing={1}>
                    <Grid container item xs={12}>
                        <InputField type="text"
                                    name="KnowledgeAdvisorHelp"
                                    component={Input}
                                    label="How can I help you access the knowledge you will need?"
                                    placeholder="How can I help you access the knowledge you will need?"/>
                    </Grid>
                </Grid>
            </>
        )
    },
    {
        index: 4,
        check: isTabCompleted(4, (item?.PersonalImpactLevel !== 0 && item?.PersonalExperience !== '')),
        label: 'Experience',
        content: (
            <>
                <Grid container spacing={1}>
                    <Grid container item xs={12}>
                        <InputField type="select"
                                    labelField="label"
                                    valueField="value"
                                    items={objectivePersonalImpacts}
                                    name="PersonalImpactLevel"
                                    component={Input}
                                    label="How will your personal experiences impact your pursuit of this priority?"
                                    placeholder="How will your personal experiences impact your pursuit of this priority?"/>
                    </Grid>
                </Grid>
                <Grid container spacing={1}>
                    <Grid container item xs={12}>
                        <InputField type="textarea"
                                    name="PersonalExperience"
                                    component={Input}
                                    label="PersonalExperience"
                                    placeholder="PersonalExperience"/>
                    </Grid>
                </Grid>
            </>
        )
    },
    {
        index: 5,
        check: isTabCompleted(5, (item?.FundingKnown !== 0 && item?.TotalFundingAmount !== 0 && item?.InstallmentFrequencyOther !== "" && item?.FundingDetail !== "")),
        label: 'Funding',
        content: (
            <>
                <Grid container spacing={1}>
                    <Grid container item xs={6}>
                        <InputField type="select"
                                    labelField="label"
                                    valueField="value"
                                    items={objectiveFundingNeeds}
                                    name="FundingKnown"
                                    component={Input}
                                    label="What do you think the funding needs will be to pursue this priority?"
                                    placeholder="What do you think the funding needs will be to pursue this priority?"/>
                    </Grid>
                    <Grid container item xs={6}>
                        <InputField type="number_format"
                                    name="TotalFundingAmount"
                                    value={"$"+Input}
                                    component={Input}
                                    label="What is the total amount?"
                                    placeholder="What is the total amount?"/>
                    </Grid>
                </Grid>
                <Grid container spacing={1}>
                    <Grid container item xs={4}>
                        <InputField type="select"
                                    labelField="label"
                                    valueField="value"
                                    items={objectiveFundingTypes}
                                    name="InstallmentFrequencyOther"
                                    component={Input}
                                    label="Single payment or installments?"
                                    placeholder="Single payment or installments?"/>
                    </Grid>
                    {currentValues?.InstallmentFrequencyOther > 0 ?
                        <>
                            {currentValues?.InstallmentFrequencyOther === '2' ?
                                (<>
                                    <Grid container item xs={4}>
                                        <InputField type="select"
                                                    labelField="IntervalType"
                                                    valueField="IntervalTypeID"
                                                    items={intervalTypes}
                                                    name="InstallmentFrequency"
                                                    component={Input}
                                                    label="Installment frequency"
                                                    placeholder="Installment frequency"/>
                                    </Grid>
                                    <Grid container item xs={4}>
                                        <InputField type="number"
                                                    name="InstallmentAmount"
                                                    component={Input}
                                                    label="Installment Amount"
                                                    placeholder="Installment Amount"/>
                                    </Grid>
                                </>)
                                : null}
                        </>
                        : null}

                </Grid>
                <Grid container spacing={1}>
                    <Grid container item xs={12}>
                        <InputField type="textarea"
                                    name="FundingDetail"
                                    component={Input}
                                    label="Additional funding information"
                                    placeholder="Additional funding information"/>
                    </Grid>
                </Grid>
            </>
        )
    },
    {
        index: 6,
        check: isTabCompleted(6, (item?.Importance !== 0)),
        label: 'Importance',
        content: (
            <>
                <Box mt={3} mb={3}>
                    <Alert severity="info">
                        <p>Some priorities (goals) are more important than others. Some priorities have to happen,
                            others might be
                            nice to
                            happen, and still others are aspirational in nature. Pursuing priorities requires the
                            use of the
                            resources available to
                            you. Resources include your wealth, your time, your abilities and your connections. Your
                            resources can
                            be allocated
                            based on how you categorize your priorities with respect to the level of risk you are
                            willing to accept
                            in pursuit of
                            each priority. As a first step then, let’s categorize each of your priorities in terms
                            of needs, wants,
                            or aspirations.</p>
                        <p><b>Essential goals</b>&nbsp;&nbsp;
                            satisfy fundamental needs. Essential goals are non
                            -
                            negotiable. These items cannot be
                            compromised, they simply have to occur. Resources allocated to this category aren't
                            intended to be
                            subjected to any
                            degree of uncertainty. Essential pursuits represent your standard of living as it
                            pertains to your
                            particular
                            circumstances. These pursuits carry no personal risk of experiencing a dramatic decrease
                            in your
                            lifestyle.</p>
                        <p><b>Important wants</b>&nbsp;&nbsp;
                            fulfill the lifestyle pursuits of present generations. Important wants will employ
                            resources in a
                            manner that can be impacted by outside forces beyond your control. As a result, there is
                            in an increase
                            in the level of
                            uncertainty in being able to achieve these pursuits. Priorities in this category take on
                            environmental
                            risk (economic,
                            social and other worldly forces) in order to maintain your ability to enjoy the quality
                            of life that is
                            appealing to you.
                            Therefore, there is the possibility that one or more of these goals may not be realized.
                        </p>
                        <p><b>Aspirational desires</b>&nbsp;&nbsp;
                            attempt to perpetuate the legacy for generations. Aspirational goals are those that are
                            most
                            closely aligned with the family’s ability to live its legacy and to perpetuate this for
                            future
                            generations. These goals are
                            intended to contribute to the sustainability of the family for many generations.
                            Resources dedicated to
                            aspirational
                            goals will be exposed to a high degree of uncertainty and, as a result, should be viewed
                            as no more than
                            possibilities. Furthermore, these resources are at risk of being completely depleted.
                        </p>
                    </Alert>
                </Box>
                <Grid container spacing={1}>
                    <Grid container item xs={12}>
                        <InputField type="select"
                                    labelField="label"
                                    valueField="value"
                                    items={objectiveImportanceCategories}
                                    name="Importance"
                                    component={Input}
                                    label="How would you categorize this priority? Is it an essential, important, or aspirational priority?"
                                    placeholder="How would you categorize this priority? Is it an essential, important, or aspirational priority?"/>
                    </Grid>
                </Grid>
            </>
        )
    },
    {
        index: 7,
        check: isTabCompleted(7, (item?.SuccessImageURL !== "" && item?.SuccessDescription !== "")),
        label: "Photo",
        content: (
            <Grid container spacing={1}>
                <Grid container item xs={12}>
                    <Grid container justify="center">
                        <InputField type="textarea"
                                name="SuccessDescription"
                                component={Input}
                                label="Describe what success looks like to you? "/>
                    </Grid>
                    <Grid container justify="center"/>
                    <Grid container justify="center">
                        <img src={item?.SuccessImageURL ? item?.SuccessImageURL : getDefaultPhotoSrc()}
                             className={styles.success_image}/>
                    </Grid>
                    <Grid container justify="center">
                        <Box mt={3}>
                            <Button
                                type="button"
                                text="Edit Success Image"
                                size="large"
                                onClick={() => setShowEditSuccessImage(true)}
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Grid>
        )
    }
];

  return (
    <FormWrapper initialValues={item ? editValues : initialValues}
                validationSchema={validate}
                onSubmit={createOrUpdate}
                onValuesChange={onValuesChange}>
      <div>
          <Grid container spacing={1}>
              <Grid item xs={3}>
                  <InputField type="text"
                              name="Description"
                              component={Input}
                              placeholder="Priority"
                              label="Priority"
                              required={true}/>
              </Grid>
              <Grid item xs={3}>
                  <InputField type="select"
                              name="DimensionOfLifeID"
                              component={Input}
                              isMultiselect={false}
                              placeholder="Dimension of Life"
                              label="Dimension of Life"
                              items={dimensionsOfLife}
                              labelField="DimensionOfLife"
                              valueField="DimensionOfLifeID"
                              required={true}/>
              </Grid>
              <Grid item xs={3}>
                  <InputField type="select"
                              name="MetricOfSuccessID"
                              component={Input}
                              isMultiselect={false}
                              placeholder="Metric of Success"
                              label="Metric of Success"
                              items={metricsOfSuccess?.filter((m) => (m.MetricOfSuccess as String) !== "Other")}
                              labelField="MetricOfSuccess"
                              valueField="MetricOfSuccessID"
                              required={true}/>
              </Grid>
              <Grid item xs={3}>
                  <InputField type="select"
                              labelField="label"
                              valueField="value"
                              items={objectiveStatuses}
                              name="StatusID"
                              component={Input}
                              label="Status"/>
              </Grid>
          </Grid>
          <Grid container spacing={1}>
              <Grid container item xs={3}>
                  <InputField type="autocomplete"
                              name="PersonID"
                              component={SelectAutocomplete}
                              templateComponent={SelectAvatarTemplate}
                              isMultiselect={false}
                              placeholder="Family Member"
                              label="Family Member"
                              items={selectablePersons}
                              labelField="FullName"
                              valueField="PersonID"
                              required={true}/>
              </Grid>
              <Grid container item xs={3}>
                  <InputField type="select"
                              name="Assistance"
                              component={Input}
                              items={[
                                  {label: 'Assisted', value: 1},
                                  {label: 'DIY', value: 2}
                              ]}
                              labelField="label"
                              valueField="value"
                              label="DIY/Assisted"
                              placeholder="DIY/Assisted"/>
              </Grid>
              <Grid container item xs={3}>
                  <InputField type="select"
                              name="PriorityNow"
                              component={Input}
                              items={[
                                  {label: 'Now', value: 1},
                                  {label: 'Later', value: 2},
                                  {label: 'Long Term', value: 3}
                              ]}
                              labelField="label"
                              valueField="value"
                              label="Timing"
                              placeholder="Timing"/>
              </Grid>
              <Grid container item xs={3}>
              <InputField type="datetext"
                  name="StartDate"
                  component={Input}
                  disablePast={!isEdit}
                  label="Start Date"
                  placeholder="Start Date"
                  validate={validateStartDateIsBeforeEndDate}/>
              </Grid>
          </Grid>
          <div className={styles.task_tabs_container}>
              <VerticalTabs tabs={tabs} onTabChange={ind => setCurrentTab(ind)}/>
          </div>
      </div>
      <DialogActions>
          {item ? 
          <>
          Tab completed <Checkbox checked={isTabCompleted()} onChange={setTabComplete}/>
          </> : null}
          <Button
              type="submit"
              text={`${createEditHeaderSubmitText(item)} Priority`}
              variant="contained"
              size="large"
              color="primary"
          />
          {isEdit ?
              <>
                  <Button text="Cancel" type="reset" size="large" color="default" variant="contained"/>
                  <Button
                      type="button"
                      text={`Delete`}
                      variant="contained"
                      size="large"
                      color="default"
                      onClick={() => setShowDeleteConfirmation(true)}
                  />
              </>
              : null}
          <ConfirmationModal isOpen={showDeleteConfirmation}
                              onConfirm={remove}
                              onCancel={() => setShowDeleteConfirmation(false)}/>
      </DialogActions>
      <PhotoForm item={successImage}
                 isOpen={showEditSuccessImage}
                 onClose={() => {
                   setShowEditSuccessImage(false);
                 }}
                 ownerType={OwnerType.OBJECTIVE}/>
      {showEditActionItem ?
        <EditActionItem objective={item}
                        isOpen={showEditActionItem}
                        onClose={() => setShowEditActionItem(false)}/>
        : null}
      {showEditStakeholder && item ?
        <EditPriorityStakeholder objective={item}
                                 personTypeFilters={stakeholderPersonType}
                                 personNotTypeFilters={stakeholderPersonNotType}
                                 isOpen={showEditStakeholder}
                                 onClose={() => setShowEditStakeholder(false)}/>
        : null}
  </FormWrapper>
      
  );
};

export default EditPriorityFormContent;
