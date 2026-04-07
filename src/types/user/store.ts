import {Action, Thunk} from 'easy-peasy';
import {User} from "~/types/api/user";
import {UserSetting} from "~/types/api/userSetting";
import {SharedItem} from "~/types/api/sharedItem";
import {Notification} from "~/types/api/notification";

export interface IUserStorageModel {
  user: User;
  settings: UserSetting[];
  permissions: SharedItem[];
  users: User[];
  notifications: Notification[];
  authorized: boolean;
  authChecked: boolean;
  UserTypeID: number;
  login: Action<IUserStorageModel, unknown>;
  logout: Action<IUserStorageModel, unknown>;
  changeAuth: Action<IUserStorageModel, unknown>;
  update: Action<IUserStorageModel, unknown>;
  onLogin: Thunk<IUserStorageModel, unknown>;
  onLogout: Thunk<IUserStorageModel, unknown>;
  onCheckAuth: Thunk<IUserStorageModel, unknown>;
  onRegister: Thunk<IUserStorageModel, unknown>;
  onUpdate: Thunk<IUserStorageModel, unknown>;
  onPopulate: Thunk<IUserStorageModel, unknown>;
  populate: Thunk<IUserStorageModel, unknown>;
  onPopulateSettings: Thunk<IUserStorageModel, unknown>;
  onUpdateSetting: Thunk<IUserStorageModel, unknown>;
  populateSettings: Action<IUserStorageModel, unknown>;
  updateSetting: Action<IUserStorageModel, unknown>;
  onPopulatePermissions: Thunk<IUserStorageModel, unknown>;
  populatePermissions: Action<IUserStorageModel, unknown>;
  onPopulateUsers: Thunk<IUserStorageModel, unknown>;
  updateUsers: Action<IUserStorageModel, unknown>;

  populateNotifications: Action<IUserStorageModel, unknown>;
  updateNotification: Action<IUserStorageModel, unknown>;
  onPopulateNotifications: Thunk<IUserStorageModel, unknown>;
  onUpdateNotification: Thunk<IUserStorageModel, unknown>;
}