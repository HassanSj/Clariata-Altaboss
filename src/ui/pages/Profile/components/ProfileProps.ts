import {Household} from "~/types/api/household";
import {Person} from "~/types/api/person";

export default interface ProfileProps{
    household: Household,
    primaryContacts?: Person[],
    contacts?: Person[]
}