interface IInitialValues {
    Company: string;
    Title: string;
    Description: string;
    FamilyOwned: boolean;
    CurrentlyWorking: boolean;
}

const initialValues: IInitialValues = {
    Company: '',
    Title: '',
    Description: '',
    FamilyOwned: false,
    CurrentlyWorking: false
};

export default initialValues;
