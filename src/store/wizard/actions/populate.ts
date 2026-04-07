import {action, Action} from 'easy-peasy';
import {WizardState} from "~/types/wizard/wizard";

const populate: Action<WizardState> = action((state: any, payload: any) => {
  state.wizard = payload;
});

export default populate;
