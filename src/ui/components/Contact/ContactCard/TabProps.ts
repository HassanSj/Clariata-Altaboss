import {ContactDataType} from "~/ui/constants/contact";
import {Person} from "~/types/api/person";
import {PersonType} from "~/ui/constants/api";

export interface TabProps {
    toggleEditModal: (type: ContactDataType, item: any | undefined) => void,
    person: Person,
    personEntity?: Person,
    isEdit?:boolean
}

export interface TabData{
    label:string,
    key:string,
    component?: any,
    props?: any,
    forType?:PersonType[],
    customCondition?: (person: Person) => boolean
}
