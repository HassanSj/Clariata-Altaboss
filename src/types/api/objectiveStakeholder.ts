import {Person} from "./person";

export interface ObjectiveStakeholder {
  ObjectiveStakeholderID: number;
  ObjectiveID: number;
  PersonID?: number;
  Role?: string;
  CreationDate?: Date;
  CreatedBy?: number;
  LastModifiedDate?: Date;
  LastModifiedBy?: number;

  Person?: Person;
}
