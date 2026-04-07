export interface Task {
    TaskID?: number;
    MilestoneID?: number;
    TaskName?: string;
    Description?: string;
    StartDate?: Date;
    EndDate?: Date;
    Duration?: number;
    Status?: string;
    AssignedTo?: number;
    Completed: boolean;
    CreationDate?: Date;
    CreatedBy?: number;
    LastModifiedDate?: Date;
    LastModifiedBy?: number;
  }