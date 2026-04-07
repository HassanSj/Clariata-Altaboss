export interface TimelineItem {
  TimelineItemID?: number;
  HouseholdID?: number;
  Description: string;
  Image?: string;
  EventDate?: Date;
  EventName?: string;
  EventTypeId?: number;
  PersonId?: number | string
}
