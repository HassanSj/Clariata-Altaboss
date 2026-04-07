import React, {ReactElement, useEffect, useState} from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select } from "@material-ui/core";
import Button from "~/ui/components/Button";
import Modal from "~/ui/components/Dialogs/Modal";
import FormWrapper from "~/ui/components/Forms/FormWrapper";
import Input from "~/ui/components/Forms/Input";
import InputField from "~/ui/components/Forms/InputField";
import api from '~/services/api';
import initialValues from './form/initialValues';
import { TeamMember } from '~/types/api/teamMember';
import { User } from '~/types/api/user';
import { useStoreState } from '~/store/hooks';
import { Household } from '~/types/api/household';
import { TeamMemberHousehold } from '~/types/api/teamMemberHousehold';
import {Permission} from '~/types/api/permission';

interface IProps {
    teamMemberId: number;
    isOpen: boolean;
    onClose: () => unknown;
}

const TeamHouseholdForm = ({ teamMemberId, isOpen, onClose }: IProps) => {

    const [households, setHouseholds] = useState<Household[]>([]);
    const { user } = useStoreState(state => state.user)
    const [permissions, setPermissions] = useState<Permission[]>([]);

    const loadData = async () => {
        const res2 = await api.household.list();
        setHouseholds(res2.data as Household[]);
    }

    const loadPermissions = async () => {
        const res = await api.permission.list();
        setPermissions(res.data);
    }

    const AddTeamHousehold = async (teamHousehold: TeamMemberHousehold) => {
        console.log("Team Member Household");
        console.log(teamHousehold);
        teamHousehold.TeamMemberID = teamMemberId;
        const res = await api.teamMemberHousehold.createTeamMemberHousehold(teamHousehold);
        onClose();
      }

    useEffect(() => {
        loadData();
        loadPermissions();
        console.log(households);
    }, [])


    return (

        <Modal title="Add Household" isOpen={isOpen} handleClose={onClose} width="md" hideFooter={true} >
            <FormWrapper onSubmit={AddTeamHousehold} initialValues={initialValues}> 
                    <Grid container spacing={1}>
                        <Grid xs={6}>
                            <InputField type="select" 
                            name="HouseholdID"
                            component={Input}
                            items={households.map(household => ({label: household.HouseholdName, value: household.HouseholdID}))} />
                        </Grid>
                        <Grid xs={6}>
                            <InputField type="select" 
                            name="PermissionID"
                            component={Input}
                            items={permissions.map(permission => ({label: permission.PermissionName, value: permission.PermissionID}))} />
                        </Grid>
                    </Grid> 
                    <DialogActions>
                    <Button
                        type="submit"
                        text="Add Household"
                        variant="contained"
                        size="large"
                        color="primary"
                    />
                    <Button type="button" text="Cancel" size="large" variant="contained" color="secondary" onClick={onClose} />
                </DialogActions>   
                </FormWrapper>             
        </Modal>
    )
}

export default TeamHouseholdForm;