import React, {ReactElement} from 'react';
import {Button, Grid, Icon, TextField} from '@material-ui/core';
import axios from 'axios';
import ImageResults from '../ImageResults/ImageResults';
import Modal from '../../Dialogs/Modal';
import styles from './ImageFinder.module.scss';
import useNotifications from '~/ui/hooks/useNotifications';
import useMountEvents from '~/ui/hooks/useMountEvents';

interface IProps {
    isOpen: boolean;
    onClose: () => unknown;
    handleSubmit: (imgURL: string) => unknown;
}  

const ImageFinder = ({ isOpen, onClose, handleSubmit }: IProps): ReactElement => {
    const notifications = useNotifications();

    const [searchText, setSearchText] = React.useState("");
    const [amount, setAmount] = React.useState(9);
    const apiUrl = "https://pixabay.com/api"
    const apiKey = "22676284-37858cf0c083dcbe73fdb8145";
    const [images, setImages] = React.useState([]);
    const [pageNumber, setPageNumber] = React.useState(1);

    const handleSelect = () => {
    }
    
    const getImages = async () => {
        await axios.get(`${apiUrl}/?key=${apiKey}&q=${searchText}&image_type=photo&page=${pageNumber}&per_page=${amount}&safesearch=true`)
        .then(res => setImages(res.data.hits))
        .catch(err => console.log(err));
    }

    const onTextChange = async (e: { target: { value: React.SetStateAction<string>; }; }) => {
        const val = e.target.value;
        setPageNumber(1);
        if(val === '')
        {
            setSearchText(val);
            setImages([]);
        }
        else
        {
            setSearchText(val);
        }
    }

    const isPreviousAvailable = () => {
        return pageNumber > 1;
    }

    const previous = async () => {
        setPageNumber(pageNumber-1);
    }

    const next = async () => {
        setPageNumber(pageNumber+1);
    }

    useMountEvents({
        onChange: async () => {
            notifications.toggleLoading(true);
            await getImages();
            notifications.toggleLoading(false);
        },
        watchItems: [pageNumber, searchText ]
      });
    

    return (
        <>
        <Modal 
                    title="Preview" 
                    isOpen={isOpen} 
                    handleClose={onClose}
                    submitText="SELECT" 
                    handleSubmit={handleSelect}>
            <TextField
                name="searchImage"
                value={searchText}
                onChange={onTextChange}
                id="standard-basic"
                label="Search"
                placeholder="Search"
                fullWidth={true} />
            <br/>
            {images.length > 0 ?
            <>
                <ImageResults images={images} handleSubmit={handleSubmit}/>
                <Grid container spacing={1}>
                    <Grid item xs={1}>
                        <Button color="secondary"
                                disabled={!isPreviousAvailable()}
                                onClick={() => previous()}>
                            <Icon className={styles.previous_icon}>keyboard_arrow_left</Icon>
                        </Button>
                    </Grid>
                    <Grid item xs={10}>
                    </Grid>
                    <Grid item xs={1}>
                        <Button color="secondary"
                                onClick={() => next()}>
                            <Icon className={styles.next_icon}>keyboard_arrow_right</Icon>
                        </Button>
                    </Grid>
                </Grid>
            </> : null }
        </Modal>
        </>
    );
};

export default ImageFinder;
