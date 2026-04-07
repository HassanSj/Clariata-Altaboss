export interface DestinyGlobalItem {
    Author: string;
    Category: string;
    Subcategory: string;
    Description: string;
    Content: string;
    Duration: string;
    ImageUrl: string;
    PurchaseUrl: string;
    ItemId: number;
    ItemType: string;
    Location: string;
    StartDate: string;
    Title: string;
    Subtitle: string;
    Url: string;
}

export interface PlanMember {
    // CompletedDate: string | number | Date;
    // DestinyItemID: number;
    // IsAdvisorItem: number;
    // IsComplete: number;
    // PlanMemberID: number;
    DevelopmentPlanID: number
    FirstName: string
    HouseholdID: number
    LastName: string
    PersonID: number
    PlanMemberID: number
    PreferredName: string
    Relationship: string
}
