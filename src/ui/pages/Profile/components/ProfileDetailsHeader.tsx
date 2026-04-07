import React, {ReactElement, useEffect, useState} from "react";
import {Button, Grid, InputLabel, ListItemText, MenuItem, OutlinedInput, Select} from "@material-ui/core";
import {getPhotoSrc, getPhotoSrcByUrl} from "~/ui/constants/user";
import familydefault from "../../../../../public/images/placeholders/family_default.png";
import Avatar from "@material-ui/core/Avatar";
import ProfileProps from "~/ui/pages/Profile/components/ProfileProps";
import style from "./ProfileDetailsHeader.module.scss"
import * as classnames from "classnames";
import api from "~/services/api";
import {OwnerParams} from "~/types/relations";
import {ApiRequestType, OwnerModelType, OwnerType} from "~/ui/constants/api";
import {AddressItem} from "~/types/api/addressItem";
import EditContactModals from "~/ui/components/Contact/EditContactModals";
import useEditable from "~/ui/hooks/useEditable";
import {ContactDataType, ContactDataTypes} from "~/ui/constants/contact";
import AddressList from "~/ui/pages/Profile/components/AddressList";
import router from "next/router";
import { ReportDefinition, ReportType, ReportTypes } from "~/ui/constants/reports";
import useReports from "~/ui/hooks/useReports";

/**
 * Get household address from the api
 * @param householdID
 */
export async function downloadHouseholdAddress(householdID: number): Promise<AddressItem[]> {
    const ownerParams: OwnerParams = {
        requestType: ApiRequestType.LIST,
        modelName: OwnerModelType.ADDRESS,
        ownerType: OwnerType.HOUSEHOLD,
        householdId: householdID
    };

    const resp = await api.address.list(ownerParams)

    if (resp && resp.data) {
        return resp.data as AddressItem[]
    } else {
        return []
    }
}

/**
 * Main component
 * @param household
 * @param primaryContacts
 * @constructor
 */
const ProfileDetailsHeader = ({household}: ProfileProps): ReactElement => {

    const [householdAddress, setHouseholdAddress] = React.useState<AddressItem[]>([])
    const [profileReport, setProfileReport] = useState<ReportType>(); 
    const editable = useEditable(ContactDataTypes);
    const {getReportRoutePath } = useReports();

    const downloadAddresses = async () => {
        const data = await downloadHouseholdAddress(household?.HouseholdID)
        setHouseholdAddress(data)
    }

    const handleProfileReportChange = (e: any) => {
        setProfileReport(e?.target?.value)
    }

    const handleRoute = () => {
        if(profileReport){
            const pathName = getReportRoutePath(profileReport);
            router.push(pathName);
        }  
    }

    useEffect(() => {
        downloadAddresses().then()
    }, [])

    const toggleEditModal = (type: ContactDataType, item?: any) => {
        editable.setSelectedAndShow(type, item);
    }

    return (
        <>
            <Grid container spacing={1} className="p-l-50 p-r-50">
                <Grid item xs={6}>
                    <Grid container spacing={5}>
                        <Grid item xs={5}>
                            <Avatar
                                className={classnames(style.avatar)}
                                variant="square"
                                alt={household?.HouseholdName}
                                src={getPhotoSrcByUrl(household?.PhotoURL)}/>
                        </Grid>
                        <Grid item xs={7}>
                            <AddressList
                                onAddressDelete={downloadAddresses}
                                household={household}
                                addresses={householdAddress}
                                toggleEditModal={toggleEditModal}/>
                            <div className="m-t-10">
                                {household?.Photo &&
                                <Button color="primary" size="small"
                                        onClick={() => toggleEditModal(ContactDataType.FAMILY_PHOTO, household.Photo)}>
                                    Edit Photo &gt;
                                </Button>
                                }
                                <Button color="primary" size="small"
                                        onClick={() => toggleEditModal(ContactDataType.ADDRESS, null)}>Add Address &gt;
                                </Button>
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <Grid container>
                        <Grid item xs={4} className="text-center">
                            <Button color="primary" variant="contained"
                                    onClick={() => toggleEditModal(ContactDataType.FAMILY_PHOTO, household.Photo)}>
                                Add Family Picture
                            </Button>
                        </Grid>
                        <Grid item xs={4} className="text-center">
                            <Button color="primary" variant="contained"
                                    onClick={() => toggleEditModal(ContactDataType.COUPLE_PHOTO, household.CouplePhotoObject)}>Add
                                Couple Picture</Button>
                        </Grid>
                        <Grid item xs={4} className="text-center">
                            {/* <Button color="primary" variant="contained"
                                    onClick={() => { 
                                        const pathName = getReportRoutePath(ReportType.LEGACY_OF_FIVE);
                                        router.push(pathName);
                                    }}>
                                Legacy of Five Profile</Button> */}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container className="p-l-50 p-r-50">
                <h1>{household?.HouseholdName}</h1>
                <Grid item xs={4}></Grid>
                <Grid item xs={4}>
                    <div
                        style={{
                            marginLeft: '372px',
                            marginRight: 'auto',
                            width: '316px',
                            marginTop: '-16px',
                        }}
                    >
                        <InputLabel id="demo-simple-select-label" style={{ marginLeft: '5px' }}>
                            Select a Report
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            fullWidth={true}
                            style={{ height: '40px', borderRadius: '5px', backgroundColor: 'white' }}
                            onChange={handleProfileReportChange}
                            MenuProps={{
                                anchorOrigin: {
                                vertical: 'bottom',
                                horizontal: 'left',
                                },
                                transformOrigin: {
                                vertical: 'top',
                                horizontal: 'left',
                                },
                                getContentAnchorEl: null,
                            }}
                            value={profileReport}
                            input={<OutlinedInput label="Tag" />}
                            renderValue={(selected: any) => {
                                return profileReport?.split("_")?.join(" ");
                            }}
                        >
                        {Object.keys(ReportTypes)
                            ?.filter(
                            reportKey => ReportTypes[reportKey]?.profile && !ReportTypes[reportKey]?.editable,
                            )
                            ?.map((reportKey: any, index: number) => {
                            const report: ReportDefinition = ReportTypes[reportKey];
                            if (
                                report.type !== ReportType.PROFILE &&
                                report.type !== ReportType.LEGACY_OF_FIVE
                            ) {
                            } else {
                                return (
                                <MenuItem
                                    key={index}
                                    value={report?.type}
                                    selected={report?.type === report?.type ? true : false}
                                >
                                    <ListItemText primary={report?.type?.split("_")?.join(" ")} />
                                </MenuItem>
                                );
                            }
                            })}
                        </Select>
                    </div>
                </Grid>
                <Grid item xs={2}>
                    <Button color="primary" variant="contained"
                        onClick={() => handleRoute()}
                        style={{ width: "159px", marginLeft: "121px"}}
                    >
                        View
                    </Button>
                </Grid>
            </Grid>
            <EditContactModals editable={editable} ownerType={OwnerType.HOUSEHOLD} onHide={downloadAddresses}/>
        </>
    )
}

export default ProfileDetailsHeader