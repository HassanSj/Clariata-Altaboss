export interface checklistItem {
        HouseholdChecklistItemID: number,
        HouseholdChecklistID: number,
        ChecklistItemID: number,
        ChecklistItemTask: string,
        ChecklistItemWho: string,
        ChecklistItemResource: string,
        OrderNumber: number,
        IsComplete: boolean
}


export interface HouseholdChecklist {
    HouseholdChecklistID: number,
    HouseholdID: number,
    ChecklistID: number,
    ChecklistName: string,
    ChecklistType: string,
    householdChecklistItems: Array<checklistItem>
}
