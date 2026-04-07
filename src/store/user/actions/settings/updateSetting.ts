import {action, Action} from 'easy-peasy';
import {IUserStorageModel} from 'types/user/store';
import {UserSetting} from "~/types/api/userSetting";

const updateSetting: Action<IUserStorageModel, UserSetting> = action((state: any, payload: any) => {
  if (!state.settings){
    state.settings = [];
  }
  const index = state.settings.findIndex((setting: UserSetting) => setting.SettingName === payload.SettingName);
  if (index > -1){
    state.settings[index] = payload;
    return;
  }
  state.settings.push(payload);
});

export default updateSetting;
