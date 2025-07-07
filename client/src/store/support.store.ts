import { create } from 'zustand';
import type { SupportTicket } from '@/types/support.types';
import { 
  createSupportTicket, 
  getMyTickets,
  getTicketBySerialNumber,
  getAllSupportTickets, // ✅ NEW
} from '@/services/support.service';

interface SupportStore {
  tickets: SupportTicket[];
  allTickets: SupportTicket[]; // ✅ NEW
  ticket?: SupportTicket;
  loading: boolean;
  error: string | null;

  fetchTickets: () => Promise<void>;
  fetchAllTickets: () => Promise<void>; // ✅ NEW
  fetchTicketBySerialNumber: (serialNumber: number) => Promise<void>;
  submitTicket: (subject: string, message: string) => Promise<void>;
}

export const useSupportStore = create<SupportStore>((set) => ({
  tickets: [],
  allTickets: [], // ✅ NEW
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

  fetchAllTickets: async () => { // ✅ NEW
    try {
      set({ loading: true });
      const tickets = await getAllSupportTickets();
      console.log("Loaded all support tickets:", tickets);
      set({ allTickets: tickets, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch all tickets', loading: false });
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
        allTickets: [ticket, ...state.allTickets], // ✅ keep admin list updated too
        loading: false,
      }));
    } catch (err: any) {
      set({ error: err.message || 'Failed to submit ticket', loading: false });
    }
  },
}));
