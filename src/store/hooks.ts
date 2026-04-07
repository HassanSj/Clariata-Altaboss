import {createTypedHooks} from 'easy-peasy';
import {StoreInterface} from '~/types/store';

const typedHooks = createTypedHooks<StoreInterface>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;
