export interface AddressItem {
  AddressItemID?: number;
  AddressListID?: number;
  ParentID?:number;
  AddressDescription?: string;
  AddressOneLine?: string;
  StreetAddress?: string;
  City?: string;
  StateRegion?: string;
  Country?: string;
  PostalCode?: string;
  CreationDate?: Date;
  CreatedBy?: number;
  LastModifiedDate?: Date;
  LastModifiedBy?: number;
  MainAddress?:boolean;
}
