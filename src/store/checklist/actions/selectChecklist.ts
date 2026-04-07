import {action, Action} from 'easy-peasy';
import { ModuleTypes } from '~/ui/constants/modules';

const selectChecklist: Action<any> = action((state: any, payload: any) => {
  switch(payload.type){
    case ModuleTypes.DISCOVER:
      state.discoverChecklist = payload?.data;
      break;
    case ModuleTypes.DREAM:
      state.dreamChecklist = payload?.data;
      break;
    case ModuleTypes.DIRECTION:
      state.directionChecklist = payload?.data;
      break;
    case ModuleTypes.DEEPEN:
      state.deepenChecklist = payload?.data;
      break;
    case ModuleTypes.DESTINY:
      state.destinyChecklist = payload?.data;
      break;
  }
});

export default selectChecklist;
