export enum ApiRequestType {
  GET = 1,
  LIST = 2,
  CREATE_UPDATE = 3,
  CREATE = 4,
  UPDATE = 5,
  REMOVE = 6,
  NONE = 7
}

export enum ApiPatchType {
  REPLACE = 'replace',
  ADD = 'add',
  REMOVE = 'remove',
  COPY = 'copy',
  MOVE = 'move',
  TEST = 'test',
}

export enum OwnerType {
  HOUSEHOLD = 1,
  USER = 2,
  PERSON = 3,
  OBJECTIVE = 4,
  ACTION_ITEM = 5,
  TIMELINE = 6,
}

export enum OwnerModelType {
  PERSON = 'person',
  PHONENUMBER = 'phoneNumber',
  ADDRESS = 'address',
  WORKHISTORY = 'workhistory',
  EDUCATION = 'education',
  COMMENT = 'comment',
  PHOTO = 'photo',
  FAMILY_PHOTO = "family_photo",
  COUPLE_PHOTO = "couple_photo",
  RELATIONSHIP = 'personalrelationship',
  SHAREDITEM = 'shareditem',
  ASSOCIATERELATIONSHIP = 'personalassociaterelationship'
}

export enum PersonType {
  ALL = -1,
  HOUSEHOLD = 1,
  PRIMARY = 2,
  FAMILY = 3,
  PROFESSIONAL = 4,
  OTHER = 5
}

export enum PersonRelationshipType {
  SPOUSE = 1,
  CHILD = 2,
  PARENT = 3,
  GRANDCHILD = 4,
  GREATE_GRANDCHILD = 6,
  GREAT_GRANDPARENT = 7,
  GREAT_GREAT_GRANDCHILD = 8,
  SIBLING = 9,
  AUNT_UNCLE = 10,
  NIECE_NEPHEW = 11,
  COUSIN = 12,
  FRIEND = 13,
  EMPLOYEE = 14,
  COWORKER = 15,
  PROFESSIONAL = 16,
  ASSOCIATE_OTHER = 17,
  OTHER_FAMILY_MEMBER = 18,
  CAREGIVER = 19,
  STEP_CHILD = 20,
  ADOPTED_CHILD = 21,
  SON_IN_LAW = 22,
  DAUGHTER_IN_LAW = 23,
  PATERNAL_GRANDMOTHER = 24,
  FATHER = 26,
  MATERIAL_GRANDFATHER = 27,
  PATERIAL_GRANDFATHER = 28,
  PREVIOUS_SPOUSE = 29
}

/**
 * Returns the corresponding PersonType of a PersonalRelationshipType.
 * @param type
 */
export const getPersonTypeFromPersonalRelationshipType = (type: number | undefined) => {
  if (!type) return undefined;
  let personTypeId = PersonType.OTHER;
  if (type === PersonRelationshipType.SPOUSE) {
    personTypeId = PersonType.PRIMARY;
  }
  else if (type === PersonRelationshipType.PARENT || type === PersonRelationshipType.CHILD) {
    personTypeId = PersonType.FAMILY;
  }
  else if (type === PersonRelationshipType.PROFESSIONAL) {
    personTypeId = PersonType.PROFESSIONAL;
  }
  return personTypeId;
}