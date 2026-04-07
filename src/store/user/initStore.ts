import {User} from "~/types/api/user";
import {UserSetting} from "~/types/api/userSetting";

interface InitStore {
  authorized: boolean;
  authChecked: boolean;
  UserTypeID: number;
  user: User;
  settings: UserSetting[];
}

const initStore: InitStore = {
  authorized: false,
  authChecked: true,
  UserTypeID: 0,
  user: {
    UserID: undefined,
    Username: undefined,
  },
  settings: []
};

export default initStore;
