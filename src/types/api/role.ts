import {RoleType} from "~/ui/constants/person";

export interface Role{
    RoleID?: number,
    Role: RoleType,
    PersonID: number,
    ForPerson: string,
    AdditionalInformation: string
}