export interface Notification {
  NotificationID: number;
  NotificationStatusID: number;
  UserID: number;
  Message?: string;
  SeenInApp?: boolean;
  SeenDate?: Date;
  SentAsEmail?: boolean;
  SentAsEmailDate?: Date;
  CreationDate?: Date;
  CreatedBy?: number;
  LastModifiedDate?: Date;
  LastModifiedBy?: number;
}
