import {action, Action} from 'easy-peasy';
import { ModuleTypes } from '~/ui/constants/modules';

const clearChecklist: Action<any> = action((state: any, payload: any) => {
    switch(payload.type){
        case ModuleTypes.DISCOVER:
          state.discoverChecklist = null;
          break;
        case ModuleTypes.DREAM:
          state.dreamChecklist = null;
          break;
        case ModuleTypes.DIRECTION:
          state.directionChecklist = null;
          break;
        case ModuleTypes.DEEPEN:
          state.deepenChecklist = null;
          break;
        case ModuleTypes.DESTINY:
          state.destinyChecklist = null;
          break;
      }
});

export default clearChecklist;
