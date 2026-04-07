import {object} from 'yup';
import {required, Email} from 'ui/configs/formik/validators';

const validate = object().shape({
  Email: Email,
  Permission: required
});

export default validate;
