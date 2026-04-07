import moment from 'moment';
import {string, number, ref} from 'yup';
import {isCustomDateValid} from "~/ui/constants/utils";


export const errors = {
  required: 'Field is required',
  email: {
    incorrect: 'Email address must be valid (format: john@doe.com)',
    length: 'Email Address must be no longer than 100 characters',
  },
};

export const validateDateText = (value: any) => {
  if(value)
  {
    if ((moment(value, 'MM/DD/YYYY', true).isValid()) ||
        (moment(value, 'M/D/YYYY', true).isValid()) ||
        (moment(value, 'MM/YYYY', true).isValid()) ||
        (moment(value, 'M/YYYY', true).isValid()) ||
        (moment(value, 'YYYY', true).isValid())) {
        return true;
    }
  } else return true;

  return false;
}

// NOTE: these need to match the property name exactly (i.e. case sensitive)
export const notEmpty = string().test("notEmpty", errors.required, (value: string) => {
  return value && value.trim().length > 0
})
export const CustomDate = string().test((val:string|undefined) => !val || isCustomDateValid(val)).nullable()
export const CustomDateRequired = string().required(errors.required).test((val:string) => isCustomDateValid(val) )
export const required = string().trim().required(errors.required);
export const Username = string().email('Email is required').required(errors.required);
export const Password = string().min(10).required(errors.required);
export const RegistrationCode = string().required(errors.required);
export const GenericName = string().min(5).trim().required(errors.required);
export const HouseholdName = string().trim().required(errors.required);
export const PhoneNumber = string().test((val:string) =>  !(/[a-zA-Z]+/.test(val ?? "")))
export const PhoneNumberRequired = string().test((val:string) => !/[a-zA-Z]+/.test(val)).required(errors.required);
export const Email = string().email(errors.email.incorrect).nullable();
export const EmailRequired = string().email(errors.email.incorrect).required(errors.required);
export const selectRequired = number().required(errors.required).positive(errors.required);
export const DateText = string().test(
  "DOB",
  "Invalid Date Format. Please use the '/' separator",
  (  value: any) => {
    return validateDateText(value);
  }
)
export const currentPassword = string().min(10,'Current Password must be at least 10 characters').required('Current Password is required');
export const newPassword = string().min(10,'New Password must be at least 10 characters').required('New Password is required')
export const confirmPassword = string().min(10).required('Confirm Password is required')
   .oneOf([ref('newPassword'), null], 'Passwords must match')