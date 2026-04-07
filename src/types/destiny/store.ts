import { Action, Thunk } from 'easy-peasy';
import { DestinyGlobalItem, PlanMember } from '../api/destinyGlobalItem';

export interface IDestinyStoreModel {
    destinyGlobalItems?: DestinyGlobalItem[];
    DevelopmentPlans?: any[];
    selectedFamilyPerson: any;
    SelectedPersonItemsAdded: any[];
    planMemberItems: any[];
    populate: Action<IDestinyStoreModel, unknown>;
    clear: Action<IDestinyStoreModel, unknown>;
    onPopulate: Thunk<IDestinyStoreModel, unknown>;
    addPlanMemberItem: Action<IDestinyStoreModel, unknown>;
    onAddPlanMemberItem: Thunk<IDestinyStoreModel, unknown>;
    selectPerson: Action<IDestinyStoreModel, unknown>;
    onSelectPerson: Thunk<IDestinyStoreModel, unknown>;
    setAddedItems: Action<IDestinyStoreModel, unknown>;
    onSetAddedItems: Thunk<IDestinyStoreModel, unknown>;
}