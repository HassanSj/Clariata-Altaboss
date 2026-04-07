import {action, Action} from 'easy-peasy';
import {ILayoutStoreModel} from 'types/layout/store';

const setLoading: Action<ILayoutStoreModel, any> = action((state: any, payload: any) => {
    state.isLoading = payload;
});

export default setLoading;
