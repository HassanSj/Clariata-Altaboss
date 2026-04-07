interface IInitialValues {
    FirstName: string;
    LastName: string;
    EmailAddress: string;
    FirmId: number;
    
}

const initialValues: IInitialValues = {
    FirstName: '',
    LastName: '',
    EmailAddress: '',
    FirmId: 0,
};

export default initialValues;