import { AxiosPromise } from 'axios';
import request from '../request';
import { User } from '~/types/api/user';

/**
 * Get the current user.
 */
export const get = (): AxiosPromise<unknown> =>
  request.private({
    method: 'get',
    url: `user`,
  });

  /**
 * Get the user.
 */
export const getUser = (id: string): AxiosPromise<User> =>
request.private({
  method: 'get',
  url: `user/${id}`,
});

/**
 * Get a household user.
 * @param id
 * @param householdId
 */
export const getHouseholdUser = (id: string | number, householdId: string | number): AxiosPromise<User> =>
  request.private({
    method: 'get',
    url: `household/${householdId}/user/${id}`,
  });

/**
 * Create/register a user.
 * @param data
 */
export const create = (data: IRegisterRequest): AxiosPromise<unknown> =>
  request.public({
    method: 'post',
    url: `user`,
    data,
  });

/**
 * Update the user.
 * @param id
 * @param data
 */
export const update = (id: string | number, data: User): AxiosPromise<unknown> =>
  request.private({
    method: 'put',
    url: `user/${id}`,
    data,
  });

/**
 * List all users.
 * @param householdId
 */
export const list = (householdId: string | number): AxiosPromise<unknown> =>
  request.private({
    method: 'get',
    url: `household/${householdId}/user/list`,
  });

/**
 * Get all users.
 */
export const getUsers = (): AxiosPromise<unknown> =>
  request.private({
    method: 'get',
    url: `users`,
  });

/**
 * Get users by firm.
 */
 export const getUsersByFirm = (firmId: number ): AxiosPromise<unknown> =>
 request.private({
   method: 'get',
   url: `firm/${firmId}/user/list`,
 });

/**
 * Inactivate the user.
 */
export const inactiavteUser = (userId: number): AxiosPromise<unknown> =>
  request.private({
    method: 'post',
    url: `user/inactivate?id=${userId}`,
  });

/**
 * Change User Type
 */
export const changeUserType = (data:any): AxiosPromise<unknown> =>
  request.private({
    method: 'post',
    url: `user/changetype`,
    data
  });

/**
 * Login the user.
 * @param data
 */
export const login = (data: ILoginRequest): AxiosPromise<unknown> => {
  const token = Buffer.from(`${data.Username}:${data.Password}`, 'utf8').toString('base64');
  return request.public({
    method: 'post',
    url: `session`,
    headers: {
      Authorization: `Basic ${token}`,
    },
  });
};

/**
 * 
 * @param data
 * @param UserID
 * @returns
 */
export const token = (data: ILoginRequest, UserID: number): AxiosPromise<unknown> => {
  const token = Buffer.from(`${data.Username}:${data.Password}`, 'utf8').toString('base64');
  return request.public({
    method: 'post',
    url: `token`,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    data: UserID
  });
};

/**
 * Check a session token is still valid.
 * @param token
 */
export const checkAuthByToken = (token: string): AxiosPromise<unknown> =>
  request.public({
    method: 'get',
    url: `session`,
    headers: {
      Authorization: `${token}`,
      Accept: 'application/json',
    },
  });

/**
 * Resend a user's verification token.
 * @param username
 */
export const resendVerification = (username: string): AxiosPromise<unknown> =>
  request.public({
    method: 'post',
    url: `verificationtoken`,
    data: {
      EmailAddress: username,
    },
  });

/**
 * Verify a user.
 * @param username
 */
export const verify = (code: string): AxiosPromise<unknown> =>
  request.public({
    method: 'get',
    url: `verifyemailaddress?verificationCode=${code}`,
  });

/**
 * Generates password token and sends email on BE.
 * @param username
 */
export const sendPasswordResetEmail = (username: string): AxiosPromise<unknown> =>
  request.public({
    method: 'post',
    url: `passwordresettoken`,
    data: {
      EmailAddress: username,
    },
  });

/**
 * Validate a given password token.
 * @param token
 */
export const validatePasswordToken = (token: string): AxiosPromise<unknown> =>
  request.public({
    method: 'get',
    url: `passwordresettoken?token=${token}`,
  });

/**
 * Reset user's password using password token and new password.
 * @param token
 * @param newPassword
 */
export const resetPasswordWithToken = (token: string, newPassword: string): AxiosPromise<unknown> =>
  request.public({
    method: 'post',
    url: `resetpasswordwithtoken`,
    data: {
      Token: token,
      NewPassword: newPassword,
    },
  });

/**
 * Get individual user setting.
 * @param name
 */
export const getSetting = (name: string): AxiosPromise<unknown> =>
  request.private({
    method: 'get',
    url: `setting/user/${name}`,
  });

/**
 * Create/update a user setting.
 * @param name
 * @param value
 */
export const updateSetting = (name: string, value: string): AxiosPromise<unknown> =>
  request.private({
    method: 'put',
    url: `setting/user/${name}`,
    data: {
      SettingName: name,
      SettingValue: value,
    },
  });

/**
 * List all user settings.
 */
export const listSettings = (): AxiosPromise<unknown> =>
  request.private({
    method: 'get',
    url: `setting/list`,
  });


/**
 * Change user's password using current password and new password.
 * @param userID
 * @param newPassword
 * @param currentPassword
 */
 export const changePasswordApi = ( userID: number | undefined, currentPassword :string ,newPassword: string  ): AxiosPromise<unknown> =>
 request.public({
   method: 'post',
   url: `changepassword`,
   data: {
    userID: `${userID}`,
    NewPassword: newPassword,
    CurrentPassword: currentPassword
   },
 });