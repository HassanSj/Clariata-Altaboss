import { Action, Thunk } from 'easy-peasy';
import {Checklist} from "~/types/api/checklist";

export interface IChecklistStoreModel {
    discoverChecklist: Checklist;
    dreamChecklist: Checklist;
    directionChecklist: Checklist;
    deepenChecklist: Checklist;
    destinyChecklist: Checklist;
    clearChecklist: Action<IChecklistStoreModel, unknown>;
    selectChecklist: Action<IChecklistStoreModel, unknown>;
    onSelectChecklist: Thunk<IChecklistStoreModel, unknown>;
}