import {
  IconButton,
} from "@material-ui/core";
import Icon from "@material-ui/core/Icon";
import React from "react";
import {useRouter} from "next/router";
import {useStoreState, useStoreActions} from "~/store/hooks";
import paths from "~/ui/constants/paths";
import Widget from "~/ui/components/Widgets/Widget";
import { getPhotoUrlOrDefault } from "~/ui/constants/user";
import styles from "./../Widgets.module.scss";

const { CONTACTS} = paths;

interface IProps {
  personID: number;
}

const ProfileWidget = ({personID}: IProps) => {
  const router = useRouter();
  const { persons } = useStoreState(state => state.person);
  const { onSelectContact } = useStoreActions(action => action.selected);

  const person = persons?.find(p => p.PersonID === personID);

  const goToProfile = async () => {
    await onSelectContact(personID);
    router.push(`${CONTACTS}`);
  }


  return (
    <>
      <Widget title="Profile" image={getPhotoUrlOrDefault(person)}>
        {person ? 
          <span className={styles.cl_image_title}>
            <span className={styles.cl_image_profile}>Profile</span>
            <span className={styles.cl_image_name}>{person?.FullName}</span>
            <IconButton onClick={async () => await goToProfile()}>
              <Icon style={{color: "white"}}>arrow_forward</Icon>
            </IconButton>
          </span>
        : null}
        

      </Widget>

    </>
  )
}

export default ProfileWidget;
