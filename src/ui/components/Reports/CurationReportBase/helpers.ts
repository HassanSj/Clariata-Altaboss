import {Household} from "~/types/api/household";

export const image = (name: string) => `/images/reports/summary/${name}`
export const spouses = (household?: Household) => household && household.Persons ? `${household.Persons[0].FirstName} and ${household.Persons[1].FullName}` : ""