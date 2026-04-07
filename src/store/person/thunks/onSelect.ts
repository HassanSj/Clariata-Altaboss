import {thunk, Thunk} from 'easy-peasy';
import {AxiosResponse} from 'axios';
import api from 'services/api';

import {processServerError} from 'services/api/errors';
import {IPersonStoreModel} from "~/types/person/store";
import {Person} from "~/types/api/person";
import {IPersonPayload} from "~/store/person/actions/select";
import {OwnerParams} from "~/types/relations";
import {ApiRequestType, OwnerModelType, OwnerType} from "~/ui/constants/api";
import {PersonalRelationship} from "~/types/api/personalRelationship";

interface IPayload {
  person: Person;
}

const onSelect: Thunk<IPersonStoreModel, IPayload> = thunk(async ({ select }, { person }: IPayload, helpers) => {
  const store: any = helpers.getStoreState();
  const householdId = store?.household?.selectedHousehold?.HouseholdID;
  const ownerParams: OwnerParams = {
    requestType: ApiRequestType.LIST,
    modelName: 'phoneNumber',
    ownerType: OwnerType.PERSON,
    personId: person?.PersonID,
    householdId,
    commentSetId: person?.CommentSetID
  };
  const data: IPersonPayload = {
    person,
    household: undefined,
    photoAlbum: undefined,
    photo: undefined,
    photos: undefined,
    addresses: undefined,
    workHistory: undefined,
    education: undefined,
    relationships: undefined,
    comments: undefined,
  }
  // Load all relative data
  if (person?.PersonID) {
    try {
      const res: AxiosResponse = await api.phonenumber.list({ ...ownerParams, modelName: OwnerModelType.PHONENUMBER });
      data.phoneNumbers = res?.data;
    } catch (err) {
      processServerError(err, 'person.onSelect.phonenumber');
    }
    try {
      const res: AxiosResponse = await api.address.list({ ...ownerParams, modelName: OwnerModelType.ADDRESS});
      data.addresses = res?.data;
    } catch (err) {
      processServerError(err, 'person.onSelect');
    }
    try {
      const res: AxiosResponse = await api.education.list({ ...ownerParams, modelName: OwnerModelType.WORKHISTORY});
      data.workHistory = res?.data;
    } catch (err) {
      processServerError(err, 'person.onSelect.workHistory');
    }
    try {
      const res: AxiosResponse = await api.education.list({ ...ownerParams, modelName: OwnerModelType.EDUCATION});
      data.education = res?.data;
    } catch (err) {
      processServerError(err, 'person.onSelect.education');
    }
    try {
      const res: AxiosResponse = await api.personalrelationship.list({ ...ownerParams, modelName: OwnerModelType.RELATIONSHIP});
      data.relationships = res?.data;

      // Set person
      if (data.relationships && store?.person?.persons){
        data.relationships.forEach((rel: PersonalRelationship) => {
          rel.AssociatePerson = store?.person?.persons?.find((item: Person) => item.PersonID === rel.AssociatePersonID);
        })
      }
    } catch (err) {
      processServerError(err, 'person.onSelect.relationships');
    }
    try {
      ownerParams.modelName = OwnerModelType.PHOTO;
      const res: AxiosResponse = await api.photo.list({...ownerParams, modelName: OwnerModelType.PHOTO});
      data.photos = res?.data;
      if (data.person) {
        data.person.Photos = res?.data;
        data.person.Photo = (res?.data && res?.data?.length > 0) ? res?.data[0] : null;
      }
    } catch (err) {
      processServerError(err, 'person.onSelect.photos');
    }
    try {
      ownerParams.modelName = OwnerModelType.COMMENT;
      ownerParams.commentSetId = 0;
      const res: AxiosResponse = await api.comment.list({...ownerParams, modelName: OwnerModelType.COMMENT});
      data.comments = res?.data;
    } catch (err) {
      processServerError(err, 'person.onSelect.comments');
    }
  }

  // Set selected person
  try {
    select(data);
  } catch (err) {
    processServerError(err, 'person.onSelect');
  }
});

export default onSelect;
