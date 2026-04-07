import { Task } from './task';

export interface Milestone {
  MilestoneID?: number;
  ActionItemID?: number;
  MilestoneName?: string;
  Description?: string;
  StartDate: Date;
  EndDate?: Date;
  Duration?: number;
  Status?: string;
  CreationDate?: Date;
  CreatedBy?: number;
  LastModifiedDate?: Date;
  LastModifiedBy?: number;
  Tasks: Task[];
}