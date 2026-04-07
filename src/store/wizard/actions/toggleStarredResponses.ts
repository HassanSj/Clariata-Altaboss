import {action, Action} from 'easy-peasy';
import {IWizardStoreModel} from "~/types/wizard/store";

const toggleStarredResponses: Action<IWizardStoreModel, boolean> = action((state: any, payload: boolean) => {
  state.showStarredResponsesOnly = payload;
});

export default toggleStarredResponses;
