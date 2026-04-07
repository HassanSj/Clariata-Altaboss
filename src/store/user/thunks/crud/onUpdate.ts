import {thunk, Thunk} from 'easy-peasy';
import {AxiosResponse} from 'axios';
import api from 'services/api';
import {extractServerError} from 'services/api/errors';
import {IUserStorageModel} from 'types/user/store';
import {logSimple} from '~/ui/constants/utils';
import {IFormThunkPayload} from "~/types/forms";

const onUpdate: Thunk<IUserStorageModel, IFormThunkPayload> = thunk(async ({ update }, payload) => {
  const { id, values, setErrors } = payload;
  try {
    if (!id) {
      return;
    }
    const res: AxiosResponse = await api.user.update(id, values);
    update(res.data);
    setErrors({ infoMessage: 'Changes saved!' });
  } catch (err) {
    logSimple('onLogin.error', err);
    setErrors({ backError: extractServerError(err) });
  }
});

export default onUpdate;
