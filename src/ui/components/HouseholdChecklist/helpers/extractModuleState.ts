import {useStoreState} from "~/store/hooks";

export const extractModule = (module:string) => {
    const {
        discoverChecklist,
        dreamChecklist,
        directionChecklist,
        deepenChecklist,
        destinyChecklist } = useStoreState((state) => state.checklist);
    
    switch(module){
        case "Discover":
            return discoverChecklist
        case "Dream":
            return dreamChecklist
        case "Direction":
            return directionChecklist
        case "Deepen":
            return deepenChecklist
        case "Destiny":
            return destinyChecklist
    }
    
}