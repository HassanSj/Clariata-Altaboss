import { Grid, ListItem, ListItemText, MenuItem, Select } from "@material-ui/core";
import { useEffect, useState } from "react";
import api from "~/services/api";
import { Permission } from "~/types/api/permission";
import { TeamMember } from "~/types/api/teamMember";
import { TeamMemberHousehold } from "~/types/api/teamMemberHousehold";
import DataWrapper from "../../Data/DataWrapper";
import FormWrapper from "../../Forms/FormWrapper";
import Input from "../../Forms/Input/Input";
import InputField from "../../Forms/InputField";
import styles from "../TeamMemberAccess/TeamMemberAccess.module.css";
import useNotifications from "~/ui/hooks/useNotifications";

interface IProps {
    item: TeamMember;
    householdId: number;
  }

const TeamMemberAccessItem = ({item, householdId}: IProps) => {

    const [permissions, setPermissions] = useState<Permission[]>([]);
    const notifications = useNotifications()

    const [teamMemberHousehold, setTeamMemberHousehold] = useState<TeamMemberHousehold>();

    const loadPermissions = async () => {
        const res = await api.permission.list();
        setPermissions(res.data);
        console.log("TeamMemberID" + item.TeamMemberID);
        console.log("HouseholdID: " + householdId);
        const resTeamMemberHousehold = await api.teamMemberHousehold.getTeamMemberHousehold(item.TeamMemberID, householdId);
        console.log("Team Household");
        console.log(resTeamMemberHousehold);
        setTeamMemberHousehold(resTeamMemberHousehold.data);

    }

    const changeAccess = async (e: any) =>
    {
        console.log(teamMemberHousehold);

        if(teamMemberHousehold?.TeamMemberHouseholdID != 0) {
            let teamMemberHouseholdUpdate = teamMemberHousehold as TeamMemberHousehold;
            teamMemberHouseholdUpdate.PermissionID = Number(e);
            console.log(e);
            if(Number(e) == 3)
            {
                
                await api.teamMemberHousehold.removeTeamMemberHousehold(Number(teamMemberHousehold?.TeamMemberHouseholdID));
                notifications.addSuccessNotification("Team Member Successfully Removed!")
                loadPermissions();                
            }
            else {
                const res = await api.teamMemberHousehold.updateTeamMemberHousehold(teamMemberHouseholdUpdate);
                notifications.addSuccessNotification("Team Member Permission Updated!");
            }
        }
        else
        {
            const teamMemberHouseholdUpdate = {
                TeamMemberHouseholdID: 0,
                TeamMemberID: item.TeamMemberID,
                HouseholdID: householdId,
                PermissionID: Number(e),
                HouseholdName: ""
            }

            const res = await api.teamMemberHousehold.createTeamMemberHousehold(teamMemberHouseholdUpdate);
            notifications.addSuccessNotification("Team Member Permission Added!");
        }
    }

    useEffect(() => {
        loadPermissions();
    }, [])

    return (
        <>
        <ListItem>
              <ListItemText>
                <Grid container spacing={1}>
                  <Grid item xs={3} className={styles.listAlignment}>
                    {item.FirstName}
                  </Grid>
                  <Grid item xs={3} className={styles.listAlignment}>
                    {item.LastName}
                  </Grid>
                  <Grid item xs={3} className={styles.listAlignment}>
                  {item.EmailAddress}
                  </Grid>
                  <Grid item xs={3} className={styles.listAlignment}>
                  <Select
                    fullWidth={true}
                    style={{height:"60px"}}
                    labelId="permission"
                    label="Permission"
                    value={String(teamMemberHousehold?.PermissionID)}
                    onChange={(e) => changeAccess(e.target.value)}
                    displayEmpty
                    MenuProps={{
                        anchorOrigin: {
                            vertical: "bottom",
                            horizontal: "left"
                        },
                        transformOrigin: {
                            vertical: "top",
                            horizontal: "left"
                        },
                        getContentAnchorEl: null
                    }}
                >
                    <MenuItem value={"1"}>Read-Only</MenuItem>
                    <MenuItem value={"2"}>Edit</MenuItem>
                    <MenuItem value={"3"}>None</MenuItem>
                </Select>
                    {/* <InputField type="select"
                            name="permission"
                            component={Input}
                            onChange={(e: any) => changeAccess(e.target.value)}
                            items={permissions.map(permission => ({label: permission.PermissionName, value: permission.PermissionID}))} /> */}
                    </Grid>
                </Grid>
              </ListItemText>
            </ListItem>
        </>
    )
}

export default TeamMemberAccessItem;