import {object} from 'yup';
import {required} from 'ui/configs/formik/validators';

const validate = object().shape({
    Subcategory: required,
});

export default validate;