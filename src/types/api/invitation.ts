export interface Invitation {
    InvitationID: number;
    FirstName?: string;
    LastName?: string;
    EmailAddress?: string;
    InvitationCode: string;
    ExpirationDate: Date;
    AcceptedDate?: Date;
    FirmId: number;
    InvitedBy: number;
    InvitationTypeID: number;
    CreationDate?: Date;
    CreatedBy?: number;
  }
  