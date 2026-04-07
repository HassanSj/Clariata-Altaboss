import {Person} from "~/types/api/person";
import {Action, Thunk} from "easy-peasy";
import {WorkHistoryItem} from "~/types/api/workHistoryItem";
import {PersonalRelationship} from "~/types/api/personalRelationship";
import {Household} from "~/types/api/household";
import {PhotoAlbum} from "~/types/api/photoAlbum";
import {Photo} from "~/types/api/photo";
import {PhoneNumberItem} from "~/types/api/phoneNumberItem";
import {AddressItem} from "~/types/api/addressItem";

export interface IPersonStoreModel {
  persons: Person[];
  selectedPerson?: Person;
  selectedHousehold?: Household;
  selectedPhotoAlbum?: PhotoAlbum;
  selectedPhoto?: Photo;
  selectedPhotos?: Photo[];
  selectedPhoneNumbers?: PhoneNumberItem[];
  selectedAddresses?: AddressItem[];
  selectedWorkHistory?: WorkHistoryItem[];
  selectedEducation?: WorkHistoryItem[];
  selectedRelationships?: PersonalRelationship[];
  selectedComments?: Comment[];

  populate: Action<IPersonStoreModel, unknown>;
  onPopulate: Thunk<IPersonStoreModel, unknown>;
  select: Action<IPersonStoreModel, unknown>;
  onSelect: Thunk<IPersonStoreModel, unknown>;
  onClear: Thunk<IPersonStoreModel, unknown>;
  clear: Action<IPersonStoreModel, unknown>;
  onUpdate: Thunk<IPersonStoreModel, unknown>;
  update: Action<IPersonStoreModel, unknown>;
}