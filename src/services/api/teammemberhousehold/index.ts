import { AxiosPromise } from 'axios';
import { TeamMemberHousehold } from '../../../types/api/teamMemberHousehold';
import request from '../request';

/**
 * Get Team Member Households
 */
export const getTeamMemberHouseholds = (teamMemberId: number): AxiosPromise<TeamMemberHousehold[]> =>
    request.private({
        method: 'get',
        url: `TeamMemberHouseholds?TeamMemberID=${teamMemberId}`,
    });

/**
 * Get Team Member Household
 */
 export const getTeamMemberHousehold = (teamMemberId: number, householdId: number): AxiosPromise<TeamMemberHousehold> =>
 request.private({
     method: 'get',
     url: `TeamMemberHousehold?teammemberid=${teamMemberId}&householdid=${householdId}`,
 });

/**
 * Create Team Member Household
 */
 export const createTeamMemberHousehold = (teamMemberHousehold: TeamMemberHousehold): AxiosPromise<TeamMemberHousehold[]> =>
 request.private({
     method: 'post',
     url: `TeamMemberHousehold`,
     data: teamMemberHousehold
 });

 /**
 * Remove Team Member
 */
  export const removeTeamMemberHousehold = (teamMemberHouseholdId: number): AxiosPromise<unknown> =>
  request.private({
      method: 'delete',
      url: `TeamMemberHousehold?id=${teamMemberHouseholdId}`,
  });

  /**
 * Update Team Member Household
 */
 export const updateTeamMemberHousehold = (teamMemberHousehold: TeamMemberHousehold): AxiosPromise<unknown> =>
 request.private({
     method: 'put',
     url: `TeamMemberHousehold?TeamMemberHouseholdID=${teamMemberHousehold.TeamMemberHouseholdID}`,
     data: teamMemberHousehold
 });