declare interface ILoginRequest {
  Username: string;
  Password: string;
}

declare interface IRegisterRequest {
  FirstName: string;
  LastName: string;
  Username: string;
  Password: string;
  RegistrationCode: string;
}

declare interface ISessionResponse {
  SessionID: string;
}

