
export interface GanttItem {
  ID: number,
  Title: string,
  Description: string,
  StartDate: Date,
  EndDate: Date,
  Duration: number
  IsExpanded: boolean,
  AssignedTo: string
  GanttItems: GanttItem[]
}