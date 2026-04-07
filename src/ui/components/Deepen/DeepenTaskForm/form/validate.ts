import {object} from 'yup';
import {DateText, required} from 'ui/configs/formik/validators';

export const validateTask = object().shape({
  TaskName: required,
  StartDate: required,
});

export default validateTask;
