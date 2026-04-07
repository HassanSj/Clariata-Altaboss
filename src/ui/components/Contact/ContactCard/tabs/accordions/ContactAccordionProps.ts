import {Person} from "~/types/api/person";

export default interface ContactAccordionProps{
    showFullEditModal?: ()=>unknown,
    person: Person,
    personEntity: Person,
    defaultExpanded?:boolean
}