import {object} from 'yup';
import {CustomDate, Email, required} from 'ui/configs/formik/validators';

const validate = object().shape({
  PersonTypeID: required,
  FirstName: required,
  LastName: required,
  EmailAddress: Email,
  // DateOfBirth: CustomDate,
  // DateOfDeath: CustomDate,
  // MarriageDate: CustomDate,
  // DivorcedDate: CustomDate,
  // SeparatedDate: CustomDate,
  // WidowedDate: CustomDate
});

export default validate;
