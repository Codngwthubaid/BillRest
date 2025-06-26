
import { create } from 'zustand';
import type { SyncInvoice, SyncProduct } from '@/types/sync.types';
import { getSyncProducts, syncInvoices } from '@/services/sync.service';

interface SyncStore {
    products: SyncProduct[];
    isLoading: boolean;
    syncError: string | null;
    fetchProducts: () => Promise<void>;
    syncOfflineInvoices: (invoices: SyncInvoice[]) => Promise<void>;
}

export const useSyncStore = create<SyncStore>((set) => ({
    products: [],
    isLoading: false,
    syncError: null,

    fetchProducts: async () => {
        set({ isLoading: true, syncError: null });
        try {
            const products = await getSyncProducts();
            set({ products });
        } catch (error: any) {
            set({ syncError: error?.response?.data?.message || 'Failed to fetch products' });
        } finally {
            set({ isLoading: false });
        }
    },

    syncOfflineInvoices: async (invoices: SyncInvoice[]) => {
        set({ isLoading: true, syncError: null });
        try {
            await syncInvoices(invoices);
        } catch (error: any) {
            set({ syncError: error?.response?.data?.message || 'Failed to sync invoices' });
        } finally {
            set({ isLoading: false });
        }
    },
}));
