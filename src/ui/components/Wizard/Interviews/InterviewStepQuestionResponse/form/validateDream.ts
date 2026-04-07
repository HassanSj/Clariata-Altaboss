import {object} from 'yup';
import {notEmpty, required} from 'ui/configs/formik/validators';

const validateDream = object().shape({
  AppliesTo: required
});

export default validateDream;
