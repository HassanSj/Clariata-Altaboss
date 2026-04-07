import {object} from 'yup';
import {HouseholdName} from 'ui/configs/formik/validators';

const validate = object().shape({
  HouseholdName: HouseholdName
});

export default validate;
