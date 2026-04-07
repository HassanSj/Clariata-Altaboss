import {action, createStore, persist} from 'easy-peasy';
import user from './user';
import layout from './layout';
import household from './household';
import evaluation from './evaluation';
import constants from './constants';
import person from './person';
import wizard from './wizard';
import interview from './interview';
import objective from './objective';
import destiny from './destiny';
import checklist from './checklist';
import selected from './selected';
import contact from './contact';

const storeModel = {
  user,
  layout,
  household,
  destiny,
  evaluation,
  constants,
  person,
  wizard,
  interview,
  objective,
  checklist,
  selected,
  contact
};

const initialState = Object.assign({}, storeModel);

// Create store w/ persistence
const store = createStore(persist(
  {
    ...storeModel,
    reset: action((state) => ({
      ...initialState,
    }))
  },
  {
    storage: "localStorage",
  }
));

// initialState = store.getState();

export default store;