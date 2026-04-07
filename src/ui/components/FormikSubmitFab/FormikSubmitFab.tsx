import React, {Dispatch, ReactElement, SetStateAction} from "react";
import {Box, Fab, Slide} from "@material-ui/core";
import style from "./FormikSubmitFab.module.scss"
import {useFormikContext} from "formik";
import Add from '@material-ui/icons/Add';
import Edit from '@material-ui/icons/Edit';
import Favorite from '@material-ui/icons/Favorite';
import Navigation from '@material-ui/icons/Navigation';

interface IProps {
    show?: boolean,
    title?:string
    changePersonStatus?: Dispatch<SetStateAction<boolean>>;
    markIsNotDirty: any
}

const FormikSubmitFab = ({show = true, title="Save", changePersonStatus, markIsNotDirty}:IProps):ReactElement => {
    const { submitForm } = useFormikContext();

    return (
        <>

        {/* <Box>  */}
            {/* <Slide direction="left" in={show}> */}
                <Fab
                    onClick={() => {
                        submitForm();
                        changePersonStatus ? changePersonStatus(false) : null
                        markIsNotDirty();
                    }}                    
                    aria-label="save"
                    color="primary"
                    variant="extended"
                    className={style.floatingButton}
                    >
                    {title}
                </Fab>
            {/* </Slide> */}
        {/* </Box> */}
        </>
    )
}

export default FormikSubmitFab