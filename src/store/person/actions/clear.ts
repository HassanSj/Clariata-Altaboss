import {action, Action} from 'easy-peasy';
import {IPersonStoreModel} from "~/types/person/store";

const clear: Action<IPersonStoreModel> = action((state: any, payload: any) => {
  state.persons = null;
  state.selectedPerson = null;
  state.selectedHousehold = null;
  state.selectedPhotoAlbum = null;
  state.selectedPhoto = null;
  state.selectedPhoneNumbers = null;
  state.selectedAddresses = null;
  state.selectedWorkHistory = null;
  state.selectedEducation = null;
  state.selectedRelationships = null;
  state.selectedComments = null;
});

export default clear;
