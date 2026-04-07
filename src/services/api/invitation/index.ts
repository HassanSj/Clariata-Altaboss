import { AxiosPromise } from 'axios';
import request from '../request';
import { Invitation } from '~/types/api/invitation';

/**
 * Get all Invitations.
 */
 export const getInvitations = (): AxiosPromise<unknown> =>
 request.private({
   method: 'get',
   url: `invitations`,
 });

 /**
 * Get Invitation.
 */
  export const getInvitation = (id: number): AxiosPromise<unknown> =>
  request.private({
    method: 'get',
    url: `invitation?id=${id}`,
  });

  /**
 * Get Invitation By Code.
 */
   export const getInvitationByCode = (code: string): AxiosPromise<unknown> =>
   request.public({
     method: 'get',
     url: `invitation/${code}`,
   });

   /**
 * Get Invitations By Firm.
 */
    export const getInvitationsByFirm = (firmId: number): AxiosPromise<Invitation[]> =>
    request.private({
      method: 'get',
      url: `invitation/firm/${firmId}`,
    });

   /**
 * Get Invitations By Team.
 */
    export const getInvitationsByTeam = (teamId?: number): AxiosPromise<unknown> =>
    request.private({
      method: 'get',
      url: `invitation/team/${teamId}`,
    });


 /**
 * Send an Invitation.
 */
  export const sendInvitation = (data: Invitation): AxiosPromise<unknown> =>
  request.private({
    method: 'post',
    url: `invitation`,
    data
  });


   /**
 * Delete an Invitation.
 */
    export const deleteInvitation = (id: number): AxiosPromise<unknown> =>
    request.private({
      method: 'delete',
      url: `invitation?intInvitationId=${id}`
    });