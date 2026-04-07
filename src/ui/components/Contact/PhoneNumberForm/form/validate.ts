import {object} from 'yup';
import {PhoneNumberRequired, required} from 'ui/configs/formik/validators';

const validate = object().shape({
    PhoneNumberTypeID: required,
    PhoneNumber: PhoneNumberRequired
});

export default validate;
