import {object} from 'yup';
import {required, GenericName} from '~/ui/configs/formik/validators';

const validate = object().shape({
  // Description: required,
  ComplexityOfNeedsID: required,
  LegacyInterestID: required
});

export default validate;
