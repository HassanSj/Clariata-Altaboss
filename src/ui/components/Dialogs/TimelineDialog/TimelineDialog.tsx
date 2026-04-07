import React, {ReactElement, useEffect} from "react";
import {
    Button as MuiButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Icon,
    IconButton
} from "@material-ui/core";
import Button from "~/ui/components/Button";
import styles from "~/ui/components/Dialogs/ConfirmationModal/ConfirmationModal.module.scss";
import InputField from "~/ui/components/Forms/InputField";
import Input from "~/ui/components/Forms/Input";
import FormWrapper from "~/ui/components/Forms/FormWrapper";
import initialValues from './form/initialValues';
import validate from './form/validate';
import { IFormActionProps } from "~/types/forms";
import SelectDate from "../../Forms/SelectDate";
import PhotoForm from "../../Contact/PhotoForm";
import { OwnerType } from "~/ui/constants/api";
import { TimelineItem } from "~/types/api/timelineItem";
import api from "~/services/api";
import {useStoreState} from "~/store/hooks";
import { extractServerError } from "~/services/api/errors";
import moment from "moment";
import { createEditHeaderText, createEditMessageText } from "~/ui/constants/utils";
import EventTypes from "./shared/EventTypes";
import {SpouseTypes, Spouse} from "./shared/SpouseTypes";
import SelectAutocomplete from "../../Forms/SelectAutocomplete";
import SelectAvatarTemplate from "../../Forms/SelectAutocomplete/components/SelectAvatarTemplate";
import { BOTH_PERSONS_OPTION } from "~/services/interview";
import useSWR from "swr";
import { Person } from "~/types/api/person";
import { getAccessToken } from "~/services/auth";
import { fetcher } from "~/types/api/fetcher";

interface IProps {
    item?: TimelineItem,
    // spouses:Person[],
    onClose: () => unknown,
    isOpen: boolean,
    onSave: (item: TimelineItem) => unknown,
}

const TimelineDialog = ({item, onClose, isOpen, onSave}:IProps): ReactElement => {

    const isNewItem = item ? false : true;

    const [selectablePersons, setSelectablePersons] = React.useState<Person[] | undefined>([]);
    const {householdId, primary1Id, primary2Id } = useStoreState(state => state.selected);

    const { data: persons } = useSWR<Person[]>([`${process.env.NEXT_PUBLIC_API_URL}/household/${householdId}/person/list`, getAccessToken()], fetcher);

    useEffect(() => {        

        console.log("primary");
        const primaryPersons = persons?.filter(p => p.PersonTypeID == 2);
        console.log(primaryPersons);

        const spouses = (primaryPersons && primaryPersons?.length > 1) ? [...primaryPersons, BOTH_PERSONS_OPTION] : (primaryPersons && primaryPersons?.length == 1) ? [primaryPersons[0]] : [BOTH_PERSONS_OPTION];

        setSelectablePersons(spouses);

    }, [item]);
    
    const [timelineImage,setTimelineImage] = React.useState(isNewItem ? undefined : item?.Image);

    // const [timelineIcon,setTimelineIcon] = React.useState(isNewItem ? undefined : item.icon);

    const [showEditTimelineImage,setShowEditTimelineImage] = React.useState(false);
    // const [showEditTimelineIcon,setShowEditTimelineIcon] = React.useState(false);

    const createOrUpdate = async (values: TimelineItem, { setErrors }: IFormActionProps) => {
        try {
            const personsRes = await api.household.get(householdId);
            const {PrimaryPerson1ID,PrimaryPerson2ID} = personsRes?.data;
            if(values.PersonId === Spouse.SPOUSE1){
                values.PersonId = PrimaryPerson1ID
            }
            else if(values.PersonId === Spouse.SPOUSE2){
                values.PersonId = PrimaryPerson2ID
            }
            else if(values.PersonId === Spouse.BOTH){
                values.PersonId = 0;
            }
            // if(values.TimelineItemID === null || values.TimelineItemID === undefined || values.TimelineItemID === 0)
            // {
            //   values.Description = evaluationDescription;
            // }
            values.Image = timelineImage;
            values.EventDate = moment(values.EventDate).add(1,'days').toDate();
            console.log(values.Description);
            const res = await (values?.TimelineItemID ? api.timelineItem.update(householdId, -1, values?.TimelineItemID, values) : api.timelineItem.create(householdId, -1, values));
            const result = res.data as TimelineItem;
      
            if(result.TimelineItemID)
            {
              setErrors({ successMessage: `Timeline item successfully ${createEditMessageText(item)}`});
              onSave(result);
            }
          } catch (err) {
            setErrors({ backError: extractServerError(err) });
          }
        setTimelineImage(undefined);
        onClose();
    };

    return (
        <>
            <Dialog open={isOpen}
                    onClose={onClose}
                    scroll="body"
                    fullWidth
                    maxWidth="sm">
                <FormWrapper initialValues={isNewItem ? initialValues : item}
                                    validationSchema={validate}
                                    onSubmit={createOrUpdate}
                                    modelName="TimelineItem">
                    <DialogTitle>
                        {createEditHeaderText(item)} Timeline Item
                        <IconButton className={styles.close_icon}
                                    edge="end"
                                    color="inherit"
                                    onClick={onClose}
                                    aria-label="close">
                            <Icon>close</Icon>
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={1}>
                            <Grid item xs={4}>
                                <InputField type="text"
                                            name="EventName"
                                            component={Input}
                                            placeholder="Name"
                                            label="Name"
                                            required={true}
                                            />
                            </Grid>
                            <Grid item xs={4}>
                                <InputField type="select"
                                            name="EventTypeId"
                                            component={Input}
                                            placeholder="Select Type"
                                            label="Type"
                                            items={EventTypes}
                                            required={true}
                                            />
                            </Grid>
                            <Grid item xs={4}>
                                <InputField type="autocomplete"
                                    name="PersonId"
                                    label="Client"
                                    component={SelectAutocomplete}
                                    templateComponent={SelectAvatarTemplate}
                                    items={selectablePersons}
                                    // label="Client"
                                    labelField="FirstName"
                                    valueField="PersonID"
                                    orientation="horizontal"
                                    disableClearable={true}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={1}>
                            <Grid item xs={9}>
                                <InputField type="text"
                                            name="Description"
                                            component={Input}
                                            placeholder="Description"
                                            label="Description"
                                            />
                            </Grid>
                            <Grid item xs={3}>
                                <InputField type="date"
                                            name="EventDate"
                                            component={SelectDate}
                                            placeholder="Event Date"
                                            label="Event Date"
                                            />
                            </Grid>
                        </Grid>
                        {timelineImage ? 
                        <img src={timelineImage} style={{height:"50px", width:"50px"}}/>
                        : null }
                        {/* <Grid container spacing={1}>
                            <Grid item xs={6}>
                                <MuiButton onClick={onClose} color='default' fullWidth={true}>
                                    Add Image
                                </MuiButton>
                            </Grid>
                            <Grid item xs={6}>
                                <MuiButton onClick={onClose} color='default' fullWidth={true}>
                                    Add Icon
                                </MuiButton>
                            </Grid>
                        </Grid> */}
                    </DialogContent>
                    <DialogActions>
                        <MuiButton onClick={() => setShowEditTimelineImage(true)} color='secondary' >
                            {createEditHeaderText(item?.Image)} Image
                        </MuiButton>
                        {/* <MuiButton onClick={() => setShowEditTimelineIcon(true)} color='secondary' >
                                    Add Icon
                        </MuiButton> */}
                        <Button type="submit"
                                text={`Save`}
                                variant="contained"
                                size="large"
                                color="primary"
                        />
                        <MuiButton onClick={onClose} color='default'>
                            Cancel
                        </MuiButton>
                    </DialogActions>
                </FormWrapper>
                <PhotoForm isOpen={showEditTimelineImage}
                            onClose={() => {
                            setShowEditTimelineImage(false);
                            }}
                            ownerType={OwnerType.TIMELINE}
                            customSubmit={setTimelineImage}/>
                {/* <PhotoForm item={timelineIcon}
                            isOpen={showEditTimelineIcon}
                            onClose={() => {
                            setShowEditTimelineIcon(false);
                            }}
                            ownerType={OwnerType.TIMELINE}/> */}
            </Dialog>
        </>
    )
}

export default TimelineDialog