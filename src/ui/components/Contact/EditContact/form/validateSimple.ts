import {object} from 'yup';
import {required} from 'ui/configs/formik/validators';

const validateSimple = object().shape({
  FirstName: required
});

export default validateSimple;
