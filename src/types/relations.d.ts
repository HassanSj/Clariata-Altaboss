import {ApiRequestType, OwnerType} from "~/ui/constants/api";

declare interface OwnerParams {
  requestType: ApiRequestType;
  modelName: string;
  modelId?: number;
  ownerType: OwnerType;
  ownerId?: number;
  userId?: number;
  householdId?: number;
  personId?: number;
  commentSetId?: number;
  objectiveId?: number;
  actionItemId?:number;
}
