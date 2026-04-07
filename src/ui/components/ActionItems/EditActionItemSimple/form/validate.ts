import {object} from 'yup';
import {GenericName, required} from 'ui/configs/formik/validators';

const validate = object().shape({
  Description: required
});

export default validate;
