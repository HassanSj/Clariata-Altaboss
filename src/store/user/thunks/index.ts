import onLogin from './auth/onLogin';
import onLogout from './auth/onLogout';
import onCheckAuth from './auth/onCheckAuth';
import onUpdate from './crud/onUpdate';
import onPopulate from './crud/onPopulate';
import onPopulateUsers from './crud/onPopulateUsers';
import onPopulateSettings from './settings/onPopulateSettings';
import onUpdateSetting from './settings/onUpdateSetting';
import onPopulatePermissions from './permissions/onPopulatePermissions';
import onUpdateNotification from './notifications/onUpdateNotification';
import onPopulateNotifications from './notifications/onPopulateNotifications';

export default {
  onLogin,
  onLogout,
  onCheckAuth,
  onUpdate,
  onPopulate,
  onPopulateUsers,
  onPopulateSettings,
  onUpdateSetting,
  onPopulatePermissions,
  onUpdateNotification,
  onPopulateNotifications
};
