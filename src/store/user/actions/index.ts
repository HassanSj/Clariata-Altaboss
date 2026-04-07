import login from './auth/login';
import logout from './auth/logout';
import changeAuth from './auth/changeAuth';
import update from './crud/update';
import updateUsers from './crud/updateUsers';
import populate from './crud/populate';
import populateSettings from './settings/populateSettings';
import updateSetting from './settings/updateSetting';
import populatePermissions from './permissions/populatePermissions';
import updateNotification from './notifications/updateNotification';
import populateNotifications from './notifications/populateNotifications';

export default {
  login,
  logout,
  changeAuth,
  update,
  updateUsers,
  populateSettings,
  updateSetting,
  populate,
  populatePermissions,
  updateNotification,
  populateNotifications
};
