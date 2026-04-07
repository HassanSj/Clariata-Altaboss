import {thunk, Thunk} from 'easy-peasy';
import {AxiosResponse} from 'axios';
import api from 'services/api';
import {setAccessToken, setAuthenticated, setSessionGUID} from 'services/auth';
import {extractServerError, isUnauthorized} from 'services/api/errors';
import {IUserStorageModel} from 'types/user/store';
import paths from '~/ui/constants/paths';
import {UserSettingType} from "~/ui/constants/settings";
import {IFormThunkPayload} from "~/types/forms";
import { getResponsesByPerson } from '~/services/interview';
import person from '~/store/person';

const { DASHBOARD, ADVISOR_DASHBOARD } = paths;

const onLogin: Thunk<IUserStorageModel, IFormThunkPayload> = thunk(async ({ login, changeAuth }, payload, helpers) => {
  const store: any = helpers.getStoreActions();
  const { values, setErrors, router } = payload;
  try {

    // Set loading
    store.layout.setLoading(true);

    ////Login user and get userId
    const res: AxiosResponse = await api.user.login(values);
    const {data: {UserID, SessionGUID, JWTToken}} = res;
    await setAccessToken(JWTToken);
    await setSessionGUID(SessionGUID);
    await setAuthenticated(true);

    // If no error, then success
    setErrors({ infoMessage: 'Loading data... Please wait..'});

    // Load data
    // // Populate user data
    await store.user.onPopulate();
    await store.user.onPopulateSettings();
    await store.user.onPopulateNotifications();
    await store.user.onPopulatePermissions();
    //await store.changeAuth(true);
    //await store.person.onPopulate();
    //await store.household.onPopulate();
    // Populate constants
    //await store.constants.onPopulate();
    

    // Load selected household, if any
    // const selectedHousehouldSetting: AxiosResponse = await api.user.getSetting(UserSettingType.SelectedHouseholdID);
    // const selectedHouseholdId = selectedHousehouldSetting?.data?.SettingValue;
    // if (selectedHouseholdId) {
    //   //const household = await api.household.get(selectedHouseholdId);
    //   //await store.household.onSelect({ household: household?.data });
    //   await store.selected.onSelectHousehold(selectedHouseholdId);
    //   await store.selected.onSelectDiscoverInterview(0);
    //   await store.selected.onSelectDreamInterview(0);
    //   //call api to get Primary1 and Primary2
    //   const response = await api.household.get(selectedHouseholdId);
    //   const household = response.data;
    //   await store.selected.OnSelectPrimary(household);
    // }

    await store.selected.onSelectContact(0);
    

    // Hide loading
    store.layout.setLoading(false);

    // // Change auth
    setAuthenticated(true);
    // // Clear
    login(null);

    console.log("No Error");
    // Redirect to app page
    router.replace(ADVISOR_DASHBOARD);

  } catch (err) {
    store.layout.setLoading(false);
    console.log("Error");
    // Process error
    if (isUnauthorized(err)) {
      setErrors({ backError: 'Username or password is incorrect.' });
    } else {
      setErrors({ backError: extractServerError(err) });
    }
  }
});

export default onLogin;
