import {Person} from "./person";
import {PersonRelationshipCategory, RelationshipCategoryType} from "~/ui/constants/person";

export interface PersonalRelationship {
  /**
   * ID of the relationship
   */
  PersonalRelationshipID?: number;
  /**
   * Person related. This is the person that will show this relationship on it's page
   */
  PersonID?: number;
  /**
   * ID of the person we relate to
   */
  AssociatePersonID?: number;
  /**
   * Type of the relationship. Can be parent, child spouse etc
   */
  PersonalRelationshipTypeID?: number;
  /**
   * Category can be 0- family or 1 - external
   */
  Category?:RelationshipCategoryType;

  Description?: string;
  StartDate?: string;
  EndDate?: string;
  PastRelationship?: boolean;
  CreationDate?: Date;
  CreatedBy?: number;
  LastModifiedDate?: Date;
  LastModifiedBy?: number;
  AssociatePerson?: Person;
}
