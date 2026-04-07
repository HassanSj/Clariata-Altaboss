import { Household } from "~/types/api/household";
import { Chip, ListItem, ListItemAvatar, ListItemText } from "@material-ui/core";
import classnames from "classnames";
import styles from "~/ui/components/Household/SelectHousehold/SelectHousehold.module.scss";
import Avatar from "@material-ui/core/Avatar";
import { getFullName, getPhotoSrc } from "~/ui/constants/user";
import { Person } from "~/types/api/person";
import React, { useEffect, useState } from "react";
import { useStoreActions, useStoreState } from "~/store/hooks";
import EditHousehold from "~/ui/components/Household/EditHousehold";
import { useRouter } from "next/router";
import useMountEvents from "~/ui/hooks/useMountEvents";
import { IDataItemEventConfig } from "~/types/data";
import Button from "~/ui/components/Button";
import paths from "~/ui/constants/paths";
import SharingModal from "~/ui/components/Sharing/SharingModal";
import ModuleBadge from "../../ModuleBadge";
import { InterviewFull } from "~/types/api/interviewFull";
import { toPercentage } from "~/ui/constants/utils";
import api from "~/services/api";
import familydefault from '../../../../../public/images/placeholders/family_default.png';
import { InterviewProgress } from "~/types/api/interviewProgress";
import { getAccessToken } from "~/services/auth";
import useSWR from "swr";
import { fetcher } from "~/types/api/fetcher";
import { PersonType } from "~/ui/constants/api";
import TeamMemberAccess from "../../Team/TeamMemberAccess/TeamMemberAccess";

interface IProps {
  household: Household;
  eventConfig?: IDataItemEventConfig;
}
const SelectHouseholdItem = ({ household, eventConfig }: IProps) => {
  const router = useRouter();

  const { CONTACTS} = paths;

  const { householdId } = useStoreState((state) => state.selected);
  const { onSelectContact } = useStoreActions((action) => action.selected);
  const token = getAccessToken();
  const url = `${process.env.NEXT_PUBLIC_API_URL}/household/${household.HouseholdID}/person/list`;
  const { data: persons} = useSWR<Person[]>([url, token], fetcher);

  const spouses = persons?.filter((person: Person) => ([PersonType.PRIMARY] || [PersonType.HOUSEHOLD])
              .some((type) => type === person.PersonTypeID));

  //const urlHousehold = `${process.env.NEXT_PUBLIC_API_URL}/household/${household.HouseholdID}`;
  //const {data: selectedHousehold} = useSWR<Household>([urlHousehold, token], fetcher);
  
  //const { selectedHousehold } = useStoreState((state) => state.household);
  const [isSelected, setIsSelected] = React.useState<boolean>(false);
  const [editHousehold, setEditHousehold] = React.useState<Household | undefined>();
  const [showEditHouseholdDialog, setShowEditHouseholdDialog] = React.useState(false);
  const [showEditPermissionDialog, setShowEditPermissionDialog] = React.useState(false);
  const { onPopulatePermissions } = useStoreActions(actions => actions.user);
  //const { households } = useStoreState((state) => state.household);
  const { onSelect } = useStoreActions(actions => actions.household);
  const { populatePermissions } = useStoreActions(actions => actions.user);
  const { user } = useStoreState((state) => state.user);
  // list of all interviews from this household
  const [householdInterviews, setHouseholdInterviews] = React.useState<InterviewProgress[]>();
  // const [sharedHousehold, setsharedHousehold] = useState<any>();
  const [hideButtons, sethideButtons] = useState<Boolean>(false);
  const [editOnly, seteditOnly] = useState<Boolean>(false);

  //for testing purpose
  let sharedHousehold: any = [];

  let currentUserID = user?.UserID;


  const checkShareType = () => {
    try {

      const convertParts = (data: any) => {

        let str = data.HouseholdName.split(' - ');
        let str2 = str[0].split('(');
        let obj = {
          sharedDetails: {
            shareType: str2[1],
          },
          currentUserID: currentUserID,
          sharedUserID: data?.CreatedBy
        }
        return obj
      }
      // households.map((data: any) => {
      //   (data.CreatedBy != currentUserID) ? sharedHousehold.push(convertParts(data)) : null;
      // })
      (household.CreatedBy != currentUserID) ? sharedHousehold.push(convertParts(household)) : null;
      if (sharedHousehold.length) {
        if (household.CreatedBy == sharedHousehold[0].sharedUserID) {
          if (sharedHousehold[0].sharedDetails.shareType == "Read-only") {
            sethideButtons(true);
          } else if (sharedHousehold[0].sharedDetails.shareType == "Edit") {
            seteditOnly(true);
          }
        }
      }

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    checkShareType();
    setIsSelected(householdId === household.HouseholdID);
  }, [])

  const handleSelectHousehold = async () => {
    await onSelect({ household, router });
    if (eventConfig?.onSelect) {
      eventConfig.onSelect(household.HouseholdID);
    }
    await router.push(paths.DASHBOARD);
  }

  const handleSelectHouseHoldWithoutRouterChange = async () => {
    await onSelect({ household, router });
    if (eventConfig?.onSelect) {
      eventConfig.onSelect(household.HouseholdID);
    }
  }

  const handleEdit = () => {
    setEditHousehold(household);
    setShowEditHouseholdDialog(true);
    try {
      if (sharedHousehold.length) {
        if (household.CreatedBy == sharedHousehold[0].sharedUserID) {
          if (sharedHousehold[0].sharedDetails.shareType == "Edit") {
            seteditOnly(true)
          }
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleSharing = async () => {
    await handleSelectHouseHoldWithoutRouterChange();
    setShowEditPermissionDialog(true)
  }

  const handleDirection = async () => {
    await handleSelectHouseHoldWithoutRouterChange();
    await router.push(paths.DIRECTION_PRIORITIES);
  }

  const handleContacts = async () => {
    if (householdId !== household.HouseholdID)
      await handleSelectHousehold();
    await router.push({ pathname: paths.PROFILE });
  }

  const handleDashboard = async () => {
    await handleSelectHousehold();
    await router.push(paths.DASHBOARD);
  }

  const handleContact = async (person: Person) => {
    await handleSelectHousehold();
    onSelectContact(person?.PersonID)
    await router.push(CONTACTS);
  }

  const handleBadge = async (id: number) => {
    await handleSelectHousehold();
    await router.push(`${paths.INTERVIEW}/${id}?showGrid=true`);
  }


  useMountEvents({
    onMounted: async () => {
      setIsSelected(householdId === household.HouseholdID);
      await getInterviewProgress();
      //onPopulatePermissions(null);
    },
    onChange: async () => {
      setIsSelected(householdId === household.HouseholdID);
      await getInterviewProgress();
      //onPopulatePermissions(null);
    },
    watchItems: [household]
  });

  const getInterviewProgress = async () => {
    const progresses = await api.interviewprogress.getFull(Number(household?.HouseholdID));
    progresses?.data?.sort((a, b) => b?.Interview?.InterviewTemplateID! - a?.Interview?.InterviewTemplateID!);
    setHouseholdInterviews(progresses?.data);
  }


  return (
    <>
      {hideButtons || editOnly ?
        <ListItem divider
          key={household?.HouseholdID}
          selected={isSelected}
          className={classnames({ [styles.selected]: isSelected }, styles.household)}>
          <ListItemAvatar className={classnames(styles.relationship_avatar)}>
            <div onClick={handleDashboard}>
              <Avatar className={classnames(styles.avatar)} alt={household?.HouseholdName} src={household?.PhotoURL ? household?.PhotoURL : familydefault} />
            </div>
          </ListItemAvatar>
          <ListItemText className={classnames(styles.household_name)}
            classes={{ primary: classnames(styles.dashboard_family_title) }}
            onClick={() => handleSelectHousehold()}
            primary={household.HouseholdName}
            secondary={
              <span className={styles.persons}>
                {spouses ? spouses.map((person: Person, personIndex: number) => {
                  return (
                    <Chip
                      className={classnames(styles.household_person)}
                      label={getFullName(person)}
                      variant="outlined"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleContact(person).then();
                      }}
                    />
                  )
                }) : null}
              </span>
            } />
          <div className={classnames(styles.module_badges)}>
            {householdInterviews?.map((interviewProgress: InterviewProgress) => {
              return (
                <ModuleBadge
                  moduleName={Number(interviewProgress.Interview?.InterviewTemplateID)}
                  percentage={toPercentage(interviewProgress.TotalInterviewQuestionsAnswered, interviewProgress?.TotalInterviewQuestionCount)}
                  onClick={() => handleBadge(Number(interviewProgress?.Interview?.InterviewID))}
                  selected={isSelected} />
              )
            })}

            {/* Direction Module Progress */}
            {/* {household?.DirectionProgress?.filter(directionTask => directionTask?.Completed)?.length ? */}
            <ModuleBadge
              moduleName={3}
              direction={true}
              percentage={toPercentage(household?.DirectionProgress?.filter(directionTask => directionTask?.Completed)?.length, household?.DirectionProgress?.length)}
              onClick={() => handleDirection()}
              selected={isSelected} />
          </div>

          <div className={classnames(styles.right_actions)} style={{minWidth: "200px"}}>
            <div className={classnames(styles.top)}>
              {household.AccessType == 0 ?
                <>
                  <Button
                    type="button"
                    text={`Team Access`}
                    variant="contained"
                    size="large"
                    color="info"
                    onClick={handleSharing}
                    disableElevation={true}
                  />
                </>
                :
                null
              }
            </div>
            <div className={classnames(styles.bottom)}>
              <Button
                type="button"
                text={`Details`}
                variant="outlined"
                size="large"
                color="info"
                onClick={handleContacts}
                disableElevation={true}
                className={styles.familyDetailsButton}
              />
              {household.AccessType != 1 ?
                <>
                  <Button
                    type="button"
                    text={`Edit`}
                    variant="contained"
                    size="large"
                    color="info"
                    onClick={handleEdit}
                    disableElevation={true}
                  />
                </>
                :
                null
              }
            </div>
          </div>
        </ListItem> :
        <ListItem divider
          key={household?.HouseholdID}
          selected={isSelected}
          className={classnames({ [styles.selected]: isSelected }, styles.household)}>
          <ListItemAvatar className={classnames(styles.relationship_avatar)}>
            <div onClick={handleDashboard}>
              <Avatar className={classnames(styles.avatar)} alt={household?.HouseholdName} src={household?.PhotoURL ? household?.PhotoURL : familydefault} />
            </div>
          </ListItemAvatar>
          <ListItemText className={classnames(styles.household_name)}
            classes={{ primary: classnames(styles.dashboard_family_title) }}
            onClick={() => handleSelectHousehold()}
            primary={household.HouseholdName}
            secondary={
              <span className={styles.persons}>
                {spouses ? spouses.map((person: Person, personIndex: number) => {
                  return (
                    <Chip
                      className={classnames(styles.household_person)}
                      label={getFullName(person)}
                      variant="outlined"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleContact(person).then();
                      }}
                    />
                  )
                }) : null}
              </span>
            } />
          <div className={classnames(styles.module_badges)}>
            {/* {householdInterviews?.map((interviewProgress: InterviewProgress) => {
              return (
                <ModuleBadge
                  moduleName={Number(interviewProgress.Interview?.InterviewTemplateID)}
                  percentage={toPercentage(interviewProgress.TotalInterviewQuestionsAnswered, interviewProgress?.TotalInterviewQuestionCount)}
                  onClick={() => handleBadge(Number(interviewProgress?.Interview?.InterviewID))}
                  selected={isSelected} />
              )
            })} */}

            {/* Direction Module Progress */}
            {/* {household?.DirectionProgress?.filter(directionTask => directionTask?.Completed)?.length ? */}
            {/* <ModuleBadge
              moduleName={3}
              direction={true}
              percentage={toPercentage(household?.DirectionProgress?.filter(directionTask => directionTask?.Completed)?.length, household?.DirectionProgress?.length)}
              onClick={() => handleDirection()}
              selected={isSelected} /> */}
          </div>

          <div className={classnames(styles.right_actions)} style={{minWidth: "200px"}}>
          <div className={classnames(styles.top)}>
              {household.AccessType == 0 ?
                <>
                  <Button
                    type="button"
                    text={`Team Access`}
                    variant="contained"
                    size="large"
                    color="info"
                    onClick={handleSharing}
                    disableElevation={true}
                  />
                </>
                :
                null
              }
            </div>
            <div className={classnames(styles.bottom)}>
              <Button
                type="button"
                text={`Details`}
                variant="outlined"
                size="large"
                color="info"
                onClick={handleContacts}
                disableElevation={true}
                className={styles.familyDetailsButton}
              />
              {household.AccessType != 1 ?
                <>
                  <Button
                    type="button"
                    text={`Edit`}
                    variant="contained"
                    size="large"
                    color="info"
                    onClick={handleEdit}
                    disableElevation={true}
                  />
                </>
                :
                null
              }
            </div>
          </div>
        </ListItem>
      }

      <TeamMemberAccess isOpen={showEditPermissionDialog} householdId={household.HouseholdID}
        onClose={() => setShowEditPermissionDialog(false)} />
      <EditHousehold PermissionEdit={editOnly} household={editHousehold}
        isOpen={showEditHouseholdDialog}
        onClose={() => setShowEditHouseholdDialog(false)} />
    </>
  )
}

export default SelectHouseholdItem;
