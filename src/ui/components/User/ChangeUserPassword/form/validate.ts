import {object} from 'yup';
import {newPassword, confirmPassword,currentPassword} from 'ui/configs/formik/validators';

const validate = object().shape({
  currentPassword,
  newPassword,
  confirmPassword
});

export default validate;
