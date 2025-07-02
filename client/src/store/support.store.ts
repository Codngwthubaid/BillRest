import { create } from 'zustand';
import type { SupportTicket } from '@/types/support.types';
import { 
  createSupportTicket, 
  getMyTickets,
  getTicketBySerialNumber
} from '@/services/support.service';

interface SupportStore {
  tickets: SupportTicket[];
  ticket?: SupportTicket;
  loading: boolean;
  error: string | null;
  fetchTickets: () => Promise<void>;
  fetchTicketBySerialNumber: (serialNumber: number) => Promise<void>;
  submitTicket: (subject: string, message: string) => Promise<void>;
}

export const useSupportStore = create<SupportStore>((set) => ({
  tickets: [],
  ticket: undefined,
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

  fetchTicketBySerialNumber: async (serialNumber) => {
    try {
      set({ loading: true });
      const ticket = await getTicketBySerialNumber(serialNumber);
      set({ ticket, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch ticket', loading: false });
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
