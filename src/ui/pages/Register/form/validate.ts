import {object} from 'yup';
import {EmailRequired, Password, required, Username, confirmPassword} from 'ui/configs/formik/validators';

const validate = object().shape({
  Password: Password,
});

export default validate;
