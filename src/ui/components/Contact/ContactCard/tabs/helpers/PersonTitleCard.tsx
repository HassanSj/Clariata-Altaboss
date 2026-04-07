import React, {ReactElement, useEffect} from "react";
import {Button, CardActions, Grid} from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import Avatar from "@material-ui/core/Avatar";
import {getFullName, getInitials, getPhotoSrc, getPhotoSrcByUrl} from "~/ui/constants/user";
import persondefault from "../../../../../../../public/images/placeholders/person_default.png";
import classnames from "classnames";
import styles from "~/ui/components/Contact/ContactCard/ContactCard.module.scss";
import {ContactDataType} from "~/ui/constants/contact";
import {TabProps} from "~/ui/components/Contact/ContactCard/TabProps";
import {getPersonTitle} from "~/ui/constants/person";
import {PersonType} from "~/ui/constants/api";
import {PhoneNumberItem} from "~/types/api/phoneNumberItem";
import {formatPhoneNumber} from "~/ui/components/Contact/ContactCard/tabs/accordions/ContactAccordion";
import {Person} from "~/types/api/person";
import {onlyNonUndefined} from "../../../../../../../utils/filter";

interface IProps extends TabProps{
    hideAvatar?:boolean,
    setShowDeleteConfirmation: (value: boolean) => unknown,
    phoneNumbers: PhoneNumberItem[],
    currentValues?: Person,
    endEditMode: any,
}

const PersonTitleCard = ({setShowDeleteConfirmation,toggleEditModal,person,currentValues, phoneNumbers, endEditMode}:IProps):ReactElement => {
    const phones = phoneNumbers
                    .map(item => item.PhoneNumber && item.PhoneNumber.trim() !== "" ? formatPhoneNumber(item.PhoneNumber!) : undefined)
                    .filter(onlyNonUndefined)
                    .join(", ");
    // useEffect(() => {
    //     console.log(phoneNumbers);
    // },[])

    return (
        <Grid container item>
            <Grid item xs={12}>
                <Card>
                    <CardHeader
                        avatar={
                            <Avatar
                                aria-label="recipe"
                                variant="square"
                                //src={person?.Photo ? getPhotoSrc(person?.Photo) : persondefault}
                                src={getPhotoSrcByUrl(person?.PhotoURL)}
                                className={classnames(styles['avatar-big'])}
                                onClick={()=> toggleEditModal(ContactDataType.PHOTO, person?.Photo)}>
                                {getInitials(currentValues)}
                            </Avatar>
                        }
                        title={getFullName(currentValues)}
                        subheader={(
                            <>
                                <Grid container>
                                    {getPersonTitle(currentValues) }
                                </Grid>
                                <Grid container>
                                    {currentValues?.EmailAddress}
                                </Grid>
                                <Grid container>
                                    <span>{phones}</span>
                                </Grid>

                            </>
                        )}
                    />
                    <CardActions>
                        {person?.PersonTypeID !== PersonType.PRIMARY &&
                        <>
                            <Button color="default" onClick={() => setShowDeleteConfirmation(true)}>
                                Delete Contact
                            </Button>
                        </>
                        }
                    </CardActions>
                </Card>
            </Grid>
        </Grid>
    )
}

export default PersonTitleCard