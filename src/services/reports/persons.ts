import {Person} from "~/types/api/person";
import {Household} from "~/types/api/household";
import api from "~/services/api";
import {ApiRequestType, OwnerModelType, OwnerType, PersonRelationshipType, PersonType} from "~/ui/constants/api";
import {PersonalRelationship} from "~/types/api/personalRelationship";
import {hasItems} from "~/ui/constants/utils";
import {processServerError} from "~/services/api/errors";
import {AxiosResponse} from "axios";
import {populatePhotos} from "~/ui/constants/person";
import {PhoneNumberItem} from "~/types/api/phoneNumberItem";
import {EducationItem} from "~/types/api/educationItem";
import {OwnerParams} from "~/types/relations";
import {WorkHistoryItem} from "~/types/api/workHistoryItem";
import {AddressItem} from "~/types/api/addressItem";
import {parseNumber} from "@telerik/kendo-intl";
import {uniqueFamily} from "~/ui/pages/Profile/components/ProfileFamilyMembers";

export enum RelationshipTreeNodeType {
    INITIAL,
    PERSON,
    COUPLE,
    ADD_CHILD,
    ADD_PARENT
}

export interface Family {
    household?: Household;
    persons: FamilyPerson[]; // Only "Primary" persons
    children?: Person[];
    educationList?: EducationItem[];
    address?: AddressItem;
    phonenumber?: PhoneNumberItem;
}

export interface FamilyPerson {
    name?: string;
    type: RelationshipTreeNodeType | undefined;
    relationshipType?: PersonRelationshipType | undefined;
    person?: Person;
    spouse?: FamilyPerson;
    parents?: FamilyPerson[];
    children?: FamilyPerson[];
    grandchildren?: FamilyPerson[];
    siblings?: FamilyPerson[];
}

export const getFullFamily = async (householdId: number) => {
    const householdResp = await api.household.get(householdId);
    const household: Household = householdResp.data;
    const personsResp: AxiosResponse = await api.person.list(householdId);
    if (personsResp.data) {
        household.Persons = personsResp.data.filter((person: Person) => [PersonType.PRIMARY]
            .some((type) => type === person.PersonTypeID));
        // Populate photos
        try {
            if (household.Persons) {
                const promises: any = [];
                household.Persons.forEach((person: Person) => {
                    promises.push(populatePhotos(person).then((p: Person) => person = p));
                });
                await Promise.all(promises);
            }
        } catch (e) {
            processServerError(e, 'household.onPopulate.person.photo');
        }
    }

    return household;
}

/**
 * Get fully populate family.
 * @param householdId
 * @param extended
 */
export const getHouseholdFamily = async (householdId: number, extended?: boolean): Promise<Family> => {
    const result: Family = {
        persons: []
    };

    const ownerParams: OwnerParams = {
        requestType: ApiRequestType.LIST,
        modelName: OwnerModelType.ADDRESS,
        ownerType: OwnerType.HOUSEHOLD,
        householdId,
    };

    // Fetch household
    try {
        const res = await api.household.get(householdId);
        result.household = res.data as Household;
    } catch (err) {
        processServerError(err, 'persons.getHouseholdFamily');
    }


    // Fetch address and number
    if (result?.household?.AddressListID) {
        const addresses = await api.address.list(ownerParams);
        const addressList = addresses?.data as AddressItem[];
        if (addressList?.length > 0) result.address = addressList[0];
    }

    if (result?.household?.PhoneNumberListID) {
        const numbers = await api.phonenumber.list({...ownerParams, modelName: OwnerModelType.PHONENUMBER});
        const numberlist = numbers?.data as AddressItem[];
        if (numberlist?.length > 0) result.phonenumber = numberlist[0];
    }

    // Fetch household persons
    try {
        // Get relationship types
        await api.personalrelationshiptype.list();
        // Get persons
        const personRes = await api.person.list(householdId);
        if (personRes.data) {
            const persons = (personRes.data.sort(x => x.PersonID) as Person[]);

            await Promise.all(persons.map(async person => {
                let op:OwnerParams = {
                    requestType: ApiRequestType.LIST,
                    modelName: OwnerModelType.ADDRESS,
                    ownerType: OwnerType.PERSON,
                    householdId,
                    personId: person.PersonID
                }

                const addressList = await api.address.list(op)
                // @ts-ignore
                person.AddressList = addressList.data ?? []

                op = {
                    requestType: ApiRequestType.LIST,
                    modelName: OwnerModelType.WORKHISTORY,
                    ownerType: OwnerType.PERSON,
                    householdId,
                    personId: person.PersonID
                }

                const workList = await api.workhistory.list(op)

                // @ts-ignore
                person.WorkList = workList.data ?? []
            }))

            // Find and set primary household persons
            const householdPersons = persons.filter((p: Person) => p.PersonTypeID === PersonType.PRIMARY);
            if (result.household) {
                result.household.Persons = householdPersons;
            }
            result.educationList = [];

            const ownerParams: OwnerParams = {
                requestType: ApiRequestType.LIST,
                modelName: OwnerModelType.EDUCATION,
                ownerType: OwnerType.PERSON,
                householdId,
            };

            // Fetch addresses and numbers
            await Promise.all(householdPersons.sort(x => x.PersonID)?.map(async p => {
                const resPhone = await api.phonenumber.list({
                    ...ownerParams,
                    personId: p?.PersonID,
                    modelName: OwnerModelType.PHONENUMBER
                });

                const numbers = resPhone?.data as PhoneNumberItem[];
                numbers?.forEach(n => {
                    switch (n.PhoneNumberTypeID) {
                        case 1: {
                            p.PhoneMobile = n.PhoneNumber;
                            break;
                        }
                        case 2: {
                            p.PhoneHome = n.PhoneNumber;
                            break;
                        }
                        case 3: {
                            p.PhoneWork = n.PhoneNumber;
                            break;
                        }
                        default:
                            break;
                    }
                })

                const resEd = await api.education.list({...ownerParams, personId: p?.PersonID});
                resEd?.data?.forEach(ed => {
                    ed.PersonID = p.PersonID;
                });
                result.educationList = [...result?.educationList as EducationItem[], ...resEd?.data];
            }));

            if (result?.educationList.length > 1) result?.educationList?.sort((a, b) => {
                const aDate = a.CompletionDate ? new Date(a.CompletionDate) : new Date();
                const bDate = b.CompletionDate ? new Date(b.CompletionDate) : new Date();
                return aDate > bDate ? 1 : -1;
            });

            if (householdPersons) {
                const promises: any = [];
                // Populate each person's relationships
                if (extended) {
                    householdPersons.sort(x => x.PersonID).forEach((p: Person) => {
                        promises.push(getPersonExtendedFamily(p, persons).then((fp: FamilyPerson) => result.persons.push(fp)));
                    });
                } else {
                    householdPersons.sort(x => x.PersonID).forEach((p: Person) => {
                        promises.push(getPersonFamily(p, persons).then((fp: FamilyPerson) => result.persons.push(fp)));
                    });
                }
                await Promise.all(promises);
            }
        }
    } catch (err) {
        processServerError(err, 'persons.getHouseholdFamily');
    }

    return result;
}


/**
 * Get a persons entire family.
 * @param person
 * @param persons
 */
export const getPersonFamily = async (person: Person,
                                      persons: Person[]): Promise<FamilyPerson> => {
    let result: FamilyPerson = {
        type: RelationshipTreeNodeType.PERSON,
        person
    };


    try {
        // Fetch all of a persons relationships
        const res = await api.personalrelationship.list({
            modelName: OwnerModelType.ASSOCIATERELATIONSHIP,
            requestType: ApiRequestType.LIST,
            ownerType: OwnerType.PERSON,
            householdId: person?.HouseholdID,
            personId: person?.PersonID,
        });
        const relationships = res.data as PersonalRelationship[];
        // Populate all of a persons relationships
        result.children = toFamilyPersons(findPersonsByRelationshipType(persons, relationships, PersonRelationshipType.PARENT), PersonRelationshipType.PARENT);
        result.children.forEach(async child => {

            const res = await api.personalrelationship.list({
                modelName: OwnerModelType.ASSOCIATERELATIONSHIP,
                requestType: ApiRequestType.LIST,
                ownerType: OwnerType.PERSON,
                householdId: person?.HouseholdID,
                personId: child?.person?.PersonID,
            });
            const childRelationships = res.data as PersonalRelationship[];
            child.children = toFamilyPersons(findPersonsByRelationshipType(persons, childRelationships, PersonRelationshipType.PARENT), PersonRelationshipType.PARENT);
            child.spouse = toFamilyPersons(findPersonsByRelationshipType(persons, childRelationships, PersonRelationshipType.SPOUSE), PersonRelationshipType.SPOUSE)[0];
        })

    } catch (err) {
        processServerError(err, 'persons.getPersonFamily');
    }

    return result;
}

/**
 * Get a persons extended family.
 * @param person
 * @param persons
 */
export const getPersonExtendedFamily = async (person: Person, persons: Person[]): Promise<FamilyPerson> => {
    const result: FamilyPerson = {
        type: RelationshipTreeNodeType.PERSON,
        person
    };

    try {
        // Fetch all of a persons relationships

        // Parents + grandparents
        const upperRes = await api.personalrelationship.list({
            modelName: OwnerModelType.RELATIONSHIP,
            requestType: ApiRequestType.LIST,
            ownerType: OwnerType.PERSON,
            householdId: person?.HouseholdID,
            personId: person?.PersonID,
        });
        const upperRelationships = upperRes.data as PersonalRelationship[];
        result.parents = toFamilyPersons(findPersonsByRelationshipType(persons, upperRelationships, PersonRelationshipType.PARENT, true), PersonRelationshipType.PARENT);
        console.log("Parents");
        console.log(result.parents);

        for (const parent of result.parents) {
            const res = await api.personalrelationship.list({
                modelName: OwnerModelType.RELATIONSHIP,
                requestType: ApiRequestType.LIST,
                ownerType: OwnerType.PERSON,
                householdId: person?.HouseholdID,
                personId: parent?.person?.PersonID,
            });
            const parentRelationships = res.data as PersonalRelationship[];
            parent.parents = toFamilyPersons(findPersonsByRelationshipType(persons, parentRelationships, PersonRelationshipType.PARENT, true), PersonRelationshipType.PARENT);
            parent.children = toFamilyPersons(findPersonsByRelationshipType(persons, parentRelationships, PersonRelationshipType.CHILD, true), PersonRelationshipType.CHILD);
            if(result.siblings){
                result.siblings.push(...(parent.children ?? []))
            }else{
                result.siblings = parent.children
            }
        }

        result.siblings = result.siblings?.filter(uniqueFamily).filter(p => p?.person?.PersonID !== result.person?.PersonID)

        // Children + grandchildren
        const lowerRes = await api.personalrelationship.list({
            modelName: OwnerModelType.ASSOCIATERELATIONSHIP,
            requestType: ApiRequestType.LIST,
            ownerType: OwnerType.PERSON,
            householdId: person?.HouseholdID,
            personId: person?.PersonID,
        });
        const relationships = lowerRes.data as PersonalRelationship[];

        result.children = toFamilyPersons(findPersonsByRelationshipType(persons, relationships, PersonRelationshipType.PARENT), PersonRelationshipType.PARENT);

        for (const child of result.children) {
            const res = await api.personalrelationship.list({
                modelName: OwnerModelType.ASSOCIATERELATIONSHIP,
                requestType: ApiRequestType.LIST,
                ownerType: OwnerType.PERSON,
                householdId: person?.HouseholdID,
                personId: child?.person?.PersonID,
            });
            const childRelationships = res.data as PersonalRelationship[];
            child.children = toFamilyPersons(findPersonsByRelationshipType(persons, childRelationships, PersonRelationshipType.PARENT), PersonRelationshipType.PARENT);
            child.spouse = toFamilyPersons(findPersonsByRelationshipType(persons, childRelationships, PersonRelationshipType.SPOUSE), PersonRelationshipType.SPOUSE)[0];
        }

        console.log(result);

    } catch (err) {
        processServerError(err, 'persons.getPersonFamily');
    }

    return result;
}

/**
 * Find persons by a specific relationship type.
 * @param persons
 * @param relationships
 * @param type
 * @param associatePerson
 */
export const findPersonsByRelationshipType = (persons: Person[],
                                              relationships: PersonalRelationship[],
                                              type: PersonRelationshipType,
                                              associatePerson?: boolean) => {
    const result: Person[] = [];
    // Find all relationships of the specified type
    const relations = relationships?.filter((r: PersonalRelationship) => Number(r.PersonalRelationshipTypeID) === Number(type));


    // For each relationship, find the person and add to result
    if (relations) {
        relations.forEach((r: PersonalRelationship) => {
            const person = persons?.find((p: Person) => p.PersonID === (associatePerson ? r.AssociatePersonID : r.PersonID));
            if (person) {
                result.push(person);
            }
        })
    }

    return result;
}

/**
 * Find persons of a certain type.
 * @param persons
 * @param type
 */
export const findPersonsByType = (persons: Person[], type: PersonType) => {
    return persons.filter((p: Person) => p.PersonTypeID === type);
}

/**
 * Convert list of persons to a list of FamilyPersons (for family tree).
 * @param persons
 * @param type
 */
export const toFamilyPersons = (persons: Person[], relationshipType: PersonRelationshipType) => {
    return persons?.map((p) => {
        return {
            type: RelationshipTreeNodeType.PERSON,
            relationshipType,
            person: p
        }
    });
}

/**
 * Populate empty nodes (i.e. empty relationships)
 * @param person
 */
export const populateEmptyNodes = (person: FamilyPerson) => {
    if (!person?.parents || !hasItems(person?.parents)) person.parents = [];
    if (!person?.children || !hasItems(person?.children)) person.children = [];

    // Parents
    while (person?.parents?.length < 2) {
        person?.parents.push({
            type: RelationshipTreeNodeType.ADD_PARENT,
            relationshipType: PersonRelationshipType.PARENT
        });
    }

    // Children
    while (person?.children?.length < 2) {
        person?.children.push({
            type: RelationshipTreeNodeType.ADD_CHILD,
            relationshipType: PersonRelationshipType.CHILD
        });
    }

    return person;
}



