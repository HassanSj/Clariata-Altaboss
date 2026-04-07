import {object} from 'yup';
import {required} from 'ui/configs/formik/validators';

const validate = object().shape({
    Category: required,
    Subcategory: required,
    Title: required,
    Description: required
});

export default validate;