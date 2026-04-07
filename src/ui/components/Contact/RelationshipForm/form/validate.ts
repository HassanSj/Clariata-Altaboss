import {object} from 'yup';
import {required} from 'ui/configs/formik/validators';

const validate = object().shape({
    AssociatePersonID: required,
    PersonalRelationshipTypeID: required,
});

export default validate;
