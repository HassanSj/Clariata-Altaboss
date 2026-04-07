export interface SharedItem {
  SharedItemID?: number;
  ItemTypeID?: number;
  ShareTypeID?: number;
  SharedItemObjectID?: number;
  FieldName?: string;
  SharedBy?: number;
  SharedWith?: number;
  Description?: string;
  EmailAddress?: string;
  CreationDate?: Date;
  CreatedBy?: number;
  LastModifiedDate?: Date;
  LastModifiedBy?: number;
}
