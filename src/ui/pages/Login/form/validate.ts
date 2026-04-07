import {object} from 'yup';
import {Password, Username} from 'ui/configs/formik/validators';

const validate = object().shape({
  Username,
  Password,
});

export default validate;
