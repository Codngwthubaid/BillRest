import { create } from 'zustand';
import { bedService } from '@/services/bed.service';
import type { Bed, AddBedPayload, UpdateBedPayload } from '@/types/bed.types';

interface BedStore {
    beds: Bed[];
    loading: boolean;
    error: string | null;

    fetchBeds: () => Promise<void>;
    addBed: (data: AddBedPayload) => Promise<void>;
    updateBed: (id: string, data: UpdateBedPayload) => Promise<void>;
    deleteBed: (id: string) => Promise<void>;
}

export const useBedStore = create<BedStore>((set, get) => ({
    beds: [],
    loading: false,
    error: null,

    fetchBeds: async () => {
        set({ loading: true, error: null });
        try {
            const data = await bedService.getAll();
            set({ beds: data });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to fetch beds' });
        } finally {
            set({ loading: false });
        }
    },

    addBed: async (data) => {
        set({ loading: true, error: null });
        try {
            const newBed = await bedService.create(data);
            set({ beds: [...get().beds, newBed] });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to add bed' });
        } finally {
            set({ loading: false });
        }
    },

    updateBed: async (id, data) => {
        set({ loading: true, error: null });
        try {
            await bedService.update(id, data);
            const beds = await bedService.getAll(); // ✅ Fetch latest data
            set({ beds });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to update bed' });
        } finally {
            set({ loading: false });
        }
    },


    deleteBed: async (id) => {
        set({ loading: true, error: null });
        try {
            await bedService.delete(id);
            set({ beds: get().beds.filter((bed) => bed._id !== id) });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Failed to delete bed' });
        } finally {
            set({ loading: false });
        }
    },
}));
