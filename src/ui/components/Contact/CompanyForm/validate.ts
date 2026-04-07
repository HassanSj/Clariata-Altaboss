import {object} from 'yup';
import {CustomDate, Email, PhoneNumber, required} from 'ui/configs/formik/validators';
import * as Yup from "yup";

const validate = object().shape({
    Name: required,
    Phone: PhoneNumber,
    Email,
    FoundedDate: CustomDate,
    AcquisitionDate:CustomDate,
    SoldDate:CustomDate,
    ProjectedSellDate:CustomDate,
    PlannedSuccessionDate:CustomDate
});

export default validate;
