import userPlaceholder from '../../../public/images/placeholders/person_default.png';
import familyPlaceholder from '../../../public/images/placeholders/family_default.png';
import {PersonalRelationshipType} from "~/types/api/personalRelationshipType";
import {Person} from "~/types/api/person";
import {Photo} from "~/types/api/photo";
import {MaritalStatus} from "~/types/api/maritalStatus";
import {PhoneNumberType} from "~/types/api/phoneNumberType";
import {isNullOrUndefined} from "~/ui/constants/utils";
import {User} from "~/types/api/user";
import {PersonRelationshipTypeNames, PersonTypesLabels} from "~/ui/constants/person";
import {get} from 'lodash';
import {useStoreState} from "~/store/hooks";
import {onlyNonUndefined} from "../../../utils/filter";

export const getDefaultPhotoSrc = () => {
  return userPlaceholder;
}

export const getBothPhotoSrc = () => {
  return 'https://clariata-upload.s3.us-east-2.amazonaws.com/couplePlaceholder.png';
}

export const getDefaultFamilyPhotoSrc = () => {
  return familyPlaceholder;
}

export const getPhotoUrlOrDefault = (person: Person | undefined): string => {
  return (!isNullOrUndefined(person) && !isNullOrUndefined(person?.PhotoURL) && person?.PhotoURL!==undefined)
    ? person?.PhotoURL
    : userPlaceholder;
}

export const getPhotoSrc = (photo: Photo | undefined): string => {
  return (!isNullOrUndefined(photo) && !isNullOrUndefined(photo?.URL) && photo?.URL) ? photo.URL : userPlaceholder;
}

export const getPhotoSrcByUrl = (url: string | undefined): string => {
  return (!isNullOrUndefined(url)) ? url as string : userPlaceholder;
}

export const getPhotoSrcFamily = (photo: Photo | undefined): string => {
  return (!isNullOrUndefined(photo) && !isNullOrUndefined(photo?.URL) && photo?.URL) ? photo.URL : familyPlaceholder;
}

export const getPhotoSrcNoPlaceholder = (photo: Photo | undefined): string | undefined => {
  return (!isNullOrUndefined(photo) && !isNullOrUndefined(photo?.URL) && photo?.URL) ? photo.URL : undefined;
}

export const getInitials = (person: Person | undefined): string => {

  if(!person) return 'N/A';
  let result = '';
  if (person?.FirstName){
    result += person.FirstName?.charAt(0)
  }
  if (person?.LastName){
    result += person.LastName?.charAt(0)
  }
  return result;
}

export const getFirstName = (person: Person | undefined | null): string => {
  if(!person) return 'N/A';
  let result = '';
  if (!isNullOrUndefined(person?.PreferredName) && person?.PreferredName) {
    result = person?.PreferredName;
  }
  else if (!isNullOrUndefined(person?.FirstName) && person?.FirstName) {
    result = person?.FirstName;
  }
  else {
    result = `No name`;
  }

  return result;
}

// export const getFullNameFromID = (personID?: number): string => {
//   const person = persons?.find((p: Person) => p.PersonID === personID);
//   return getFullName(person);
// }

export const getFullName = (person: Person | undefined | null): string => {
  if(!person) return 'N/A';

  const name = [
      person.PreferredName ? person?.PreferredName : person.FirstName,
      person.OriginalSurname ? `(${person.OriginalSurname})` : undefined,
      person.LastName
  ].filter(onlyNonUndefined).join(" ")

  return name === " " || name === "" ? "No name" : name
}

export const getUserFullName = (user: User | undefined): string => {
  if(!user) return 'N/A';
  return `${user?.FirstName} ${user?.LastName}`;
}

export const getPersonTypeEnum = (id:number | undefined): string => {
  if (!id){
    return 'N/A';
  }
  return get(PersonTypesLabels, id)?.label;
}

/**
 * Get human readable name for personal relationship type
 * @param id
 */
export const getPersonType = (id:number | undefined): string => {
  if (!id){
    return 'N/A';
  }
  const type = PersonRelationshipTypeNames[id]
  return type ? type : 'N/A';
}

// TODO: Instead of loading from the db, use hardcoded array
export const getMaritalStatus = (id:number | undefined, statuses: MaritalStatus[]): string => {
  if (!id || !statuses){
    return 'N/A';
  }
  const type = statuses.find((item: MaritalStatus) => item.MaritalStatusID === id);
  return type?.MaritalStatus ? type?.MaritalStatus : 'N/A';
}

// TODO: Instead of loading from the db, use hardcoded array
export const getPhoneNumberType = (id: number, phoneNumberTypes: any[]): string => {
  if (!id || !phoneNumberTypes){
    return 'N/A';
  }
  const type = phoneNumberTypes.find((item: any) => Number(item?.value) === id);
  return type?.label ? type?.label : 'N/A';
}
