import {object} from 'yup';
import {required} from 'ui/configs/formik/validators';

const validate = object().shape({
  Comment: required,
});

export default validate;
