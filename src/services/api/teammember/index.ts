import { AxiosPromise } from 'axios';
import { TeamMember } from '~/types/api/teamMember';
import { User } from '~/types/api/user';
import request from '../request';

/**
 * Get TeamMembers
 */
export const getTeamMembers = (teamId: number): AxiosPromise<TeamMember[]> =>
    request.private({
        method: 'get',
        url: `TeamMembers?TeamID=${teamId}`,
    });

/**
 * Get TeamMember
 */
 export const getTeamMember = (teamMemberId: number): AxiosPromise<User> =>
 request.private({
     method: 'get',
     url: `TeamMember/${teamMemberId}`,
 });

/**
 * Create TeamMember
 */
 export const createTeamMember = (teamMember: TeamMember): AxiosPromise<TeamMember[]> =>
 request.private({
     method: 'post',
     url: `TeamMember`,
     data: teamMember
 });