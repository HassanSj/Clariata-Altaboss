import { action, Action } from 'easy-peasy';
import { IWizardStoreModel } from "~/types/wizard/store";
interface IPayload {
    toggleExpanded: boolean;
    singleExpanded?: boolean;
}

const setSingleExpanded: Action<IWizardStoreModel> = action((state: any, payload: any) => {
    console.log('Single payload =>', payload)
    if (payload=="all") {
        state.wizard.singleExpanded = payload;
    } else {
        state.wizard.singleExpanded = "single";
    }
});

export default setSingleExpanded;