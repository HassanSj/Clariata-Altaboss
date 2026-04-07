import {AddressItem} from "~/types/api/addressItem";
import {Person} from "~/types/api/person";
import {PhoneNumberItem} from "~/types/api/phoneNumberItem";
import {EducationItem} from "~/types/api/educationItem";
import {PersonalRelationship} from "~/types/api/personalRelationship";
import {WorkHistoryItem} from "~/types/api/workHistoryItem";

export const TestPerson: Person = {
  PersonID: 0,
  PersonTypeID: 0,
  PersonStatusID: 0,
  HouseholdID: 0,
  Prefix: 'TEST',
  FirstName: 'Andrew',
  PreferredName: 'Jordan',
  MiddleName: 'Jordan',
  LastName: 'Allen',
  OriginalSurname: 'TEST',
  Suffix: 'TEST',
  DateOfBirth: "",
  Birthplace: 'Johnson City, TN',
  Deceased: false,
  DateOfDeath: "",
  FamilyTreeOnly: false,
  EducationListID: 0,
  WorkHistoryListID: 0,
  Education: 'Coastal Carolina',
  MaritalStatusID: 0,
  MarriageDate: "",
  Company: 'MAC Interactive',
  ReligiousAffiliation: 'Catholic',
  Location: 'Greenville, SC',
  PhoneHome: '864-555-5555',
  PhoneMobile: '864-555-5555',
  PhoneWork: '864-555-5555',
  EmailAddress: 'jordan@macinteractive.io',
  NumberOfChildren: 0,
  NumberOfOccupants: 0,
  PhoneNumberListID: 0,
  AddressListID: 0,
  CommentSetID: 0,
  PhotoAlbumID: 0,
  FullName: 'Test Test',
}
export const TestAddress: AddressItem = {
  AddressItemID: 0,
  AddressDescription: 'Home Address',
  StreetAddress: '123 Main St.',
  City: 'Greenville',
  StateRegion: 'SC',
  Country: 'US',
  PostalCode: '29607'
}
export const TestPhoneNumber: PhoneNumberItem = {
  PhoneNumberItemID: 0,
  PhoneNumberTypeID: 0,
  PhoneNumber: '123-555-5555',
}

export const TestEducationItem: EducationItem = {
  EducationItemID: 0,
  PersonID: 0,
  InstitutionName: 'Coastal Carolina University',
  EducationDescription: 'Bachelors in Finance',
  CompletionDate: '05/05/2006',
}
export const TestPersonalRelationship: PersonalRelationship = {
  PersonalRelationshipID: 0,
  PersonID: 0,
  PersonalRelationshipTypeID: 0,
  Description: 'Brother',
  StartDate: 'TEST',
  EndDate: 'TEST',
  PastRelationship: false
}
