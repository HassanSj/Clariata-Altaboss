import {CompanyPhoneType} from "~/ui/constants/person";

export interface WorkHistoryItem {
  PostalCode?:string,
  WorkHistoryItemID?: number;
  WorkHistoryListID?: number;
  PersonID?: number;
  Company?: string;
  Title?: string;
  Description?: string;
  StartDate?: string;
  StartDateString?: string;
  EndDate?: string;
  EndDateString?: string;
  CreationDate?: Date;
  CreatedBy?: number;
  LastModifiedDate?: Date;
  LastModifiedBy?: number;
  FamilyOwned:boolean;
  Address?:string;
  State?:string;
  City?:string;
  ZIP?: string;
  CurrentlyWorking?:boolean;
  PhoneNumber?:string;
  PhoneNumberType?: CompanyPhoneType;
  WebSite?: string;
  SuccessionDate?: string;
  SuccessionDateString?: string;
  RetirementDate?: string;
  RetirementDateString?: string;
  PlannedSuccessionDate?: string;
  PlannedSuccessionDateString?: string;
  PlannedRetirementDate?: string;
  PlannedRetirementDateString?: string;
}
