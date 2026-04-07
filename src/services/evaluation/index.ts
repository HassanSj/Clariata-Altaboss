import {ClientEvaluation} from "~/types/api/clientEvaluation";
import {WizardState, WizardStep} from "~/types/wizard/wizard";
import {
  DEFAULT_WIZARD_QUESTION,
  DEFAULT_WIZARD_QUESTION_AND_RESPONSE,
  DEFAULT_WIZARD_STATE,
  DEFAULT_WIZARD_STEP,
  WizardStepType,
  WizardType
} from "~/ui/constants/wizard";
import {QuestionAndResponse} from "~/types/api/questionAndResponse";
import {FormInputType} from "~/ui/constants/forms";
import {ComplexityOfNeed} from "~/types/api/complexityOfNeed";
import {IFormInputOption} from "~/types/forms";
import {LegacyInterest} from "~/types/api/legacyInterest";
import {getAllWizardQuestions, updateWizardState} from "~/services/interview";
import {get, set} from 'lodash';

/**
 * Generate wizard from client evaluation model.
 * @param evaluation
 */
export const toEvaluationWizard = (complexityOfNeeds: ComplexityOfNeed[],
                                   legacyInterests: LegacyInterest[],
                                   evaluation?: ClientEvaluation) => {
  const wizard: WizardState = DEFAULT_WIZARD_STATE;
  wizard.type = WizardType.EVALUATION;
  wizard.title = "Client Evaluation";
  wizard.steps = [];
  wizard.subSteps = [];

  // Add one top level step (wizard hides top level steps if only one exists)
  const step: WizardStep = {
    ...DEFAULT_WIZARD_STEP,
    type: WizardStepType.STEP,
    title: `Evaluation`,
    steps: [
      {
        ...DEFAULT_WIZARD_STEP,
        type: WizardStepType.SUB_STEP,
        title: `Intro`,
        questions: [buildSimpleQuestion('Description', 'Evaluation Name', 'Clariata is a strategic planning and implementation tool for families. We use it to map out a course of action for families who can benefit from the process. It gives us the ability to see the big picture in addressing all the issues that matter to our client-families. To determine if My-LifePrint is right for you, I have a few questions I\'d like to ask you if that\'s okay.')]
      },
      {
        ...DEFAULT_WIZARD_STEP,
        type: WizardStepType.SUB_STEP,
        title: `Goals`,
        questions: [buildSimpleQuestion('GoalsDetail', 'What are you trying to accomplish at this point in your life?')]
      },
      {
        ...DEFAULT_WIZARD_STEP,
        type: WizardStepType.SUB_STEP,
        title: `Concerns`,
        questions: [buildSimpleQuestion('ConcernsDetail', ' What are your concerns?')]
      },
      {
        ...DEFAULT_WIZARD_STEP,
        type: WizardStepType.SUB_STEP,
        title: `Affairs`,
        questions: [
          buildSimpleQuestion('ComplexityOfNeedsID', 'How would you classify the complexity of your family\'s affairs?',
            undefined,
            FormInputType.SELECT,
            complexitiesToFormOptions(complexityOfNeeds)),
          buildSimpleQuestion('NeedsDetail', 'How complex are your family\'s affairs?')
        ]
      },
      {
        ...DEFAULT_WIZARD_STEP,
        type: WizardStepType.SUB_STEP,
        title: `Legacy`,
        questions: [
          buildSimpleQuestion('LegacyInterestID', 'What is your interest in perpetuating a family legacy and what do you want to pass on to your family?',
            undefined,
            FormInputType.SELECT,
            legaciesToFormOptions(legacyInterests)),
          buildSimpleQuestion('LegacyDetail', 'Advisor: Can you talk about what you want to pass on to your family?')
        ]
      },
    ]
  };

  wizard.steps.push(step);

  const result = updateWizardState(wizard, undefined, evaluation);
  return result;
}

/**
 * Map question responses to client evaluation model.
 * @param wizard
 * @param evaluation
 */
export const mapResponsesToEvaluation = (wizard: WizardState, evaluation: ClientEvaluation) => {
  const questions: QuestionAndResponse[] = getAllWizardQuestions(wizard);
  if (questions) {
    questions.forEach((question: QuestionAndResponse) => {
      const inputName = get(question, 'Question.InputName');
      const inputValue = null; // TODO
      set(evaluation, inputName, inputValue);
    })
  }
  return evaluation;
}

/**
 * Build question helpers.
 * @param text
 */
export const buildSimpleQuestion = (name: string,
                                    text: string,
                                    directions?: string,
                                    inputType?: FormInputType,
                                    options?: IFormInputOption[]): QuestionAndResponse => {
  return {
    ...DEFAULT_WIZARD_QUESTION_AND_RESPONSE,
    Question: {
      ...DEFAULT_WIZARD_QUESTION,
      QuestionName: text,
      QuestionText: text,
      Directions: directions,
      InputName: name,
      InputType: inputType ? inputType : FormInputType.TEXTAREA,
      InputOptions: options,
    }
  }
}

/**
 * Convert complexity of needs into generic select options.
 * @param complexityOfNeeds
 */
export const complexitiesToFormOptions = (complexityOfNeeds: ComplexityOfNeed[]) => {
  const result: IFormInputOption[] = [];
  complexityOfNeeds.forEach((c: ComplexityOfNeed) => {
    result.push({
      label: c?.ComplexityOfNeedsValue ? c.ComplexityOfNeedsValue : 'N/A',
      value: c.ComplexityOfNeedsID
    })
  });

  return result;
}

/**
 * Convert legacy interests into generic select options.
 * @param legacyInterests
 */
export const legaciesToFormOptions = (legacyInterests: LegacyInterest[]) => {
  const result: IFormInputOption[] = [];
  legacyInterests.forEach((c: LegacyInterest) => {
    result.push({
      label: c?.LegacyInterestValue ? c.LegacyInterestValue : 'N/A',
      value: c.LegacyInterestID
    })
  });

  return result;
}
