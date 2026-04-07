import {action, Action} from 'easy-peasy';
import {Person} from 'types/api/person';
import {WorkHistoryItem} from "~/types/api/workHistoryItem";
import {PersonalRelationship} from "~/types/api/personalRelationship";
import {Household} from "~/types/api/household";
import {PhotoAlbum} from "~/types/api/photoAlbum";
import {Photo} from "~/types/api/photo";
import {PhoneNumberItem} from "~/types/api/phoneNumberItem";
import {IPersonStoreModel} from "~/types/person/store";

export interface IPersonPayload {
  person?: Person | undefined;
  household?: Household | undefined;
  photoAlbum?: PhotoAlbum | undefined;
  photo?: Photo | undefined;
  photos?: Photo[] | undefined;
  phoneNumbers?: PhoneNumberItem[] | undefined;
  addresses?: WorkHistoryItem[] | undefined;
  workHistory?: WorkHistoryItem[] | undefined;
  education?: WorkHistoryItem[] | undefined;
  relationships?: PersonalRelationship[] | undefined;
  comments?: Comment[] | undefined;
}

const select: Action<IPersonStoreModel, IPersonPayload> = action((state: any, payload: IPersonPayload) => {
  state.selectedPerson = payload?.person;
  state.selectedHousehold = payload?.household;
  state.selectedPhotoAlbum = payload?.photoAlbum;
  state.selectedPhoto = (payload?.photos && payload?.photos.length > 0) ? payload?.photos[0] : payload?.photo;
  state.selectedPhotos = payload?.photos;
  state.selectedPhoneNumbers = payload?.phoneNumbers;
  state.selectedAddresses = payload?.addresses;
  state.selectedWorkHistory = payload?.workHistory;
  state.selectedEducation = payload?.education;
  state.selectedRelationships = payload?.relationships;
  state.selectedComments = payload?.comments;
});

export default select;
