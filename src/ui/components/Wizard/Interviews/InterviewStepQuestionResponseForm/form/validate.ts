import {object} from 'yup';
import {required} from 'ui/configs/formik/validators';

const validate = object().shape({
  ResponseText: required,
  AppliesTo: required
});

export default validate;
