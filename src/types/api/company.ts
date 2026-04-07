import {IndustryType} from "~/ui/constants/person";

export interface Company{
    CompanyID?: number,
    PersonID:number,
    Name: string,
    Address?: string,
    Phone?:string,
    Email?:string,
    Website?:string,
    IndustryType?: IndustryType,
    EmployeeCount?: number,
    OwnershipPercentage?:number,
    FamilyOwnershipPercentage?:number,
    Generations?:number,
    Revenue?:number,

    FoundedDate?:string,
    FoundedDateString?:string,
    AcquisitionDate?:string,
    AcquisitionDateString?:string,
    SoldDate?:string,
    SoldDateString?:string,
    ProjectedSellDate?:string,
    ProjectedSellDateString?:string,
    PlannedSuccessionDate?:string,
    PlannedSuccessionDateString?:string,

    BoardOfAdvisors?:boolean,
    BoardOfDirections?:boolean,
    FamilyCouncil?:boolean,
    FamilyMissionStatement?:boolean,
    FamilyCharter?:boolean,
    FamilyStrategy?:boolean,
    FamilyMeetings?:boolean,
    FamilyCelebration?:boolean
    FamilyDevelopmentPlan?:boolean,
    SuccessionPlan?:boolean
}