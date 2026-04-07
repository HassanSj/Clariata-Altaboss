interface IInitialValues {
    ResourceTitle: string;
    Description: string;
    ResourceUrl: string;
    ResourceModule: string;
    ResourceCategory: string;
    ResourceType: string
}

const initialValues: IInitialValues = {
    ResourceTitle: '',
    Description: '',
    ResourceUrl: '',
    ResourceModule: '',
    ResourceCategory: '',
    ResourceType: '',
};

export default initialValues;