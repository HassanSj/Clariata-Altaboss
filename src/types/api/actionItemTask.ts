export interface ActionItemTask {
  ActionItemTaskID?: number;
  ActionItemID?: number;
  StatusID?: number;
  Description?: string;
  PersonResponsible?: number;
  StartDate?: Date;
  StartDateComment?: string;
  EndDate?: Date;
  EndDateComment?: string;
  UpdateInterval?: number;
  UpdateIntervalDescription?: string;
  CreationDate?: Date;
  CreatedBy?: number;
  LastModifiedDate?: Date;
  LastModifiedBy?: number;
}
