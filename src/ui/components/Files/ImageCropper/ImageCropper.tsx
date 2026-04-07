import React, {ReactElement, useState} from 'react';
import Cropper from "react-cropper";
import {Box} from "@material-ui/core";
import {Photo} from "~/types/api/photo";
import {getPhotoSrc} from "~/ui/constants/user";

interface IProps {
  photo?: Photo;
  onSubmit?: any;
}

const ImageCropper = ({photo, onSubmit}: IProps): ReactElement => {
  const imageSrc = getPhotoSrc(photo);
  const [image, setImage] = useState(imageSrc);
  const [cropData, setCropData] = useState("#");
  const [cropper, setCropper] = useState<any>();

  const onChange = (e: any) => {
    e.preventDefault();
    let files;
    if (e.dataTransfer) {
      files = e.dataTransfer.files;
    } else if (e.target) {
      files = e.target.files;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as any);
    };
    reader.readAsDataURL(files[0]);
  };

  const getCropData = () => {
    if (typeof cropper !== "undefined") {
      setCropData(cropper.getCroppedCanvas().toDataURL());
      if (!onSubmit){
        onSubmit(cropData);
      }
    }
  };

  return (
    (
      <>
        <Box>
          <input type="file" onChange={onChange} />
        </Box>
        <Box>
          <Cropper
            style={{ height: 400, width: "100%" }}
            initialAspectRatio={1}
            src={image}
            viewMode={1}
            guides={true}
            minCropBoxHeight={10}
            minCropBoxWidth={10}
            background={false}
            responsive={true}
            autoCropArea={1}
            checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
            onInitialized={(instance) => {
              setCropper(instance);
            }}
          />
        </Box>
      </>
    )
  )
};

export default ImageCropper;
