import { Action, Thunk } from 'easy-peasy';

export interface ISelectedStoreModel {
    householdId: number;
    contactId: number;
    discoverInterviewId: number;
    dreamInterviewId: number;
    deepenPriorityId: number;
    deepenActionItemId: number;
    primary1Id: number;
    primary2Id: number;
    selectHousehold: Action<ISelectedStoreModel, unknown>;
    selectContact: Action<ISelectedStoreModel, unknown>;
    selectDiscoverInterview: Action<ISelectedStoreModel, unknown>;
    selectDreamInterview: Action<ISelectedStoreModel, unknown>;
    selectDeepenActionItem: Action<ISelectedStoreModel, unknown>;
    selectDeepenPriority: Action<ISelectedStoreModel, unknown>;
    selectPrimary: Action<ISelectedStoreModel, unknown>
    onSelectHousehold: Thunk<ISelectedStoreModel, unknown>;
    onSelectContact: Thunk<ISelectedStoreModel, unknown>;
    onSelectDiscoverInterview: Thunk<ISelectedStoreModel, unknown>;
    onSelectDreamInterview: Thunk<ISelectedStoreModel, unknown>;
    onSelectDeepenActionItem: Thunk<ISelectedStoreModel, unknown>;
    onSelectDeepenPriority: Thunk<ISelectedStoreModel, unknown>;
    onSelectPrimary: Thunk<ISelectedStoreModel, unknown>;
}