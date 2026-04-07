import {object} from 'yup';
import {required} from 'ui/configs/formik/validators';

const validate = object().shape({
    FirstName: required,
    LastName: required,
});

export default validate;
