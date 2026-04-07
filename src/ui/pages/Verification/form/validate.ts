import {object} from 'yup';
import {Username} from 'ui/configs/formik/validators';

const validate = object().shape({
  Username,
});

export default validate;
