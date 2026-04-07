import {action, Action} from 'easy-peasy';
import {IWizardStoreModel} from "~/types/wizard/store";
import {IInterviewUpdatePayload} from "~/ui/constants/interview";

const toggleFilter: Action<IWizardStoreModel, IInterviewUpdatePayload> = action((state: any, payload: IInterviewUpdatePayload) => {
  let wizard = state.wizard;

  wizard.filtered = wizard.filtered ? !wizard.filtered : true;
  wizard.selectedSections = payload.sections;
  wizard.selectedReport = payload.reportType;
  wizard.hideClarifying = payload.hideClarifying;
  
  state.activeSubStepIndex = 0;

  state.wizard = wizard;
  
});

export default toggleFilter;
