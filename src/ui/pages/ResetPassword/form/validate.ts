import {object} from 'yup';
import {Password} from 'ui/configs/formik/validators';

const validate = object().shape({
  Password,
});

export default validate;
