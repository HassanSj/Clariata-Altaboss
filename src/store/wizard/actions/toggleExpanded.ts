import { action, Action } from 'easy-peasy';
import { IWizardStoreModel } from "~/types/wizard/store";
interface IPayload {
    toggleExpanded: boolean;
    singleExpanded?: boolean;
}   

const toggleExpanded: Action<IWizardStoreModel> = action((state: any, payload: any) => {
    console.log('payload=>', payload)
    if (payload) {
        state.wizard.toggleExpanded = payload
       
    }
    else {
        state.wizard.toggleExpanded = false
    }
});

export default toggleExpanded;
