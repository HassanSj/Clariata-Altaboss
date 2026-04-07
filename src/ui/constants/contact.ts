export enum ContactDataType {
  VIEW = 'View',
  PERSON = 'Person',
  PHONE_NUMBER = 'PhoneNumber',
  ADDRESS = 'Address',
  RELATIONSHIP = 'Relationship',
  EDUCATION = 'Education',
  WORK = 'Work',
  COMMENT = 'Comment',
  PHOTO = 'Photo',
  FAMILY_PHOTO = "Family Photo",
  COUPLE_PHOTO = "Couple Photo",
  LOGO = "Logo",
  ROLE = "Role",
  COMPANY = "Company"
}

export const ContactDataTypes = {
  [ContactDataType.VIEW]: false,
  [ContactDataType.PERSON]: false,
  [ContactDataType.PHONE_NUMBER]: false,
  [ContactDataType.ADDRESS]: false,
  [ContactDataType.RELATIONSHIP]: false,
  [ContactDataType.EDUCATION]: false,
  [ContactDataType.WORK]: false,
  [ContactDataType.COMMENT]: false,
  [ContactDataType.PHOTO]: false,
  [ContactDataType.FAMILY_PHOTO]: false,
  [ContactDataType.COUPLE_PHOTO]: false,
  [ContactDataType.LOGO]:false,
  [ContactDataType.ROLE]:false,
  [ContactDataType.COMPANY]:false
};
