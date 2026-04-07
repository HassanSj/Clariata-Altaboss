import {AxiosPromise} from "axios";
import request from "~/services/api/request";
import { Household } from "~/types/api/household";
import { PersonType } from "~/ui/constants/api";

interface TimeLineItem {
  Description?: string,
  ImageUrl?: string,
  EventDate?: string,
  EventType?: string,
  PersonType?: string,
  AssociationId?: number,
  icon?: string,
  picture?: string,
  edit?: boolean
}
interface Timeline {
  Household?: Household;
  Primary1?: any,
  Primary2?: any,
  TimelineItems?:TimeLineItem[]
}
/**
 * List all.
 * @param householdId
 */
export const list = (householdId: string | number): AxiosPromise<Timeline> =>
  request.private({
    method: 'get',
    url: `/household/${householdId}/timeline/list`,
  });