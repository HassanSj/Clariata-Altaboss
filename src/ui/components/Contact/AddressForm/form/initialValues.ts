interface IInitialValues {
    AddressDescription: string;
    StreetAddress: string;
    City: string;
    StateRegion: string;
    PostalCode: string;
    Country: string;
}

const initialValues: IInitialValues = {
    AddressDescription: '',
    StreetAddress: '',
    City: '',
    StateRegion: '',
    PostalCode: '',
    Country: ''
};

export default initialValues;
