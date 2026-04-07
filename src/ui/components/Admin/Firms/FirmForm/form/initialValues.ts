interface IInitialValues {
    FirmName: string;
    Address: string;
    Address2: string;
    City: string;
    State: string;
    PostalCode: string;
    Domain: string;
    PrimaryContact: string;
    PrimaryEmail: string;
}

const initialValues: IInitialValues = {
    FirmName: '',
    Address: '',
    Address2: '',
    City: '',
    State: '',
    PostalCode: '',
    Domain: '',
    PrimaryContact: '',
    PrimaryEmail: ''
};

export default initialValues;