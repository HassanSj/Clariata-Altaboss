import {object} from 'yup';
import {CustomDate, PhoneNumber, required} from 'ui/configs/formik/validators';
import * as Yup from "yup";

const validate = object().shape({
    Company: required,
    StartDate: CustomDate,
    EndDate: CustomDate,
    PhoneNumber,
    SuccessionDate: CustomDate,
    RetirementDate: CustomDate,
    PlannedSuccessionDate: CustomDate,
    PlannedRetirementDate: CustomDate,
});

export default validate;
