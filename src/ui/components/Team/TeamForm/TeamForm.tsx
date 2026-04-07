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

interface IProps {
    item?: TeamMember;
    isOpen: boolean;
    onClose: () => unknown;
}

const TeamMemberForm = ({ item, isOpen, onClose }: IProps) => {

    const [firmUsers, setFirmUsers] = useState<User[]>([]);
    const { user } = useStoreState(state => state.user)

    const loadData = async () => {
        const res2 = await api.firm.getFirmUsers(user.FirmID as number);

        setFirmUsers(res2.data.filter(x => x.UserID != user.UserID).filter(x => x.UserTypeID == "3"));
    }

    const CreateTeamMember = async (teamMember: TeamMember) => {
        console.log(teamMember);
        if(teamMember) { 
            let addedTeamMember: TeamMember = {
                TeamID: user.UserID as number,
                UserID: teamMember.UserID,
                TeamMemberID: 0,
                FirstName: '',
                LastName: '',
                EmailAddress: ''
            }
            const res = await api.teamMember.createTeamMember(addedTeamMember);
            onClose();
        }
      }

    useEffect(() => {
        loadData();
        console.log(user.UserID);
    }, [])


    return (

        <Modal title="Add Team Member" isOpen={isOpen} handleClose={onClose} width="md" hideFooter={true} >
            <FormWrapper onSubmit={CreateTeamMember} initialValues={item ? item : initialValues}> 
                    <Grid container spacing={1}>
                        <Grid xs={6}>
                        <InputField type="select" 
                        name="UserID"
                        component={Input}
                        items={firmUsers.filter((x) => x.UserID != user.UserID).map(user => ({label: user.FirstName + " " + user.LastName, value: user.UserID}))} />
                        </Grid>
                    </Grid> 
                    <DialogActions>
                    <Button
                        type="submit"
                        text="Add Team Member"
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

export default TeamMemberForm;