interface IInitialValues {
    Category: string;
    Subcategory: string;
    Title: string;
    Description: string;    
    Author?: string;
    ImageURL?: string;
    StartDate?: Date;
    Location?: string;
    URL?: string;
    Duration?: string;
    DurationType?: string 
}

const initialValues: IInitialValues = {
    Category: "",
    Subcategory: "",
    Title: "",
    Description: "",
    Author: "",
    ImageURL: "",
    StartDate: undefined,
    Location: "",
    URL: "",
    Duration: ""
};

export default initialValues;