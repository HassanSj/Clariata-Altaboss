import {object} from 'yup';
import {CustomDate, DateText, GenericName, required} from 'ui/configs/formik/validators';

const validate = object().shape({
    InstitutionName: GenericName,
    CompletionDate: CustomDate,
    GraduationDate: CustomDate
    // CompletionDate: DateText
});

export default validate;
