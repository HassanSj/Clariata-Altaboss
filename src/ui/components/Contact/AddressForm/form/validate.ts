import {object} from 'yup';
import {required} from 'ui/configs/formik/validators';

const validate = object().shape({
  // AddressDescription: required,
  // StreetAddress: required,
  // City: required,
  // StateRegion: required,
  // Country: required,
  // PostalCode: required
});

export default validate;
