import {AxiosResponse} from "axios";
import api from "~/services/api";
import {ApiRequestType, OwnerModelType, OwnerType} from "~/ui/constants/api";
import {processServerError} from "~/services/api/errors";
import {Household} from "~/types/api/household";
import {Photo} from "~/types/api/photo";


export const populateHouseholdPhotos = async (household: Household) => {
  try {
    const photo: AxiosResponse = await api.photo.list({
      ownerType: OwnerType.HOUSEHOLD,
      requestType: ApiRequestType.LIST,
      modelName: OwnerModelType.PHOTO,
      householdId: household?.HouseholdID,
    });
    household.Photos = photo?.data;


    const familyPhoto: AxiosResponse = await api.photo.list({
      ownerType: OwnerType.HOUSEHOLD,
      modelName: OwnerModelType.FAMILY_PHOTO,
      requestType: ApiRequestType.NONE,
      householdId: household?.HouseholdID,
    });


    if(familyPhoto?.data){
      household.Photo = familyPhoto.data as Photo
    }else{
      household.Photo = undefined
    }

    const couplePhoto: AxiosResponse = await api.photo.list({
      ownerType: OwnerType.HOUSEHOLD,
      modelName: OwnerModelType.COUPLE_PHOTO,
      requestType: ApiRequestType.NONE,
      householdId: household?.HouseholdID,
    });

    if(couplePhoto?.data){
      household.CouplePhotoObject = couplePhoto?.data
    }else{
      household.CouplePhotoObject = undefined
    }

  } catch (e) {
    processServerError(e, 'household.onPopulate.person.photo');
  }

  return household;
}

export const populateHouseholdDirectionTaskProgress = async (household: Household) => {
  try {
    household.DirectionProgress = (await api.directionprogress.list(household.HouseholdID)).data
  } catch (e) {
    processServerError(e, 'household.onPopulate.directionprogress');
  }

  return household;
}
