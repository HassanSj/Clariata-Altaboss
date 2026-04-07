import React, {ReactElement, useState} from 'react';
import {useStoreActions, useStoreState} from "~/store/hooks";
import Modal from "~/ui/components/Dialogs/Modal";
import {
  convertImgToBase64URL,
  createEditHeaderSubmitText,
  createEditHeaderText,
  getBase64FromUrl,
  isNullOrUndefined
} from "~/ui/constants/utils";
import api from "~/services/api";
import {Button as MuiButton, DialogActions, Grid} from "@material-ui/core";
import Button from "~/ui/components/Button";
import {ApiRequestType, OwnerModelType, OwnerType} from "~/ui/constants/api";
import {OwnerParams} from "~/types/relations";
import Cropper from "react-cropper";
import {getPhotoSrcNoPlaceholder} from "~/ui/constants/user";
import {Photo} from "~/types/api/photo";
import useNotifications from "~/ui/hooks/useNotifications";
import styles from './PhotoForm.module.scss';
import useMountEvents from "~/ui/hooks/useMountEvents";
import {processServerError} from "~/services/api/errors";
import useOnChange from "~/ui/hooks/useOnChange";
import ConfirmationModal from "~/ui/components/Dialogs/ConfirmationModal";
import ImageFinder from '../../Pixabay/ImageFinder';
import {IObjectiveDataType} from "~/types/objective/store";

interface IProps {
  item?: Photo;
  ownerType: OwnerType,
  isOpen: boolean;
  onClose: () => unknown;
  customSubmit?: (img: string | undefined) => unknown;
  query?:string
}

const PhotoForm = ({ item, ownerType, isOpen, customSubmit, onClose,query }: IProps): ReactElement => {
  const notifications = useNotifications();

  const { user } = useStoreState(state => state.user);
  const { selectedHousehold} = useStoreState(state => state.household);
  const userActions = useStoreActions(actions => actions.user);
  const householdActions = useStoreActions(actions => actions.household);
  const objectiveActions = useStoreActions( actions => actions.objective)
  const { selectedPerson } = useStoreState(state => state.person);
  const { onSelect, onUpdate,onPopulate } = useStoreActions(actions => actions.person);
  const { selectedObjective } = useStoreState(state => state.objective);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showImageFinder, setShowImageFinder] = React.useState(false);

  const maxSizeInMb = 2;
  const isEdit = Boolean(item) && Boolean(item?.PhotoID);
  const params: OwnerParams = {
    ownerType,
    requestType: ApiRequestType.CREATE_UPDATE,
    modelId: item?.PhotoID,
    modelName: OwnerModelType.PHOTO,
    userId: user?.UserID,
    personId: selectedPerson?.PersonID,
    householdId: selectedHousehold?.HouseholdID,
    objectiveId: selectedObjective?.ObjectiveID
  };

  // Cropper state
  const [image, setImage] = useState<string | undefined>();
  const [crossOrigin, setCrossOrigin] = useState(false);
  const [cropper, setCropper] = useState<any>();


  // This is for editiong the contact picture with pixabay api
  const handleSubmit = async (img : string) => {
    notifications.toggleLoading(true);
    try {
      // Delete existing
      if (!customSubmit && item && item?.PhotoID) {
        params.requestType = ApiRequestType.REMOVE;
        await api.photo.remove(params, item, query);
      }
      // Create new
      const body: Photo = {
        Base64String: customSubmit ?  await getBase64FromUrl(img) as string : await convertImgToBase64URL(img) as string
      };
      if(customSubmit){
        customSubmit(body.Base64String);
      }
      else {
        params.requestType = ApiRequestType.CREATE_UPDATE;
        params.modelId = undefined;
        await api.photo.createOrUpdate(params, body,query);
      }
      await updateStore();
      setShowImageFinder(false);
      setImage(body.Base64String);
    } catch (err) {
      processServerError(err, 'PhotoForm.createOrUpdate');
    }
    notifications.toggleLoading(false);
  }

  /**
   * Create or update the image.
   */
  const createOrUpdate = async () => {
    notifications.toggleLoading(true);
    try {
      // Delete existing
      if (item && item?.PhotoID) {
        params.requestType = ApiRequestType.REMOVE;
        await api.photo.remove(params, item, query);
      }
      // Create new
      const body: Photo = {
        Base64String: getCropData()
      };
      if(customSubmit){
        customSubmit(body.Base64String);
      }
      params.requestType = ApiRequestType.CREATE_UPDATE;
      params.modelId = undefined;
      await api.photo.createOrUpdate(params, body, query);
      await updateStore();
      handleClose();
    } catch (err) {
      processServerError(err, 'PhotoForm.createOrUpdate');
    }
    notifications.toggleLoading(false);
  };

  /**
   * Delete the image.
   */
  const remove = async () => {
    if (!item) return;
    notifications.toggleLoading(true);
    try {
      params.requestType = ApiRequestType.REMOVE;
      await api.photo.remove(params, item, query);
      await updateStore();
      handleClose();
    } catch (err) {
      processServerError(err, 'PhotoForm.remove');
    }
    notifications.toggleLoading(false);
  };

  /**
   * Update related store entities.
   */
  const updateStore = async () => {
    if (ownerType === OwnerType.PERSON) {
      await onPopulate(null)
      await onUpdate({ person: selectedPerson });
      await onSelect({ person: selectedPerson });
    }
    else if (ownerType === OwnerType.HOUSEHOLD) {
      await householdActions.onPopulate(null);
      await householdActions.onSelect({ household: selectedHousehold });
    }
    else if (ownerType === OwnerType.USER) {
      await userActions.onPopulate(null);
    }else if(ownerType === OwnerType.OBJECTIVE){
      await objectiveActions.onPopulate({type: IObjectiveDataType.OBJECTIVE})
    }
  }

  /**
   * On image change event.
   * @param e
   */
  const onChange = (e: any) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    if (files && files[0] && files[0].size/1024/1024 > maxSizeInMb) {
      notifications.addErrorNotification(`File is larger than the max file size of ${maxSizeInMb}mb.`)
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as any);
    };
    reader.readAsDataURL(files[0]);
  };

  /**
   * Get image as Base64.
   */
  const getCropData = () => {
    return cropper.getCroppedCanvas({
      width: 1600,
      height: 1600
    }).toDataURL("image/jpeg");
  };

  /**
   * Clear existing image.
   */
  const clearDropData = () => {
    if (cropper) {
      cropper.clear();
      cropper.destroy();
      setImage(undefined);
    }
  }

  /**
   * Setup mount events.
   */
  useMountEvents({
    onMounted: () => {
      clearDropData();
      setImage(getPhotoSrcNoPlaceholder(item));
      setCrossOrigin(isNullOrUndefined(item?.URL));
    },
    onUnmounted: () => clearDropData()
  });

  /**
   * Setup photo change event.
   * NOTE: Cropper doesn't dynamically update if photo isn't initially available.
   */
  useOnChange({
    values: [item],
    onChange: () => {
      if (item) {
        clearDropData();
        setImage(getPhotoSrcNoPlaceholder(item));
        setCrossOrigin(isNullOrUndefined(item?.URL));
      }
    }
  })

  /**
   * Clear data and close.
   */
  const handleClose = () => {
    clearDropData();
    onClose();
  }

  return (
    <>
      <Modal title={`${createEditHeaderText(item)} Photo`} isOpen={isOpen} handleClose={handleClose} width="sm" hideFooter={true}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            { image ?
              <Cropper
                style={{ height: 400, width: "100%" }}
                initialAspectRatio={1}
                src={image}
                checkCrossOrigin={crossOrigin}
                viewMode={1}
                guides={true}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false}
                onInitialized={(instance) => {
                  setCropper(instance);
                }}
              />
            : null}
          </Grid>
          <Grid item xs={12}>
            <input
              style={{ display: 'none' }}
              id="raised-button-file"
              type="file"
              accept="image/x-png,image/jpeg"
              onChange={onChange}
            />
            <label htmlFor="raised-button-file">
              <MuiButton className={styles.upload_button}
                         fullWidth
                         color="primary"
                         size="large"
                         component="span">
                { image ? 'Upload Different Photo' : 'Upload Photo'}
              </MuiButton>
            </label>
          </Grid>
          <Grid item xs={12}>
            <MuiButton
              className={styles.upload_button}
              onClick={() => setShowImageFinder(true)}
              fullWidth
              color="primary"
              size="large"
              component="span">
              Pixabay
            </MuiButton>
          </Grid>
        </Grid>
        <DialogActions>
          <Button
            type="submit"
            text={`${createEditHeaderSubmitText(item)} Photo`}
            variant="contained"
            size="large"
            color="primary"
            onClick={createOrUpdate}
          />
          { isEdit ?
            <Button
              type="button"
              text={`Delete`}
              variant="contained"
              size="large"
              color="default"
              onClick={() => setShowDeleteConfirmation(true)}
            />
            : null }
          <ConfirmationModal isOpen={showDeleteConfirmation}
                             onConfirm={remove}
                             onCancel={() => setShowDeleteConfirmation(false)} />
        </DialogActions>
      </Modal>
      <ImageFinder isOpen={showImageFinder}
                      onClose={() => setShowImageFinder(false)}
                      handleSubmit={handleSubmit}></ImageFinder>
    </>
  );
};

export default PhotoForm;
