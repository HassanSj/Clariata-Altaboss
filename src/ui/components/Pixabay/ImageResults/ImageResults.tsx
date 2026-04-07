import React, {ReactElement} from 'react';
import {GridListTile, GridListTileBar, ImageList} from '@material-ui/core';
import Modal from '../../Dialogs/Modal';

interface IProps {
    images: Array<any>;
    handleSubmit: (imgURL: string) => unknown;
}

const ImageResults = ({ images, handleSubmit }: IProps): ReactElement => {
    
    const [isOpen, setIsOpen] = React.useState(false);
    const [currentImage, setCurrentImage] = React.useState<string>('');
    // const [selectedImage, setSelectedImage] = React.useState<string>('');

    const handleOpen = (img : string) => {
        setIsOpen(true);
        setCurrentImage(img);
    }

    const handleClose = () => {
        setIsOpen(false);
    }

    let imageListContent;

    imageListContent = images ? (
        <ImageList cols={3}>
            {images.map(img => (
                <GridListTile
                    key={img.id}
                    cols={1}
                    onClick={()=>{handleOpen(img.largeImageURL)}}
                >
                    <img src={img.largeImageURL} alt=""/>
                    <GridListTileBar
                        title={img.tags}
                        subtitle={<span>by: {img.user}</span>}
                    />
                </GridListTile>
            ))}
        </ImageList>
    ) : null;

    return (
        <>
            <div>
                {imageListContent}
                <Modal 
                    title="Preview" 
                    isOpen={isOpen} 
                    handleClose={handleClose}
                    submitText="SELECT" 
                    handleSubmit={() => {
                        handleSubmit(currentImage);
                        handleClose();
                    }}>
                    <img src={currentImage} alt="" style={{ width: '100%'}} />
                </Modal>
            </div>
        </>
    );
};

export default ImageResults;
