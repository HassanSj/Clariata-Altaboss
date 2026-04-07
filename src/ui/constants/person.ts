import {OwnerParams} from "~/types/relations";
import {ApiRequestType, OwnerModelType, OwnerType, PersonType} from "~/ui/constants/api";
import {Person} from "~/types/api/person";
import {get} from 'lodash';
import {AxiosResponse} from "axios";
import api from "~/services/api";
import {processServerError} from "~/services/api/errors";
import {convertStringToDate, convertStringToDateText, getDateType} from "~/ui/constants/utils";
import {formatDate} from "@telerik/kendo-intl";


/**
 * Role related data
 */

export enum RoleType{
  EXECUTOR = 0,
  CO_EXECUTOR = 1,
  SUCCESSOR_EXECUTOR = 2,
  TRUSTEE = 3,
  CO_TRUSTEE = 4,
  SUCCESSOR_TRUSTEE = 5,
  POWER_OF_ATTORNEY = 6,
  SUCCESSOR_POA = 7,
  DURABLE_HEALTH_CARE_POA = 8,
  CO_POA = 9,
  GUARDIAN = 10,
  GUARDIAN_IN_WILL = 11,
  PET_GUARDIAN = 12,
  PET_GUARDIAN_IN_WILL = 13,
  OTHER = 14,
}

export const RoleTypeValues = {
  [RoleType.EXECUTOR]: "Executor",
  [RoleType.CO_EXECUTOR]: "Co-Executor",
  [RoleType.SUCCESSOR_EXECUTOR]: "Successor Executor",
  [RoleType.TRUSTEE]: "Trustee",
  [RoleType.CO_TRUSTEE]: "Co-Trustee",
  [RoleType.SUCCESSOR_TRUSTEE]: "Successor Trustee",
  [RoleType.POWER_OF_ATTORNEY]: "Power of Attorney",
  [RoleType.SUCCESSOR_POA]: "Successor POA",
  [RoleType.DURABLE_HEALTH_CARE_POA]: "Durable Health Care POA",
  [RoleType.CO_POA]: "Co-POA",
  [RoleType.GUARDIAN]: "Guardian",
  [RoleType.GUARDIAN_IN_WILL]: "Guardian in Will",
  [RoleType.PET_GUARDIAN]: "Pet Guardian",
  [RoleType.PET_GUARDIAN_IN_WILL]: "Pet Guardian in Will",
  [RoleType.OTHER]: "Other"
}

export const RoleTypeOptions = Object.keys(RoleTypeValues).map(key => ({
  label: RoleTypeValues[Number(key) as RoleType],
  value: key
}))

/**
 * Industry types
 */

// Agriculture & Forestry/ Wildlife
// Business & Information
// Construction/Utilities/Contracting
// Education
// Finance & Insurance
// Food & Hospitality
// Gaming
// Health Services
// Motor Vehicle
// Natural Resources/ Environmental
// Other
// Personal Services
// Real Estate/Housing
// Safety/Security & Legal
// Transportation

export enum IndustryType{
  AGRICULTURE = 15,
  BUSINESS = 1,
  CONSTRUCTION = 2,
  EDUCATION = 3,
  FINANCE = 4,
  FOOD = 5,
  GAMING = 6,
  HEALTH = 7,
  MOTOR_VEHICLE = 8,
  ENVIRONMENTAL = 9,
  OTHER = 10,
  PERSONAL_SERVICES = 11,
  REAL_ESTATE = 12,
  SAFETY = 13,
  TRANSPORTATION = 14
}

export const IndustryTypeLabels = {
  [IndustryType.AGRICULTURE]: "Agriculture & Forestry/ Wildlife",
  [IndustryType.BUSINESS]: "Business & Information",
  [IndustryType.CONSTRUCTION]: "Construction/Utilities/Contracting",
  [IndustryType.EDUCATION]: "Education",
  [IndustryType.FINANCE]: "Finance & Insurance",
  [IndustryType.FOOD]: "Food & Hospitality",
  [IndustryType.GAMING]: "Gaming",
  [IndustryType.HEALTH]: "Health Services",
  [IndustryType.MOTOR_VEHICLE]: "Motor Vehicle",
  [IndustryType.ENVIRONMENTAL]: "Natural Resources/ Environmental",
  [IndustryType.OTHER]: "Other",
  [IndustryType.PERSONAL_SERVICES]: "Personal Services",
  [IndustryType.REAL_ESTATE]: "Real Estate/Housing",
  [IndustryType.SAFETY]: "Safety/Security & Legal",
  [IndustryType.TRANSPORTATION]: "Transportation",
}

export const IndustryTypeOptions = Object.keys(IndustryTypeLabels).map(key => ({
  label: IndustryTypeLabels[Number(key) as IndustryType],
  value: Number(key)
}))

/**
 * Phone number related stuff
 */

export enum PhoneNumberType {
  MOBILE = 1,
  HOME,
  WORK,
  MAIN,
  WORK_FAX,
  HOME_FAX,
  OTHER
}

export const PhoneNumberTypeNames:{[key:number]:string} = {
  1: "Mobile",
  2: "Home",
  3: "Work",
  4: "Main",
  5: "Work Fax",
  6: "Home Fax",
  7: "Other"
}

export const PhoneNumberTypes = Object.keys(PhoneNumberTypeNames).map(key => ({
  label: PhoneNumberTypeNames[Number(key)],
  value: key
}))

/**
 * Work history item
 */

export enum CompanyPhoneType{
  DIRECT_LINE = 0,
  COMPANY_PHONE = 1
}

export const CompanyPhoneTypeLabels = {
  [CompanyPhoneType.DIRECT_LINE]:"Direct Line",
  [CompanyPhoneType.COMPANY_PHONE]:"Company Phone"
}

export const CompanyPhoneTypeOptions = Object.keys(CompanyPhoneTypeLabels).map(key => (
    {
      label: CompanyPhoneTypeLabels[Number(key) as CompanyPhoneType],
      value: key
    }
))

/**
 * Work history item
 */

export enum WorkType{
  FULL_TIME = 1,
  PART_TIME = 2,
  SELF_EMPLOYED = 3,
  FREELANCE = 4,
  CONTRACT = 5,
  INTERNSHIP = 6,
  APPRENTICESHIP = 7,
  SEASONAL = 8
}

export const  WorkTypeLabels = {
  [WorkType.FULL_TIME]: "Full-Time",
  [WorkType.PART_TIME]: "Part-Time",
  [WorkType.SELF_EMPLOYED]: "Self-Employed",
  [WorkType.FREELANCE]:  "Freelance",
  [WorkType.CONTRACT]: "Contract",
  [WorkType.INTERNSHIP]: "Internship",
  [WorkType.APPRENTICESHIP]: "Apprenticeship",
  [WorkType.SEASONAL]: "Seasonal"
}

export const WorkTypeOptions = Object.keys(WorkTypeLabels).map((key) => ({
  label: WorkTypeLabels[Number(key) as WorkType],
  value: Number(key)
}))

/**
 * Marriage
 */

export const MaritalStatus = {
  SINGLE: 1,
  MARRIED: 2,
  DIVORCED: 3,
  SEPARATED: 4,
  WIDOWED: 5
}

export const MaritalStatuses = [
  {
    label: "Single",
    value: MaritalStatus.SINGLE
  },
  {
    label: "Married",
    value: MaritalStatus.MARRIED
  },
  {
    label: "Divorced",
    value: MaritalStatus.DIVORCED
  },
  {
    label: "Separated",
    value: MaritalStatus.SEPARATED
  },
  {
    label: "Widowed/Widower",
    value: MaritalStatus.WIDOWED
  }
]

/**
 * Genders
 */

export const Gender = {
  UNKNOWN: 0,
  MALE:1,
  FEMALE: 2,
  OTHER: 3
}

export const Genders = [
  {
    label: "Unknown",
    value: 4
  },
  {
    label: "Male",
    value: 1
  },
  {
    label: "Female",
    value: 2
  },
  {
    label: "Other",
    value: 3
  }
]

/**
 * Person title related data
 */

export const OtherTitle = {
  FREE: 0,
  ENTERPRISE: 1
}

export const OtherTitles = [
  {
    label: "Other",
    value: OtherTitle.FREE
  },
  {
    label: "Enterprise",
    value: OtherTitle.ENTERPRISE
  }
]

export const FamilyTitle = {
  PRIMARY: 1,
  PARENT: 2,
  MOTHER: 10,
  FATHER: 11,
  GRAND_FATHER: 12,
  GRAND_MOTHER: 13,
  HALF_SIBLING: 14,
  STEP_SIBLING: 15,
  WIFE: 16,
  HUSBAND: 17,
  STEP_CHILD: 18,
  ADOPTED_CHILD: 19,
  STEP_GRAND_CHILD: 20,
  ADOPTED_GRAND_CHILD: 21,
  STEP_GREAT_GRAND_CHILD:22,
  ADOPTED_GREAT_GRAND_CHILD:23,
  GRANDPARENT: 3,
  GREAT_GRANDPARENT: 4,
  SIBLING: 5,
  CHILD: 6,
  GRAND_CHILD: 7,
  GREAT_GRANDCHILD: 8,
  SPOUSE: 9,
  FREE: 0
}

export const FamilyTitles = [
  {
    label: "Mother",
    value: FamilyTitle.MOTHER
  },
  {
    label: "Father",
    value: FamilyTitle.FATHER
  },
  {
    label: "Grand Father",
    value: FamilyTitle.GRAND_FATHER
  },
  {
    label: "Grand Mother",
    value: FamilyTitle.GRAND_MOTHER
  },
  {
    label: "Half Sibling",
    value: FamilyTitle.HALF_SIBLING
  },
  {
    label: "Step Sibling",
    value: FamilyTitle.STEP_SIBLING
  },
  {
    label: "Wife",
    value: FamilyTitle.WIFE
  },
  {
    label: "Husband",
    value: FamilyTitle.HUSBAND
  },
  {
    label: "Step Child",
    value: FamilyTitle.STEP_CHILD
  },
  {
    label: "Adopted Child",
    value: FamilyTitle.ADOPTED_CHILD
  },
  {
    label: "Step Grandchild",
    value: FamilyTitle.STEP_GRAND_CHILD
  },
  {
    label: "Adopted Grandchild",
    value: FamilyTitle.ADOPTED_GRAND_CHILD
  },
  {
    label: "Step Great Grandchild",
    value: FamilyTitle.STEP_GREAT_GRAND_CHILD
  },
  {
    label: "Adopted Great Grandchild",
    value: FamilyTitle.ADOPTED_GREAT_GRAND_CHILD
  },
  {
    label: "Primary",
    value: FamilyTitle.PRIMARY
  },
  {
    label: "Parent",
    value: FamilyTitle.PARENT
  },
  {
    label: "Grandparent",
    value: FamilyTitle.GRANDPARENT
  },
  {
    label: "Great Grandparent",
    value: FamilyTitle.GREAT_GRANDPARENT
  },
  {
    label: "Sibling",
    value: FamilyTitle.SIBLING
  },
  {
    label: "Spouse",
    value: FamilyTitle.SPOUSE
  },
  {
    label: "Child",
    value: FamilyTitle.CHILD
  },
  {
    label: "Grand Child",
    value: FamilyTitle.GRAND_CHILD
  },
  {
    label: "Great Grandchild",
    value: FamilyTitle.GREAT_GRANDCHILD
  },
  {
    label: "Other",
    value: FamilyTitle.FREE
  }
]

export const ProfessionalTitle = {
  FREE: 0,
  FINANCIAL_ADVISOR: 1,
  ESTATE_PLANNING_ATTORNEY:2,
  INSURANCE_ADVISOR: 3,
  CPA: 4,
  REAL_ESTATE_AGENT: 5,
  ART_ADVISOR: 6,
  PRIMARY_CONTACT: 7,
  SECONDARY_CONTACT_FOR_PROFESSIONAL: 8,
  ATTORNEY: 9
}

export const ProfessionalTitles = [
  {
    label: "Financial Advisor",
    value: ProfessionalTitle.FINANCIAL_ADVISOR
  },
  {
    label: "Estate Planning Attorney",
    value: ProfessionalTitle.ESTATE_PLANNING_ATTORNEY
  },
  {
    label: "Insurance Advisor",
    value: ProfessionalTitle.INSURANCE_ADVISOR
  },
  {
    label: "CPA",
    value: ProfessionalTitle.CPA
  },
  {
    label: "Real Estate Agent",
    value: ProfessionalTitle.REAL_ESTATE_AGENT
  },
  {
    label: "Art Advisor",
    value: ProfessionalTitle.ART_ADVISOR
  },
  {
    label: "Primary Contact",
    value: ProfessionalTitle.PRIMARY_CONTACT
  },
  {
    label: "Secondary Contact for Professional",
    value: ProfessionalTitle.SECONDARY_CONTACT_FOR_PROFESSIONAL
  },
  {
    label: "Attorney",
    value: ProfessionalTitle.ATTORNEY
  },
  {
    label: "Other",
    value: ProfessionalTitle.FREE
  }
]

export const isFreeTitleType = (person: Person) => {
  return person.PersonTitleID === FamilyTitle.FREE || person.PersonTitleID === ProfessionalTitle.FREE
}

/**
 * Get person title
 * @param person
 */
export const getPersonTitle = (person?: Person) => {
  if(!person)
    return ""

  if(isFreeTitleType(person)){
    return person.PersonTitleFree
  }else if(person.PersonTypeID === PersonType.FAMILY){
    return FamilyTitles.find(t => t.value === person.PersonTitleID)?.label
  }else if(person.PersonTypeID === PersonType.PROFESSIONAL){
    return ProfessionalTitles.find(t => t.value === person.PersonTitleID)?.label
  }else if(person.PersonTypeID === PersonType.PRIMARY){
    return "Primary"
  }
}

/**
 * Used for rendering select input.
 */
export const PersonTypes = [
  {
    label: 'Primary',
    value: PersonType.PRIMARY
  },
  {
    label: 'Family',
    value: PersonType.FAMILY
  },
  {
    label: 'Professional',
    value: PersonType.PROFESSIONAL
  },
  {
    label: 'Other',
    value: PersonType.OTHER
  },
];

export const PersonTypesWithHousehold = [
  {
    label: 'Household',
    value: PersonType.HOUSEHOLD
  },
  ...PersonTypes
];

/**
 * Extended list to include ALL option.
 */
export let PersonTypeFilters = [
  {
    label: 'All',
    value: PersonType.ALL
  },
  ...PersonTypes
]

/**
 * Label object for quick access to labels.
 */
export let PersonTypesLabels = {
  [PersonType.HOUSEHOLD]: { value: PersonType.HOUSEHOLD, label: 'Household', stakeholderLabel: 'External Stakeholder'},
  [PersonType.PRIMARY]: { value: PersonType.PRIMARY, label: 'Primary', stakeholderLabel: 'External Stakeholder'},
  [PersonType.FAMILY]: { value: PersonType.FAMILY, label: 'Family', stakeholderLabel: 'Family Member Stakeholder'},
  [PersonType.PROFESSIONAL]: { value: PersonType.PROFESSIONAL, label: 'Professional', stakeholderLabel: 'External Stakeholder'},
  [PersonType.OTHER]: { value: PersonType.OTHER, label: 'Other', stakeholderLabel: 'External Stakeholder'},
}

/**
 * Build URL for endpoints w/ various types of owners.
 * @param ownerParams
 */
export const buildOwnerUrl = (ownerParams: OwnerParams): string => {
  let url: string = '';
  // Comments are grouped by commentsets
  let additionalPath = '';
  if (ownerParams.modelName === OwnerModelType.COMMENT) {
    additionalPath = `/commentset/${ownerParams?.commentSetId}`;
  }
  // Build base path
  switch(ownerParams.ownerType){
    case OwnerType.HOUSEHOLD:
      if (ownerParams.modelName) {
        url = `household/${ownerParams.householdId}${additionalPath}/${ownerParams.modelName}`;
      } else {
        url = `household/${ownerParams.householdId}${additionalPath}`;
      }
      break;
    case OwnerType.PERSON:
      if (ownerParams.modelName !== OwnerModelType.PERSON) {
        url = `household/${ownerParams.householdId}/person/${ownerParams.personId}${additionalPath}/${ownerParams.modelName}`;
      } else {
        url = `household/${ownerParams.householdId}/person/${ownerParams.personId}${additionalPath}`;
      }
      break;
    case OwnerType.USER:
      if (ownerParams.modelName === OwnerModelType.PHOTO) {
        url = `user/${ownerParams.modelName}/create`;
      } else {
        url = `user/${ownerParams.userId}${additionalPath}/${ownerParams.modelName}`;
      }
      break;
    case OwnerType.OBJECTIVE:
      if (ownerParams.modelName) {
        url = `household/${ownerParams.householdId}/objective/${ownerParams.objectiveId}${additionalPath}/${ownerParams.modelName}`;
      } else {
        url = `household/${ownerParams.householdId}/objective/${ownerParams.objectiveId}${additionalPath}`;
      }
      break;
    case OwnerType.ACTION_ITEM:
      if (ownerParams.modelName) {
        url = `household/${ownerParams.householdId}/objective/${ownerParams.objectiveId}/actionitem/${ownerParams.actionItemId}${additionalPath}/${ownerParams.modelName}`;
      } else {
        url = `household/${ownerParams.householdId}/objective/${ownerParams.objectiveId}/actionitem/${ownerParams.actionItemId}${additionalPath}`;
      }
      break;
  }
  // Append request-specific params
  switch(ownerParams.requestType) {
    case ApiRequestType.CREATE_UPDATE:
      if (Boolean(ownerParams.modelId)){
        url += `/${ownerParams.modelId}`;
      }
      break;
    case ApiRequestType.GET:
      if (Boolean(ownerParams.modelId)){
        url += `/${ownerParams.modelId}`;
      }
      break;
    case ApiRequestType.LIST:
      url += '/list';
      break;
    case ApiRequestType.UPDATE:
      if (Boolean(ownerParams.modelId)){
        url += `/${ownerParams.modelId}`;
      }
      break;
    case ApiRequestType.REMOVE:
      if (Boolean(ownerParams.modelId)){
        url += `/${ownerParams.modelId}`;
      }
      break;
    case ApiRequestType.NONE:
      break;
  }

  return url;
}

/**
 * Get HTTP method for axios.
 * @param ownerParams
 */
export const getHttpMethod = (ownerParams: OwnerParams): string | undefined => {
  switch(ownerParams.requestType) {
    case ApiRequestType.GET:
      return 'get';
    case ApiRequestType.LIST:
      return 'get';
    case ApiRequestType.CREATE_UPDATE:
      return Boolean(ownerParams.modelId) ? 'put' : 'post';
    case ApiRequestType.CREATE:
      return 'post';
    case ApiRequestType.UPDATE:
      return 'put';
    case ApiRequestType.REMOVE:
      return 'delete';
    default:
      return undefined;
  }
}

export const isCreate = (ownerParams: OwnerParams): boolean => {
  const method = getHttpMethod(ownerParams);
  return method === 'post';
}

export const isUpdate = (ownerParams: OwnerParams): boolean => {
  const method = getHttpMethod(ownerParams);
  return method === 'put' || method === 'patch';
}

export const filterByTypes = (persons: [], types: []): Person[] => {
  if (!persons) return persons;
  return persons.filter((person) => types.some((type) => type === get(person, 'PersonTypeID')));
}

export const populatePhotos = async (person: Person) => {
  try {
    const photo: AxiosResponse = await api.photo.list({
      ownerType: OwnerType.PERSON,
      requestType: ApiRequestType.LIST,
      modelName: OwnerModelType.PHOTO,
      householdId: person?.HouseholdID,
      personId: person.PersonID
    });
    person.Photos = photo?.data;
    if (photo?.data && photo?.data?.length > 0) {
      person.Photo = photo?.data[0];
    }
  } catch (e) {
    processServerError(e, 'household.onPopulate.person.photo');
  }

  return person;
}

//// Person title

export const PersonTitle = [
  {
    label: "Grandmother",
    value: 1
  },
  {
    label: "Grandfather",
    value: 2
  }
]

//// Relationship categories and types

export type RelationshipCategoryType = "0"|"1"
export enum PersonRelationshipCategory {
  FAMILY = "0",
  EXTERNAL = "1"
}

export const PersonRelationshipCategoryNames:{[key:number]:string} = {
  0: "Family",
  1: "External"
}

export enum PersonRelationshipTypeEnum {
  SPOUSE = 1,
  CHILD = 2,
  PARENT = 3,
  PROFESSIONAL = 16,
  ASSOCIATE = 17
}

export const PersonRelationshipTypeNames:{[key:number]:string} = {
  1:"Spouse",
  2: "Child",
  3: "Parent",
  16: "Professional",
  17: "Other"
}

export const InverzPersonRelationshipTypes:{[key:number]:number} = {
  1:1,
  2:3,
  3:2,
}

export const PersonRelationshipTypeOptions = [
  {value: PersonRelationshipTypeEnum.SPOUSE,title: PersonRelationshipTypeNames[PersonRelationshipTypeEnum.SPOUSE], category: PersonRelationshipCategory.FAMILY},
  {value: PersonRelationshipTypeEnum.CHILD,title: PersonRelationshipTypeNames[PersonRelationshipTypeEnum.CHILD], category: PersonRelationshipCategory.FAMILY},
  {value: PersonRelationshipTypeEnum.PARENT,title: PersonRelationshipTypeNames[PersonRelationshipTypeEnum.PARENT], category: PersonRelationshipCategory.FAMILY},
  {value: PersonRelationshipTypeEnum.PROFESSIONAL,title: PersonRelationshipTypeNames[PersonRelationshipTypeEnum.PROFESSIONAL], category: PersonRelationshipCategory.EXTERNAL},
  {value: PersonRelationshipTypeEnum.ASSOCIATE,title: PersonRelationshipTypeNames[PersonRelationshipTypeEnum.ASSOCIATE], category: PersonRelationshipCategory.EXTERNAL}
]

export function initCustomDateFields(data: any, fields: string[], item: any){
  fields.forEach(key => {
    // @ts-ignore
    data[key] = convertStringToDateText(item![key], Number(item[`${key}String`]))!
  })
}

export function setCustomDateFields(values: any, fields: string[]){
  fields.forEach(key => {
    // @ts-ignore
    if(values[key]){
      // @ts-ignore
      values[`${key}String`] = String(getDateType(values[key]))
      // @ts-ignore
      values[key] = formatDate(convertStringToDate(values[key], Number(values[`${key}String`])), "yyyy-MM-dd")
    }
  })
}