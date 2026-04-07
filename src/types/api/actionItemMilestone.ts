export interface ActionItemMilestone {
  ActionItemMilestoneID: number;
  ActionItemID?: number;
  OverallStatusID?: number;
  Description?: string;
  StartDate?: string;
  DueDate?: string;
  UpdateInterval?: number;
  UpdateIntervalDescription?: string;
  PersonResponsible?: number;
  CreationDate?: Date;
  CreatedBy?: number;
  LastModifiedDate?: Date;
  LastModifiedBy?: number;
}
