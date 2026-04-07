import {object} from 'yup';
import {Email, required} from 'ui/configs/formik/validators';

const validate = object().shape({
    IssuedTo: required,
    EmailAddress: Email,
    RegistrationCode: required,
});

export default validate;