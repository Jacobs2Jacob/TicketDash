import { axiosClient } from '@/shared/api/axiosClient';

export const authApi = {
     
    login: async () => {
        return await axiosClient.post('/auth/login');
    },
    getCurrentUser: async () => {
        return await axiosClient.get('/auth/me');
    }
}