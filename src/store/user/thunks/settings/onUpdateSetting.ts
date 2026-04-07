import {thunk, Thunk} from 'easy-peasy';
import {AxiosResponse} from 'axios';
import api from 'services/api';
import {processServerError} from 'services/api/errors';
import {IUserStorageModel} from 'types/user/store';

interface IPayload {
  name: string;
  value: string;
}

const onUpdateSetting: Thunk<IUserStorageModel, unknown> = thunk(async ({ updateSetting }, { name, value }: IPayload) => {
  try {
    const updateResponse: AxiosResponse = await api.user.updateSetting(name, value);
    updateSetting({
      SettingName: name,
      SettingValue: value
    });
  } catch (err) {
    processServerError(err, 'user.settings.onUpdateSetting');
  }
});

export default onUpdateSetting;
