import React, {ReactElement} from "react";
import {Button, Card, CardContent, CardHeader, Grid, List} from "@material-ui/core";
import Input from "~/ui/components/Forms/Input";
import InputField from "~/ui/components/Forms/InputField";
import CustomAccordion from "~/ui/components/Containers/CustomAcordion";
import {useStoreState} from "~/store/hooks";
import SimpleListItem from "~/ui/components/Contact/ContactCard/tabs/helpers/SimpleListItem";
import {PhoneNumberTypeNames} from "~/ui/constants/person";
import ContactAccordionProps from "~/ui/components/Contact/ContactCard/tabs/accordions/ContactAccordionProps";
import {ContactDataType} from "~/ui/constants/contact";
import styles from "./ContactAccordion.module.scss"
import EmptyContainer from "~/ui/components/Containers/EmptyContainer";
import {Person} from "~/types/api/person";
import {AddressItem} from "~/types/api/addressItem";
import {onlyNonUndefined} from "../../../../../../../utils/filter";
import useSWR from "swr";
import { getAccessToken } from "~/services/auth";
import { fetcher } from "~/types/api/fetcher";
import { PhoneNumberItem } from "~/types/api/phoneNumberItem";

interface ItemRowProps {
    children?: React.ReactNode,
    showCreateModal: () => unknown,
    buttonTitle: string,
    title: string,
    emptyMessage:string
}
const ItemRow = ({children, title, showCreateModal, buttonTitle,emptyMessage}:ItemRowProps):ReactElement => {
    return (
        <Grid item xs={6} className="m-t-10 m-b-10">
            <span className="MuiFormLabel-root MuiInputLabel-root">{title}</span>
            <List dense={true} className="full-width">
                {children ? children : <EmptyContainer text={emptyMessage}/>}
            </List>
            <Button onClick={showCreateModal}>{buttonTitle}</Button>
        </Grid>
    )
}

interface IProps extends ContactAccordionProps{
    showEditModal: (type: ContactDataType, item: any) => unknown,
}

export function formatPhoneNumber(phoneNumberString:string) {
    const cleaned = ('' + phoneNumberString).replace(/\D/g, '')
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3]
    }
    return undefined
}

export function formatAddress(address: AddressItem){
    return [
        address.City,
        address.StateRegion,
        address.PostalCode,
    ].filter(onlyNonUndefined).join(", ")
}

const ContactAccordion = ({showEditModal, person}:IProps):ReactElement => {

    const {contactId, householdId} = useStoreState((state) => state.selected);

    //const { selectedPhoneNumbers,selectedAddresses } = useStoreState(store => store.person);

    const urlAddresses = `${process.env.NEXT_PUBLIC_API_URL}/household/${householdId}/person/${contactId}/address/list`;
    const {data: selectedAddresses} = useSWR<AddressItem[]>([urlAddresses, getAccessToken()], fetcher);   

    const urlPhoneNumbers = `${process.env.NEXT_PUBLIC_API_URL}/household/${householdId}/person/${contactId}/phonenumber/list`;
    const {data: selectedPhoneNumbers} = useSWR<PhoneNumberItem[]>([urlPhoneNumbers, getAccessToken()], fetcher, {refreshInterval: 300});
    return (
        // <CustomAccordion summary="Contact" defaultExpanded={defaultExpanded}>
        <Card>
            <CardHeader title="Contact"/>
            <CardContent>
                <Grid container>
                    <Grid container>
                        <Grid item xs={12}>
                            <InputField
                                type="email"
                                name="EmailAddress"
                                component={Input}
                                placeholder="Email Address"
                                label="Email Address" />
                        </Grid>
                    </Grid>
                    {person && person.PersonID &&
                    <Grid container className="p-10">
                        <ItemRow
                            emptyMessage="No phone numbers found"
                            title="PHONE NUMBERS"
                            buttonTitle="Add Phone Number"
                            showCreateModal={() => showEditModal(ContactDataType.PHONE_NUMBER, null)}>
                            {selectedPhoneNumbers && selectedPhoneNumbers.length > 0 && selectedPhoneNumbers?.map(item => (
                                <SimpleListItem icon="settings_phone" showFullEditModal={() => {
                                    showEditModal(ContactDataType.PHONE_NUMBER, item)
                                }} primaryTitle={formatPhoneNumber(item.PhoneNumber ?? "") ?? ""}
                                                secondaryTitle={item.PhoneNumberTypeID ? PhoneNumberTypeNames[item.PhoneNumberTypeID] : "Phone"}/>
                            ))}
                        </ItemRow>
                        <ItemRow
                            emptyMessage="No addresses found"
                            title="ADDRESSES"
                            buttonTitle="Add Address"
                            showCreateModal={() => showEditModal(ContactDataType.ADDRESS, null)}>
                            {selectedAddresses && selectedAddresses.length > 0 && selectedAddresses?.map(item => (
                                <SimpleListItem icon="location_on" showFullEditModal={() => {
                                    showEditModal(ContactDataType.ADDRESS, item)
                                }}>
                                    {item?.StreetAddress ? item?.StreetAddress : item?.AddressDescription}<br/>
                                    {formatAddress(item!)} <br/>
                                    {item?.StreetAddress && <span className={styles.address_label}>{item?.AddressDescription}</span>}
                                </SimpleListItem>
                            ))}
                        </ItemRow>
                    </Grid>
                    }
                </Grid>
            </CardContent>
        </Card>
    )
}

export default ContactAccordion