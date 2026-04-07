import {action, Action} from 'easy-peasy';
import {IConstantTypesStoreModel} from 'ui/constants/store';

interface IPayload {
  name: string;
  values: [];
}

const populate: Action<IConstantTypesStoreModel, any> = action((state: any, payload: IPayload) => {
  state[payload.name] = payload.values;
});

export default populate;
