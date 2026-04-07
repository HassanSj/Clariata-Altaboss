import React, { useEffect, useState } from 'react'
import api from '~/services/api';
import { TeamMember } from '~/types/api/teamMember';
import { Grid, ListItem, ListItemText, TextField, Button, Modal, Dialog, DialogContent, DialogTitle, Card, CardHeader, CardContent } from '@material-ui/core';
import { useStoreState } from '~/store/hooks';
import { User } from '~/types/api/user';
import TeamMemberForm from './TeamForm/TeamForm';
import TeamMemberList from './TeamMemberList/TeamMemberList';
import TeamInvitationList from './TeamInvitationList/TeamInvitationList';

interface ITeamProps {
    teamId: number;
}

const Team = () => {

    return (
        <>
            <div style={{margin: "10px"}}>
                <TeamMemberList />
                <TeamInvitationList />
            </div>
        </>
    )
}

export default Team;