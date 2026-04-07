import {thunk, Thunk} from 'easy-peasy';
import { IContactStoreModel } from '~/types/contact/store';

const onSetSaved: Thunk<IContactStoreModel, any> = thunk(async ({ setSaved }, payload: any) => {
  setSaved(payload);
});

export default onSetSaved;
