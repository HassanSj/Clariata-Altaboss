interface IInitialValues {
    IssuedTo: string;
    EmailAddress: string;
    RegistrationCode: string;
}

const initialValues: IInitialValues = {
    IssuedTo: '',
    EmailAddress: '',
    RegistrationCode: '',
};

export default initialValues;