import {object} from 'yup';
import {required} from 'ui/configs/formik/validators';

const validate = object().shape({
  Description: required,
  PersonID: required
});

export default validate;