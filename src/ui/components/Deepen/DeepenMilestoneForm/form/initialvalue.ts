interface IInitialValues {
    ActionID: number;
    MilestoneName: string;
    Description: string;
    StartDate?: Date;
    EndDate?: Date
}

export const initialValues: IInitialValues = {
    ActionID: 0,
    MilestoneName: "",
    Description: "",

};

interface IInitialTaskValues {
    MilestoneID: number;
    TaskName: string;
    Description: string;
    StartDate?: Date;
    EndDate?: Date,
    AssignedTo: string
}

export const initialTaskValues: IInitialTaskValues = {
    MilestoneID: 0,
    TaskName: "",
    Description: "",
    AssignedTo: ""

};