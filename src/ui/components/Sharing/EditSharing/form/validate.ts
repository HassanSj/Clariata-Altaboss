import {object} from 'yup';
import {Email, required} from 'ui/configs/formik/validators';

const validate = object().shape({
    EmailAddress: Email,
    ShareTypeID: required,
});

export default validate;
