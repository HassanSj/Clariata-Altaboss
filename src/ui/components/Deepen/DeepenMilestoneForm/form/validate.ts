import {object} from 'yup';
import {DateText, required} from 'ui/configs/formik/validators';

const validateMilestone = object().shape({
  MilestoneName: required,
  StartDate: required,
});

export default validateMilestone;

export const validateTask = object().shape({
  TaskName: required,
  StartDate: required,
});
