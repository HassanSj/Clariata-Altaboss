import {object} from 'yup';
import {GenericName} from 'ui/configs/formik/validators';

const validate = object().shape({
  Description: GenericName
});

export default validate;
