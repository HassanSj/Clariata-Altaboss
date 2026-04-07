import {object} from 'yup';
import {required} from 'ui/configs/formik/validators';

const validate = object().shape({
  // ObjectiveID: required,
  PersonID: required,
});

export default validate;
