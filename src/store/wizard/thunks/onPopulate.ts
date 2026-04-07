import {thunk, Thunk} from 'easy-peasy';
import {processServerError} from 'services/api/errors';
import {IWizardStoreModel} from "~/types/wizard/store";
import {WizardState} from "~/types/wizard/wizard";
import {WizardDataType} from "~/ui/constants/wizard";
import {isNullOrUndefined} from "~/ui/constants/utils";
import {updateWizardState} from "~/services/interview";

const onPopulate: Thunk<IWizardStoreModel, WizardState> = thunk(async ({ populate, select }, payload: WizardState, helpers) => {
  const store: any = helpers.getStoreState();
  try {
    // Refresh wizard state
    const newWizardState = updateWizardState(payload);

    // Populate wizard
    populate(newWizardState);

    // Get active from settings


    // Set active
    const activeStepIndex = !isNullOrUndefined(store?.wizard?.activeStepIndex) ? store?.wizard?.activeStepIndex : 0;
    const activeSubStepIndex = !isNullOrUndefined(store?.wizard?.activeSubStepIndex) ? store?.wizard?.activeSubStepIndex : 0;
    const activeQuestionIndex = !isNullOrUndefined(store?.wizard?.activeQuestionIndex) ? store?.wizard?.activeQuestionIndex : 0;
    const activeParentQuestionIndex = !isNullOrUndefined(store?.wizard?.activeParentQuestionIndex) ? store?.wizard?.activeParentQuestionIndex : 0;

    const activeStep = newWizardState.steps[activeStepIndex];
    const activeSubStep = activeStep?.steps![activeSubStepIndex];
    select({
      type: WizardDataType.STEP,
      step: activeStep
    });
    select({
      type: WizardDataType.SUB_STEP,
      step: activeSubStep
    });


    /*
    if (!isNullOrUndefined(newWizardState)
      && !isNullOrUndefined(newWizardState?.activeStepIndex)
      && !isNullOrUndefined(newWizardState?.steps)) {
      // Set active step
      const prevActiveStep = newWizardState?.steps[newWizardState?.activeStepIndex];
      select({
        type: WizardDataType.STEP,
        step: prevActiveStep
      });
      // Set active sub step
      if (!isNullOrUndefined(prevActiveStep)
        && !isNullOrUndefined(prevActiveStep?.steps)
        && !isNullOrUndefined(newWizardState?.activeSubStepIndex)
        && prevActiveStep?.steps
        && prevActiveStep?.steps?.length > newWizardState?.activeSubStepIndex) {
        select({
          type: WizardDataType.SUB_STEP,
          step: prevActiveStep?.steps[newWizardState?.activeSubStepIndex]
        });
      } else {
        logSimple('onPopulate.fail2', {
          newWizardState
        })
      }
    } else {
      logSimple('onPopulate.fail', {
        newWizardState
      })
    }

     */

  } catch (err) {
    processServerError(err, 'wizard.onPopulate');
  }
});

export default onPopulate;
