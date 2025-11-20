import { axiosClient } from './axiosClient';

export const authApi = {
     
     login: async () => {
         return await axiosClient.post('/login');
    }
}