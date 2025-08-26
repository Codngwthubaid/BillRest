import { axiosInstance } from '@/lib/axiosInstance';
import type { Patient } from '@/types/patient.types';
import type { Bed, AddBedPayload, UpdateBedPayload } from '@/types/bed.types';

export const bedService = {
    getAll: async (): Promise<Bed[]> => {
        const response = await axiosInstance.get('/bed');
        return response.data;
    },

    getById: async (id: string): Promise<Bed> => {
        const response = await axiosInstance.get(`/bed/${id}`);
        return response.data;
    },

    create: async (payload: AddBedPayload): Promise<Bed> => {
        const response = await axiosInstance.post('/bed/add', payload);
        return response.data;
    },

    update: async (id: string, payload: UpdateBedPayload): Promise<Bed> => {
        const response = await axiosInstance.put(`/bed/update/${id}`, payload);
        return response.data;
    },

    delete: async (id: string): Promise<{ message: string }> => {
        const response = await axiosInstance.delete(`/bed/delete/${id}`);
        return response.data;
    },

    getAllPatients: async (): Promise<Patient[]> => {
        const response = await axiosInstance.get('/bed/patients/all');
        return response.data;
    }
};
