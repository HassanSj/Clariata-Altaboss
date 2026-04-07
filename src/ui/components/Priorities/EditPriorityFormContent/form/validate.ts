import {object, lazy, string} from 'yup';
import {DateText, required, selectRequired} from 'ui/configs/formik/validators';

const validate = object().shape({
  Description: required,
  DimensionOfLifeID: selectRequired,
  MetricOfSuccessID: required,
  PersonID: required,
  StartDate: DateText,
  ProjectedEndDate: DateText,
});

export default validate;
