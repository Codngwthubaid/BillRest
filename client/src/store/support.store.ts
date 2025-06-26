import { create } from 'zustand';
import type { SupportTicket } from '@/types/support.types';
import { createSupportTicket, getMyTickets } from '@/services/support.service';

interface SupportStore {
  tickets: SupportTicket[];
  loading: boolean;
  error: string | null;
  fetchTickets: () => Promise<void>;
  submitTicket: (subject: string, message: string) => Promise<void>;
}

export const useSupportStore = create<SupportStore>((set) => ({
  tickets: [],
  loading: false,
  error: null,

  fetchTickets: async () => {
    try {
      set({ loading: true });
      const tickets = await getMyTickets();
      set({ tickets, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch tickets', loading: false });
    }
  },

  submitTicket: async (subject, message) => {
    try {
      set({ loading: true });
      const { ticket } = await createSupportTicket({ subject, message });
      set((state) => ({
        tickets: [ticket, ...state.tickets],
        loading: false,
      }));
    } catch (err: any) {
      set({ error: err.message || 'Failed to submit ticket', loading: false });
    }
  },
}));
