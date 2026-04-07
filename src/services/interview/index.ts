import {QuestionCategory} from "~/types/api/questionCategory";
import {Question} from "~/types/api/question";
import api from "~/services/api";
import {dimensionsOfSuccessStyles, InterviewType, metricsOfSuccessStyles} from "~/ui/constants/interview";
import {AxiosResponse} from "axios";
import {IInterviewQuestionGroup} from "~/ui/constants/store";
import {hasItems, isNullOrUndefined, toPercentage} from "~/ui/constants/utils";
import {InterviewTemplate} from "~/types/api/interviewTemplate";
import {Interview} from "~/types/api/interview";
import {InterviewResponse} from "~/types/api/interviewResponse";
import {MetricOfSuccess} from "~/types/api/metricOfSuccess";
import {DimensionOfLife} from "~/types/api/dimensionOfLife";
import {ceil, chain, countBy, divide, get, unionBy, groupBy} from 'lodash';
import {InterviewFull} from "~/types/api/interviewFull";
import {QuestionAndResponse} from "~/types/api/questionAndResponse";
import {WizardState, WizardStep} from "~/types/wizard/wizard";
import {
  DEFAULT_WIZARD_STATE,
  DEFAULT_WIZARD_STEP,
  WizardStepCompletionStatus,
  WizardStepStatus,
  WizardStepType,
  WizardStepValidityStatus,
  WizardType
} from "~/ui/constants/wizard";
import styles from "~/ui/components/Wizard/Wizard/Wizard.module.scss";
import {InterviewProgress} from "~/types/api/interviewProgress";
import {Person} from "~/types/api/person";
import {InterviewCategoryProgress} from "~/types/api/interviewCategoryProgress";
import {ClientEvaluation} from "~/types/api/clientEvaluation";
import {getBothPhotoSrc, getFullName} from "~/ui/constants/user";
import {Objective} from "~/types/api/objective";
import {IInterviewPersonResponseStats} from "~/types/interview/interview";
import { responsiveFontSizes, Step } from "@material-ui/core";
import internal from "stream";

export const BOTH_PERSONS_OPTION = {
  PersonID: 0,
  PersonStatusID: 1,
  PersonTypeID: 0,
  PhotoURL: getBothPhotoSrc(),
  FirstName: 'Both',
  LastName: undefined,
  FullName: 'Both',
  PreferredName: 'Both'
}

/**
 * Get fully populated questions for an interview.
 * @param interview
 * @param template
 * @param discoverCategories
 * @param questionGroups
 */
export const getInterviewQuestions = async (interview: Interview,
                                            template: InterviewTemplate,
                                            discoverCategories: QuestionCategory[],
                                            questionGroups: IInterviewQuestionGroup[]) => {
  const isDiscover = (template?.InterviewTemplateID === InterviewType.DISCOVER);
  let questionsResult = await (isDiscover ? getDiscoverQuestions(discoverCategories) : getDreamQuestions(questionGroups));
  const responseResult = await getQuestionResponses(interview.HouseholdID, interview.InterviewID, questionsResult);
  questionsResult = mapResponsesToQuestions(questionsResult, responseResult);

  return questionsResult;
}

/**
 * Get all discovery questions.
 * @param discoverCategories
 */
export const getDiscoverQuestions = async (discoverCategories: QuestionCategory[]) => {
  const res: AxiosResponse = await api.discovercategory.list();
  if (!res.data) return;

  const promises: any = [];
  const result: Question[] = [];

  res.data.forEach((category: QuestionCategory) => {
    promises.push(api.question.listDiscoverCategoryQuestions(
      InterviewType.DISCOVER,
      category.DimensionOfLifeID,
      true)
      .then((response: AxiosResponse) => result.push(...response.data)));
  });

  return Promise.all(promises).then(() => result);
}

/**
 * Get questions groups.
 */
export const getQuestionGroups = async () => {
  const dimensionsResponse: AxiosResponse = await api.dimensionofsuccess.list();
  const metricsResponse: AxiosResponse = await api.metricofsuccess.list();
  if (!dimensionsResponse.data || !metricsResponse.data) return;

  const questionGroups: IInterviewQuestionGroup[] = [];
  metricsResponse.data.forEach((metricOfSuccess: MetricOfSuccess) => {
    dimensionsResponse.data.forEach((dimensionOfLife: DimensionOfLife) => {
      questionGroups.push({
        metricOfSuccess,
        dimensionOfLife
      });
    });
  });

  return questionGroups;
}

/**
 * Get all dream questions.
 * @param groups
 */
export const getDreamQuestions = async (groupsOld: IInterviewQuestionGroup[]) => {
  const groups = await getQuestionGroups();

  if (!groups) return;

  const promises: any = [];
  const result: Question[] = [];

  groups.forEach((group: IInterviewQuestionGroup) => {
    promises.push(api.question.listDreamQuestions(
      InterviewType.DREAM,
      group.dimensionOfLife.DimensionOfLifeID,
      group.metricOfSuccess.MetricOfSuccessID)
      .then((response: AxiosResponse) => result.push(...response.data)));
  });

  return Promise.all(promises).then(() => result);
}

/**
 * Get responses for a list of questions.
 * @param householdId
 * @param interviewId
 * @param questions
 */
export const getQuestionResponses = async (householdId: number,
                                           interviewId: number,
                                           questions: Question[] | undefined) => {

  if (!questions) return;

  const promises: any = [];
  const result: Question[] = [];

  questions.forEach((question: Question) => {
    promises.push(api.interviewresponse.list(
      householdId,
      interviewId,
      question?.QuestionID)
      .then((response: AxiosResponse) => result.push(...response.data)));
  });

  return Promise.all(promises).then(() => result);
}

/**
 * Map responses to questions.
 * @param questions
 * @param responses
 */
export const mapResponsesToQuestions = (questions: Question[] | undefined,
                                        responses: InterviewResponse[] | undefined) => {
  if (questions && responses) {
    questions.forEach((question: Question) => {
      question.InterviewResponse = responses.find((t: InterviewResponse) => t.InterviewQuestionID === question.QuestionID);
      question.IsComplete = isQuestionComplete(question);
    });
  }

  return questions
}

/**
 * Check if a question is complete.
 * @param question
 */
export const isQuestionComplete = (question: Question): boolean => {
  // TODO - do additional checks.
  return Boolean(question?.InterviewResponse);
}

/**
 * Compute interview state.
 * @param interview
 */
export const computeInterviewProgress = (interview: InterviewFull): InterviewProgress => {
  const result: InterviewProgress = {
    TotalInterviewQuestionsAnswered: 0,
    TotalInterviewQuestionCount: 0,
  };

  if (interview.QuestionsAndResponses){
    result.TotalInterviewQuestionCount = interview.QuestionsAndResponses.length;
    interview.QuestionsAndResponses.forEach((question: QuestionAndResponse) => {
      if (!result.TotalInterviewQuestionsAnswered) result.TotalInterviewQuestionsAnswered = 0;
      if (question.IsComplete) result.TotalInterviewQuestionsAnswered++;
    });
    result.ProgressPercentage = ceil((divide(result.TotalInterviewQuestionsAnswered, result.TotalInterviewQuestionCount) * 100), 2);
  }

  return result;
}

/**
 * Get fully populated interview wizard.
 * @param interview
 * @param discoverCategories
 * @param persons
 * @param metricsOfSuccess
 * @param dimensionsOfLife
 */
export const getInterviewWizard = (interview: InterviewFull,
                          discoverCategories: QuestionCategory[],
                          persons: Person[],
                          metricsOfSuccess: MetricOfSuccess[],
                          dimensionsOfLife: DimensionOfLife[]): WizardState | undefined => {
  if (interview?.Interview?.InterviewTemplateID === InterviewType.DISCOVER) {
    return toDiscoverWizard(interview,
        discoverCategories,
        persons);
  }
  else if (interview?.Interview?.InterviewTemplateID === InterviewType.DREAM) {
    return toDreamWizard(interview,
        metricsOfSuccess,
        dimensionsOfLife,
        persons);
  }

  return undefined;
}

/**
 * Get interview wizard from scratch (i.e. fetch all required constants first).
 * @param householdId
 * @param interviewId
 */
export const getInterviewWizardFull = async (householdId: number, interviewId: number) => {
  // Populate interview
  const interview: InterviewFull = await api.interview.getFull(Number(householdId), Number(interviewId));

  // Populate other required data
  const discoverCategories = await api.discovercategory.list();
  const persons = await api.person.list(householdId);
  const metricsOfSuccess = await api.metricofsuccess.list();
  const dimensionsOfLife = await api.dimensionofsuccess.list();

  // Generate wizard
  return getInterviewWizard(interview,
      discoverCategories?.data,
      persons?.data,
      metricsOfSuccess?.data,
      dimensionsOfLife?.data);
}

/**
 * Generate discover wizard.
 * @param interview
 * @param categories
 */
export const toDiscoverWizard = (interview: InterviewFull,
                                 categories: QuestionCategory[],
                                 persons: Person[]) => {
  const wizard: WizardState = DEFAULT_WIZARD_STATE;
  wizard.type = WizardType.DISCOVER_INTERVIEW;
  wizard.title = "Discover Interview";
  wizard.steps = [];
  wizard.subSteps = [];
  wizard.persons = persons;
  wizard.personsOptions = toWizardPersons(persons);

  const primaryStep: WizardStep = {
    ...DEFAULT_WIZARD_STEP,
    type: WizardStepType.STEP,
    title: 'Main',
    steps: []
  };

  if (categories) {
    categories.forEach((category: QuestionCategory) => {
      // Create list of questions
      const allSubStepQuestions = (interview?.QuestionsAndResponses ? findQuestionsByField(interview?.QuestionsAndResponses,
        'DimensionOfLifeID',
        category.DimensionOfLifeID) : []);
      // Group questions by their parent ID
      const topLevelQuestions = allSubStepQuestions?.filter((q: QuestionAndResponse) => q.Question?.ParentQuestionID === 0);
      if (topLevelQuestions) {
        topLevelQuestions.forEach((q: QuestionAndResponse) => {
          q.SubQuestions = allSubStepQuestions.filter((c: QuestionAndResponse) => c.Question.ParentQuestionID === q.Question.QuestionID);
        });
      }
      // Create and add sub step
      const step: WizardStep = {
        ...DEFAULT_WIZARD_STEP,
        type: WizardStepType.SUB_STEP,
        title: category.DimensionOfLife,
        icon: get(dimensionsOfSuccessStyles, category.DimensionOfLifeID)?.icon ? get(dimensionsOfSuccessStyles, category.DimensionOfLifeID)?.icon : null,
        questions: topLevelQuestions,
        discoveryCategory: category
      };
      if (!primaryStep.steps){
        primaryStep.steps = [];
      }
      if (step.questions && step.questions.length > 0){
        primaryStep.steps.push(step);
      }
    });
  }

  wizard.steps.push(primaryStep);


  return updateWizardState(wizard, interview);
}

/**
 * Generate dream wizard.
 * @param interview
 * @param categories
 */
export const toDreamWizard = (interview: InterviewFull,
                              metricsOfSuccess: MetricOfSuccess[],
                              dimensionsOfLife: DimensionOfLife[],
                              persons: Person[]) => {
  const wizard: WizardState = DEFAULT_WIZARD_STATE;
  wizard.type = WizardType.DREAM_INTERVIEW;
  wizard.title = "Dream Interview";
  wizard.steps = [];
  wizard.persons = persons;
  wizard.personsOptions = toWizardPersons(persons);

  if (interview?.QuestionsAndResponses) {
    dimensionsOfLife.forEach((dimensionOfLife: DimensionOfLife) => {
      // Add one top level step (wizard hides top level steps if only one exists)
      const step: WizardStep = {
        ...DEFAULT_WIZARD_STEP,
        type: WizardStepType.STEP,
        title: `${dimensionOfLife?.DimensionOfLife}`,
        icon: get(dimensionsOfSuccessStyles, dimensionOfLife.DimensionOfLifeID)?.icon,
        steps: new Array()
      };
      metricsOfSuccess.forEach((metricOfSuccess: MetricOfSuccess) => {
        // Create list of questions
        const allSubStepQuestions = (interview?.QuestionsAndResponses ? findQuestionsByFields(interview?.QuestionsAndResponses,
          'MetricOfSuccessID',
          metricOfSuccess.MetricOfSuccessID,
          'DimensionOfLifeID',
          dimensionOfLife.DimensionOfLifeID) : []);
        // Create and add sub step
        const subStep: WizardStep = {
          ...DEFAULT_WIZARD_STEP,
          type: WizardStepType.SUB_STEP,
          title: `${metricOfSuccess?.MetricOfSuccess}`,
          icon: get(metricsOfSuccessStyles, metricOfSuccess.MetricOfSuccessID)?.icon ? get(metricsOfSuccessStyles, metricOfSuccess.MetricOfSuccessID)?.icon : null,
          questions: allSubStepQuestions,
          dimensionOfLife,
          metricOfSuccess
        };
        if (subStep.questions && subStep.questions.length > 0){
          step.steps?.push(subStep);
        }
      });
      if (step.steps && step.steps.length > 0){
        wizard.steps.push(step);
      }
    });
  }

  return updateWizardState(wizard, interview);
}

/**
 * Get persons array for interview wizard.
 * @param persons
 */
export const toWizardPersons = (persons: Person[]) => {
  const result: { label: string, value: number}[] = [];
  if (persons) {
    persons?.forEach((person: Person) => {
      result.push({
        label: person.FullName,
        value: person.PersonID
      });
    })
  }
  result.push({
    label: 'Both',
    value: 0
  });
  return result;
}

/**
 * Additional enhancements, such as assigning indexes.
 * @param wizard
 */
export const updateWizardState = (wizard: WizardState, interview?: InterviewFull, evaluation?: ClientEvaluation) => {

  // Update steps
  if (wizard?.steps) {
    let index = 0;
    wizard.steps.forEach((step: WizardStep) => {
      step.index = index;
      step = updateWizardStepState(wizard, step, interview, evaluation);
      index++;
    });
    if (wizard?.activeStepIndex) {
      wizard.activeStep = wizard?.steps[wizard?.activeStepIndex];
    }
  }
  // Update sub steps
  if (wizard?.subSteps) {
    let index = 0;
    wizard.subSteps.forEach((step: WizardStep) => {
      step.index = index;
      step = updateWizardStepState(wizard, step, interview, evaluation);
      index++;
    });
    if (wizard?.activeSubStepIndex) {
      wizard.activeSubStep = wizard?.subSteps[wizard?.activeSubStepIndex];
    }
  }

  return wizard;
}

/**
 * Additional step enhancements.
 * @param step
 */
export const updateWizardStepState = (wizard: WizardState, step: WizardStep, interview?: InterviewFull, evaluation?: ClientEvaluation) => {
  const isInterviewWizard = isInterview(wizard.type);

  // For interviews, use category progress to set progress
  if (isInterviewWizard) {
    const progress = getInterviewCategoryProgress(step, interview, evaluation);
    if (progress) {
      step.completedQuestionsCount = progress?.QuestionsAnswered;
      step.totalQuestionsCount = progress?.TotalQuestionCount;
    }
  }
  // For evaluations, check to see if evaluation field is populated
  else {
    // Update individual questions
    if (step?.questions) {
      let index = 0;
      step.completedQuestionsCount = 0;
      step.totalQuestionsCount = step?.questions.length;
      step?.questions.forEach((question: QuestionAndResponse) => {
        question.index = index;
        if (isEvaluationQuestionAndResponseComplete(question, evaluation)) {
          if (!step.completedQuestionsCount) step.completedQuestionsCount = 0;
          step.completedQuestionsCount++;
        }
        index++;
      });
      step.percentCompleted = toPercentage(
        step?.completedQuestionsCount,
        step?.totalQuestionsCount);
    }
  }

  // Compute progress for question-based step
  if (step?.questions) {
    step.percentCompleted = toPercentage(
      step?.completedQuestionsCount,
      step?.totalQuestionsCount);
  }


  // Update step progress fields
  if (step?.steps) {
    let index = 0;
    step.completedStepsCount = 0;
    step.totalStepsCount = step.steps.length;
    step?.steps.forEach((subStep: WizardStep) => {
      subStep.index = index;
      subStep = updateWizardStepState(wizard, subStep, interview, evaluation);
      if (subStep.completionStatus === WizardStepCompletionStatus.COMPLETED) {
        if (!step.completedStepsCount) step.completedStepsCount = 0;
        step.completedStepsCount++;
      }
      index++;
    });

    // Compute progress for a step that contains child steps
    step.percentCompleted = toPercentage(
      step.completedStepsCount,
      step.totalStepsCount);
  }

  // Update statuses & flags
  step = updateStepStatuses(wizard, step);
  step.classes = getWizardStepClasses(step);
  step.avatarClasses = getWizardStepAvatarClasses(step);

  return step;
}

/**
 * Get category progess for a step.
 * @param step
 * @param interview
 */
export const getInterviewCategoryProgress = (step: WizardStep, interview?: InterviewFull, evaluation?: ClientEvaluation) => {
  if (!interview?.Progress?.CategoryProgressList) {
    return null;
  }
  return interview?.Progress?.CategoryProgressList?.find((p: InterviewCategoryProgress) => {
    if (interview?.Interview?.InterviewTemplateID === InterviewType.DREAM) {
      return (p?.Category1ID === step?.dimensionOfLife?.DimensionOfLifeID)
        && (p?.Category2ID === step?.metricOfSuccess?.MetricOfSuccessID);
    } else if (interview?.Interview?.InterviewTemplateID === InterviewType.DISCOVER) {
      return (p?.Category1ID === step?.discoveryCategory?.DimensionOfLifeID);
    }
  });
}

/**
 * Update step statuses.
 * @param wizard
 * @param step
 */
export const updateStepStatuses = (wizard: WizardState, step: WizardStep) => {
  step.status = ((step.type === WizardStepType.STEP && wizard.activeStepIndex === step.index)
    || (step.type === WizardStepType.SUB_STEP && wizard.activeSubStepIndex === step.index))
    ? WizardStepStatus.ACTIVE
    : WizardStepStatus.INACTIVE;
  step.completionStatus = (step?.percentCompleted && step?.percentCompleted >= 100)
    ? WizardStepCompletionStatus.COMPLETED
    : WizardStepCompletionStatus.PENDING;

  return step;
}

/**
 * Build classes object.
 * @param step
 */
export const getWizardStepClasses = (step: WizardStep) => {
  return step.type === WizardStepType.STEP ? {
    [styles.wizard_header_step]: true,
    [styles.wizard_header_step_active]: (step.status === WizardStepStatus.ACTIVE),
    [styles.wizard_header_step_invalid]: (step.validityStatus === WizardStepValidityStatus.INVALID),
    [styles.wizard_header_step_inprogress]: (step.completionStatus === WizardStepCompletionStatus.IN_PROGRESS),
    [styles.wizard_header_step_completed]: (step.completionStatus === WizardStepCompletionStatus.COMPLETED),
  } : {
    [styles.wizard_nav_step]: true,
    [styles.wizard_nav_step_active]: (step.status === WizardStepStatus.ACTIVE),
    [styles.wizard_nav_step_invalid]: (step.validityStatus === WizardStepValidityStatus.INVALID),
    [styles.wizard_nav_step_inprogress]: (step.completionStatus === WizardStepCompletionStatus.IN_PROGRESS),
    [styles.wizard_nav_step_completed]: (step.completionStatus === WizardStepCompletionStatus.COMPLETED),
  }
}

/**
 * Build classes object.
 * @param step
 */
export const getWizardStepAvatarClasses = (step: WizardStep) => {
  return step.type === WizardStepType.STEP ? {
    [styles.wizard_header_step_active_avatar]: (step.status === WizardStepStatus.ACTIVE),
    [styles.wizard_header_step_invalid_avatar]: (step.validityStatus === WizardStepValidityStatus.INVALID),
    [styles.wizard_header_step_inprogress_avatar]: (step.completionStatus === WizardStepCompletionStatus.IN_PROGRESS),
    [styles.wizard_header_step_completed_avatar]: (step.completionStatus === WizardStepCompletionStatus.COMPLETED),
  } : {
    [styles.wizard_nav_step_active_avatar]: (step.status === WizardStepStatus.ACTIVE),
    [styles.wizard_nav_step_invalid_avatar]: (step.validityStatus === WizardStepValidityStatus.INVALID),
    [styles.wizard_nav_step_inprogress_avatar]: (step.completionStatus === WizardStepCompletionStatus.IN_PROGRESS),
    [styles.wizard_nav_step_completed_avatar]: (step.completionStatus === WizardStepCompletionStatus.COMPLETED),
  }
}

/**
 * Find questions using one field.
 * @param questions
 * @param field
 * @param value
 */
export const findQuestionsByField = (questions: QuestionAndResponse[], field: string, value: number) => {
  return questions ? questions.filter((question: QuestionAndResponse) => {
    return get(question, `Question.${field}`) === value;
  }) : [];
}

/**
 * Find questions using two fields.
 * @param questions
 * @param field
 * @param value
 * @param field2
 * @param value2
 */
export const findQuestionsByFields = (questions: QuestionAndResponse[],
                                      field: string, value: number,
                                      field2: string, value2: number) => {
  return questions ? questions.filter((question: QuestionAndResponse) => {
    return (get(question, `Question.${field}`) === value) && (get(question, `Question.${field2}`) === value2);
  }) : [];
}

/**
 * Get all questions from a wizard.
 * @param wizard
 */
export const getAllWizardQuestions = (wizard: WizardState) => {
  const result: QuestionAndResponse[] = [];
  wizard?.steps.forEach((step: WizardStep) => result.push(...getAllWizardStepQuestions(step)));
  return result;
}

/**
 * Get all questions from a wizard's step.
 * @param wizard
 */
export const getAllWizardStepQuestions = (wizard: WizardStep) => {
  const result: QuestionAndResponse[] = [];
  if (wizard?.steps) {
    wizard.steps.forEach((substep: WizardStep) => {
      result.push(...getAllWizardStepQuestions(substep));
    })
  }
  if (wizard?.questions) {
    result.push(...wizard?.questions);
  }
  return result;
}

/**
 * Check if an interview wizard question is complete.
 * @param question
 */
export const isInterviewQuestionAndResponseComplete = (question: QuestionAndResponse): boolean => {
  let completedResponse = 0;
  if (question?.Responses) {
    question?.Responses.forEach((response: InterviewResponse) => {
      if (Boolean(response?.ResponseText)) {
        completedResponse++;
      }
    })
  }
  // TODO - do additional checks.
  return Boolean(question?.Responses) && (completedResponse > 0);
}


/**
 * Check if an evaluation wizard question is complete.
 * @param question
 * @param evaluation
 */
export const isEvaluationQuestionAndResponseComplete = (question: QuestionAndResponse, evaluation?: ClientEvaluation): boolean => {
  if (!evaluation) {
    return false;
  }
  const fieldName = get(question, "Question.InputName");
  const fieldValue = get(evaluation, `${fieldName}`);
  // TODO - do additional checks.
  return !isNullOrUndefined(fieldValue);
}

/**
 * Return if a wizard is for an interview.
 * @param wizard
 */
export const isInterview = (type: WizardType) => {
  return (type === WizardType.DISCOVER_INTERVIEW) || (type === WizardType.DREAM_INTERVIEW);
}

/**
 * Return if a wizard is for an interview.
 * @param wizard
 */
export const isEvaluation = (type: WizardType) => {
  return (type === WizardType.EVALUATION);
}

/**
 * Get text for role for a response.
 * @param response
 * @param persons
 */
export const getResponseAppliesToText = (response: InterviewResponse, persons?: Person[]) => {
  let result = checkIfResponseIsBoth(response) ? 'Both' : null;
  if (result === null) {
    if(persons) {
      const person = findPersonRole(response, persons);
      if (!person) return result;
      result = getFullName(person);
    }
    else {
      result = String(response.AppliesToFullName);
    }
  }

  return result;
}

/**
 * Find person related to a response.
 * @param response
 * @param persons
 */
export const findPersonRole = (response: InterviewResponse, persons: Person[] | undefined) => {
  const result = (response?.AppliesTo && persons)
      ? persons.find((p: Person) => p.PersonID === response?.AppliesTo) : null;

  return result;
}

/**
 * Find person related to a response and return full name.
 * @param response
 * @param persons
 */
export const findPersonRoleName = (response: InterviewResponse, persons: Person[] | undefined) => {
  const result = findPersonRole(response, persons);

  return (response?.AppliesTo === 0) ? 'Both' :  getFullName(result);
}

/**
 * Check if an interview response is set to both.
 * @param response
 */
const checkIfResponseIsBoth = (response: InterviewResponse) => {
  return !isNullOrUndefined(response?.AppliesTo) && response?.AppliesTo === 0;
}

/**
 * Get all step responses by person.
 * @param step
 * @param persons
 */
export const getStepResponsesByPerson = (step: WizardStep, persons: Person[], objectives?: Objective[]) => {
  const questions = getAllWizardStepQuestions(step);
  
  return objectives ? getResponsesByPerson(questions, persons, step.discoveryCategory?.DimensionOfLifeID, objectives) : getResponsesByPerson(questions, persons, step.discoveryCategory?.DimensionOfLifeID);
}

/**
 * Get all responses by person.
 * @param questions
 * @param persons
 */
export const getResponsesByPerson = (questions: QuestionAndResponse[], persons: Person[], id: number|undefined, objectives?: Objective[]) => {
  const result: IInterviewPersonResponseStats[] = [];
  const groupedQuestions = groupQuestionsResponsesByAppliesTo(questions);
  const groupedQuestionByUniquePersonID = groupBy(groupedQuestions, "key");
  for (var key in groupedQuestionByUniquePersonID) {
    const responses = [].concat(...groupedQuestionByUniquePersonID[key].map((response: { value: any; }) => response.value || []));
    const person = persons?.find(p => String(p.PersonID) === key);
    if (person) {
      result.push({
        person,
        responses: responses,
        additionalPriorityCount: objectives ? computeAdditionalPriorityCountByAppliesTo(objectives, person?.PersonID, questions.find(x=>x!==undefined)?.Question.DimensionOfLifeID as number, questions.find(x=>x!==undefined)?.Question.MetricOfSuccessID as number) : 0
      })
    }
  }

  const keys = Object.keys(groupedQuestionByUniquePersonID);
  persons.forEach(p => {
    if(keys.indexOf(String(p.PersonID)) < 0)
    {
      const additionalPriorityCount = objectives ? computeAdditionalPriorityCountByAppliesTo(objectives, p?.PersonID, questions.find(x=>x!==undefined)?.Question.DimensionOfLifeID as number, questions.find(x=>x!==undefined)?.Question.MetricOfSuccessID as number) : 0;
      if(additionalPriorityCount > 0) 
      {
        result.push({
          person: p,
          responses: [],
          additionalPriorityCount: additionalPriorityCount
        })
      }
    }
  })
  
  return result;
}

/**
 * Get questions for
 * @param questions
 */
const groupQuestionsResponsesByAppliesTo = (questions: QuestionAndResponse[]) => {
  const result: any[] = [];
  questions?.forEach((q: QuestionAndResponse) => {
    if(q.SubQuestions)
    {
      result.push(...(groupQuestionsResponsesByAppliesTo(q.SubQuestions)));
    }
    const grouped = groupQuestionResponsesByAppliesTo(q);
    if (grouped && hasItems(grouped)) {
      result.push(...grouped);
    }
  });  
  return result;
}

/**
 * Get responses for a question by the AppliesTo field.
 * @param questions
 */
const groupQuestionResponsesByAppliesTo = (question: QuestionAndResponse) => {
  return chain(question?.Responses)
      .groupBy('AppliesTo')
      .map((value: any, key: any) => {
        return ({ key, value });
      })
      .value();
}

/**
 * Get all objectives linked to a step's questions.
 * @param step
 * @param objectives
 */
export const findObjectivesForWizardStep = (step: WizardStep, objectives: Objective[]) => {
  const result: Objective[] = [];
  if (hasItems(step?.questions) && step?.questions) {
    result.push(...findObjectivesForQuestions(step?.questions, objectives));
  };
  if (hasItems(step?.steps) && step?.steps) {
    step?.steps?.forEach(s => result.push(...findObjectivesForWizardStep(s, objectives)));
  }

  return result;
}


/**
 * Get all objectives linked to a list of questions.
 * @param questions
 * @param objectives
 */
export const findObjectivesForQuestions = (questions: QuestionAndResponse[], objectives: Objective[]) => {
  const result: Objective[] = [];
  questions?.forEach(q => {
    q?.Responses?.forEach(r => {
      const objective = objectives?.find(o => o.InterviewResponseID === r.InterviewResponseID);
      if (objective) {
        result.push(objective);
      }
    });
    if (q?.SubQuestions) {
      const subQuestionResult = findObjectivesForQuestions(q?.SubQuestions, objectives);
      if (hasItems(subQuestionResult)) {
        result.push(...subQuestionResult);
      }
    }

  })
  return result;
}

/**
 * Compute number of responses in a step, including from sub questions.
 * @param question
 */
export const computeStepResponseCount = (step: WizardStep, objectives?: Objective[], header?: boolean) => {
  let result = 0;
  if (hasItems(step?.questions)) {
    step?.questions?.forEach(q => {
      result += computeQuestionResponseCount(q);
    })
  }

  if (hasItems(step?.steps)) {
    step?.steps?.forEach(s => {
      result += computeStepResponseCount(s);
    })
  }

  if(objectives)
  {
    if(header) {
      objectives.forEach(o => {if(o.QuestionID == 0 && o.DimensionOfLifeID == step?.steps?.find(x=>x!==undefined)?.dimensionOfLife?.DimensionOfLifeID) result++; });
    }
    else {
      objectives.forEach(o => {if(o.QuestionID == 0 && o.DimensionOfLifeID == step?.dimensionOfLife?.DimensionOfLifeID && o.MetricOfSuccessID == step?.metricOfSuccess?.MetricOfSuccessID) result++; });
    }
  }

  return result;
}

/**
 * Compute number of responses in a step for a specific person, including from sub questions.
 * @param step
 * @param appliesTo
 */
export const computeStepResponseCountByAppliesTo = (step: WizardStep, appliesTo: number) => {
  let result = 0;

  if (hasItems(step?.questions)) {
    step?.questions?.forEach(q => {
      result += computeQuestionResponseCountByAppliesTo(q, appliesTo);
    })
  }

  if (hasItems(step?.steps)) {
    step?.steps?.forEach(s => {
      result += computeStepResponseCountByAppliesTo(s, appliesTo);
    })
  }

  return result;
}

/**
 * Compute number of responses in a question.
 * @param question
 */
export const computeQuestionResponseCount = (question: QuestionAndResponse) => {
  let result = 0;
  question?.Responses?.forEach(r => {
    if (!isNullOrUndefined(r?.InterviewResponseID)) {
      result++;
    }
  })

  if (hasItems(question?.SubQuestions)) {
    question?.SubQuestions?.forEach(q => {
      result += computeQuestionResponseCount(q);
    })
  }

  return result;
}

/**
 * Compute number of responses in a question, including from sub questions.
 * @param question
 */
export const computeNestedQuestionResponseCount = (question: QuestionAndResponse) => {
  let result = question?.Responses ? question?.Responses?.length : 0;

  if (hasItems(question?.SubQuestions)) {
    question?.SubQuestions?.forEach(q => {
      result += computeQuestionResponseCount(q);
    })
  }

  return result;
}

/**
 * Compute number of responses in a question for a specific person, including from sub questions.
 * @param question
 * @param appliesTo
 */
export const computeQuestionResponseCountByAppliesTo = (question: QuestionAndResponse, appliesTo: number) => {
  let result = question?.Responses ? countBy(question?.Responses, (r: InterviewResponse) => r?.AppliesTo === appliesTo) : 0;

  if (hasItems(question?.SubQuestions)) {
    question?.SubQuestions?.forEach(q => {
      result += computeQuestionResponseCountByAppliesTo(q, appliesTo);
    })
  }

  return result;
}

/**
 * Compute number of additional priorities for a specific person.
 * @param objectives
 * @param appliesTo
 */
 export const computeAdditionalPriorityCountByAppliesTo = (objectives: Objective[], appliesTo: number, DimensionOfLifeID: number, MetricOfSuccessID: number) => {
  let result = 0;
  objectives.forEach(o => {
    if(o?.PersonID === appliesTo && o.QuestionID === 0 && o.MetricOfSuccessID === MetricOfSuccessID && o.DimensionOfLifeID === DimensionOfLifeID) result +=1;
  });
  return result;
}
