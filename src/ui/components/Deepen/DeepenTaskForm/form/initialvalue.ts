interface IInitialValues {
    MilestoneID: number;
    TaskName: string;
    Description: string;
    StartDate?: Date;
    EndDate?: Date,
    AssignedTo: number
}

export const initialValues: IInitialValues = {
    MilestoneID: 0,
    TaskName: "",
    Description: "",
    AssignedTo: 0

};