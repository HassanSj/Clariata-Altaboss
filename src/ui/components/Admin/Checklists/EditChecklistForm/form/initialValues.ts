interface IInitialValuesChecklist {
    ChecklistName: string;
    ChecklistType: string;
}

const initialValuesChecklist: IInitialValuesChecklist = {
    ChecklistName: "",
    ChecklistType: ""
};

interface IInitialValuesChecklistItem {
    ChecklistItemTask: string,
    ChecklistItemWho: string,
    ChecklistItemResource: string,
    OrderNumber: number | null
}

const initialValuesChecklistItem: IInitialValuesChecklistItem = {
    ChecklistItemTask: "",
    ChecklistItemWho: "",
    ChecklistItemResource: "",
    OrderNumber: null
}

export {initialValuesChecklist, initialValuesChecklistItem};