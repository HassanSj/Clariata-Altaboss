import {Person} from "./person";

export interface ActionItemStakeholder {
  ActionItemStakeholderID: number;
  ActionItemID: number;
  PersonID: number;
  InternalNetwork?: string;
  ExternalNetwork?: string;
  CreationDate?: Date;
  CreatedBy?: number;
  LastModifiedDate?: Date;
  LastModifiedBy?: number;

  Person?: Person;
}
