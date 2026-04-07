import {object} from 'yup';
import {required} from 'ui/configs/formik/validators';

const validate = object().shape({
  // ActionItemID: required,
  PersonID: required
});

export default validate;
