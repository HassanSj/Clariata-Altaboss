import React, {ReactElement} from "react";
import {Avatar, Icon, ListItem, ListItemAvatar, ListItemText} from "@material-ui/core";
import {SharedItem} from "~/types/api/sharedItem";
import {useStoreState} from "~/store/hooks";
import {ShareType} from "~/types/api/shareType";
import EditSharing from "~/ui/components/Sharing/EditSharing";

interface IProps {
  item: SharedItem
}

const SharingItem = ({ item }: IProps): ReactElement => {
  const { shareType } = useStoreState(state => state.constants);
  const currentShareType = shareType.find((t: ShareType) => t.ShareTypeID === item.ShareTypeID);
  const [showEditDialog, setShowEditDialog] = React.useState(false);

  return (
    <>
      <ListItem onClick={() => setShowEditDialog(true)} button>
        <ListItemAvatar>
          <Avatar>
            <Icon>perm_identity</Icon>
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={item?.EmailAddress} secondary={currentShareType?.ShareType} />
      </ListItem>
      <EditSharing item={item}
                   isOpen={showEditDialog}
                   onClose={() => setShowEditDialog(false)}></EditSharing>
    </>
  )
}

export default SharingItem;