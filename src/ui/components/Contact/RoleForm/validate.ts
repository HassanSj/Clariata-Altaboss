import {object} from 'yup';
import {CustomDate, required} from 'ui/configs/formik/validators';
import * as Yup from "yup";

const validate = object().shape({
    Role: required,
    ForPerson: required
});

export default validate;
