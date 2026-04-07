export interface Comment {
  CommentID?: number;
  UserID?: number;
  ChildCommentSetID?: number;
  ParentCommentSetID?: number;
  Comment?: string;
  FlaggedForReview?: number;
  Upvotes?: number;
  Downvotes?: number;
  CreationDate?: string;
  CreatedBy?: number;
  LastModifiedDate?: string;
  LastModifiedBy?: number;

  Children?: Comment[]
}
