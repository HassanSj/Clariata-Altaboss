export interface Photo {
  PhotoID?: number;
  PhotoAlbumID?: number;
  StatusID?: number;
  Caption?: string;
  Filename?: string;
  Thumbnail?: string;
  EditedVersion?: string;
  CreationDate?: Date;
  CreatedBy?: number;
  LastModifiedDate?: Date;
  LastModifiedBy?: number;

  URL?: string;
  Base64String?: string;
}
