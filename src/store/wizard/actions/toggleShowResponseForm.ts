import {action, Action} from 'easy-peasy';
import {IWizardStoreModel} from "~/types/wizard/store";

const toggleShowResponseForm: Action<IWizardStoreModel, boolean> = action((state: any, payload: boolean) => {
  state.showResponseForm = payload;
});

export default toggleShowResponseForm;
