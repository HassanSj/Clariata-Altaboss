import {action, Action} from 'easy-peasy';
import { IContactStoreModel } from '~/types/contact/store';

const setSaved: Action<IContactStoreModel, unknown> = action((state: any, payload: any) => {
    state.unsaved = payload?.saved;
});

export default setSaved;