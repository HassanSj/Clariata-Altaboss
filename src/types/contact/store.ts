import { Action, Thunk } from 'easy-peasy';

export interface IContactStoreModel {
    phoneNumbers: any[];
    addresses: any[];
    unsaved: boolean;
    setAddresses: Action<IContactStoreModel, unknown>;
    setPhoneNumbers: Action<IContactStoreModel, unknown>;
    clearAddresses: Action<IContactStoreModel, unknown>;
    clearPhoneNumbers: Action<IContactStoreModel, unknown>;
    setSaved: Action<IContactStoreModel, unknown>;
    onAddAddress: Thunk<IContactStoreModel, unknown>;
    onAddPhoneNumber: Thunk<IContactStoreModel, unknown>;
    onClearAddresses: Thunk<IContactStoreModel, unknown>;
    onClearPhoneNumbers: Thunk<IContactStoreModel, unknown>;
    onSetSaved: Thunk<IContactStoreModel, unknown>
}