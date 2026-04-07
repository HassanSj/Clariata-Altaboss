import {AxiosPromise} from 'axios';
import publicAxios from './publicAxios';
import privateAxios from './privateAxios';

interface IParams {
  [key: string]: any;
}

const publicRequest = (data: IParams): AxiosPromise<any> => publicAxios(data);
const privateRequest = (data: IParams): AxiosPromise<any> => privateAxios(data);

export default {
  public: publicRequest,
  private: privateRequest,
};
