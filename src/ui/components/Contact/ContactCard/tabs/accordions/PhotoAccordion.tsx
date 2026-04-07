import React, {ReactElement} from "react";
import {Card, CardContent, CardHeader, CardMedia, Grid} from "@material-ui/core";
import ContactAccordionProps from "~/ui/components/Contact/ContactCard/tabs/accordions/ContactAccordionProps";
import {ContactDataType} from "~/ui/constants/contact";
import * as classnames from "classnames";
import styles from '../../ContactCard.module.scss';
import {getPhotoSrc} from "~/ui/constants/user";
import CustomAccordion from "~/ui/components/Containers/CustomAcordion";

interface IProps extends ContactAccordionProps{
    toggleEditModal?: (type: ContactDataType, item: any | undefined) => void,
}

const PhotoAccordion = ({person,personEntity,toggleEditModal}:IProps):ReactElement => {
    return (
        // <CustomAccordion summary="Photo" defaultExpanded={defaultExpanded}>
        <Card>
            <CardHeader title="Photo"/>
            <CardContent>
                <Grid container>
                    <Grid item xs={6}>
                        <CardMedia
                            className={classnames(styles.media)}
                            image={getPhotoSrc(personEntity?.Photo)}
                            component="span"
                            title="Photo"
                            onClick={() => ( toggleEditModal ? toggleEditModal(ContactDataType.PHOTO, person?.Photo) : null)}
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default PhotoAccordion