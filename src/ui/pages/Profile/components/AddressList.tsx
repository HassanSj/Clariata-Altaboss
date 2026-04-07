import React, {ReactElement} from "react";
import {AddressItem} from "~/types/api/addressItem";
import {Button, Grid, List, ListItem, ListItemText} from "@material-ui/core";
import EmptyContainer from "~/ui/components/Containers/EmptyContainer";
import {ContactDataType} from "~/ui/constants/contact";
import style from "./AddressList.module.scss"
import {ApiRequestType, OwnerModelType, OwnerType} from "~/ui/constants/api";
import api from "~/services/api";
import {processServerError} from "~/services/api/errors";
import {OwnerParams} from "~/types/relations";
import {Household} from "~/types/api/household";
import useNotifications from "~/ui/hooks/useNotifications";
import ConfirmationModal from "~/ui/components/Dialogs/ConfirmationModal";

interface IProps{
    household?: Household
    addresses: AddressItem[],
    toggleEditModal:(type: ContactDataType, item?: any)=>void,
    onAddressDelete: ()=>void
}

function formatAddress(address: AddressItem){
    return [
        address.StreetAddress,
        address.City,
        address.StateRegion,
        address.PostalCode,
        address.Country
    ].filter(s => s !== undefined && s !== "").join(", ")
}

/**
 * Address list of household
 * @constructor
 */
const AddressList = ({addresses,toggleEditModal,household,onAddressDelete}: IProps):ReactElement => {
    const notifications = useNotifications()

    const [showDeleteConfirmation, setShowDeleteConfirmation] = React.useState<AddressItem|undefined>()
    const remove = async (item: AddressItem) => {
        const params: OwnerParams = {
            ownerType: OwnerType.HOUSEHOLD,
            requestType: ApiRequestType.REMOVE,
            modelId: item?.AddressItemID,
            modelName: OwnerModelType.ADDRESS,
            householdId: household?.HouseholdID,
        };

        notifications.toggleLoading(true);
        try {
            await api.address.remove(params, item);
            onAddressDelete()
        } catch (err) {
            processServerError(err, 'AddressList.remove');
        }
        notifications.toggleLoading(false);
    };

    return (
        <List dense={true} className="full-width">
            {addresses.length > 0 ?
                addresses.map(address => (
                    <ListItem key={address.AddressItemID}  className={style.AlternateListItem}>
                        <ListItemText>
                            <Grid container>
                                <Grid item xs={8}>
                                    <span>{address.AddressDescription}{address.MainAddress ? "(primary)" : ""}</span><br/>
                                    <span className={style.Text}>{formatAddress(address)}</span>
                                </Grid>
                                <Grid item xs={4}>
                                    <Button className={style.SmallButton} color="primary" size="small" onClick={() => toggleEditModal(ContactDataType.ADDRESS, address)}>Edit</Button>
                                    <Button className={style.SmallButton} color="primary" size="small" onClick={() => setShowDeleteConfirmation(address)}>Delete</Button>
                                </Grid>
                            </Grid>
                        </ListItemText>
                    </ListItem>
                ))
                :
                <EmptyContainer text={"No addresses"}/>
            }
            <ConfirmationModal isOpen={!!showDeleteConfirmation}
                               onConfirm={() => remove(showDeleteConfirmation!)}
                               onCancel={() => setShowDeleteConfirmation(undefined)} />
        </List>
    )
}

export default AddressList