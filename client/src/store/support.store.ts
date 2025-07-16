import { create } from 'zustand';
import type { SupportTicket } from '@/types/support.types';
import { useAuthStore } from './auth.store';

import {
  createSupportTicketForGeneral,
  getMyTicketsForGeneral,
  getTicketBySerialNumberForGeneral,
  getAllSupportTicketsForGeneral,
  updateTicketStatusForGeneral,

  createSupportTicketForHealth,
  getMyTicketsForHealth,
  getTicketBySerialNumberForHealth,
  getAllSupportTicketsForHealth,
  updateTicketStatusForHealth,
} from '@/services/support.service';

interface SupportStore {
  tickets: SupportTicket[];
  allTickets: SupportTicket[];
  ticket?: SupportTicket;
  loading: boolean;
  error: string | null;

  fetchTickets: () => Promise<void>;
  fetchAllTickets: () => Promise<void>;
  fetchTicketBySerialNumber: (serialNumber: number) => Promise<void>;
  submitTicket: (subject: string, message: string) => Promise<void>;
  updateTicketStatus: (id: string, status: string) => Promise<void>;
}

export const useSupportStore = create<SupportStore>((set) => ({
  tickets: [],
  allTickets: [],
  ticket: undefined,
  loading: false,
  error: null,

  fetchTickets: async () => {
    try {
      set({ loading: true });
      const user = useAuthStore.getState().user;
      const tickets = user?.role === 'clinic'
        ? await getMyTicketsForHealth()
        : await getMyTicketsForGeneral();
      set({ tickets, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch tickets', loading: false });
    }
  },

  fetchAllTickets: async () => {
    try {
      set({ loading: true });
      const user = useAuthStore.getState().user;
      const tickets = user?.role === 'clinic'
        ? await getAllSupportTicketsForHealth()
        : await getAllSupportTicketsForGeneral();
      set({ allTickets: tickets, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch all tickets', loading: false });
    }
  },

  fetchTicketBySerialNumber: async (serialNumber) => {
    try {
      set({ loading: true });
      const user = useAuthStore.getState().user;
      const ticket = user?.role === 'clinic'
        ? await getTicketBySerialNumberForHealth(serialNumber)
        : await getTicketBySerialNumberForGeneral(serialNumber);
      set({ ticket, loading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch ticket', loading: false });
    }
  },

  submitTicket: async (subject, message) => {
    try {
      set({ loading: true });
      const user = useAuthStore.getState().user;
      const { ticket } = user?.role === 'clinic'
        ? await createSupportTicketForHealth({ subject, message })
        : await createSupportTicketForGeneral({ subject, message });
      set((state) => ({
        tickets: [ticket, ...state.tickets],
        allTickets: [ticket, ...state.allTickets],
        loading: false,
      }));
    } catch (err: any) {
      set({ error: err.message || 'Failed to submit ticket', loading: false });
    }
  },

  updateTicketStatus: async (id, status) => {
    try {
      set({ loading: true });
      const user = useAuthStore.getState().user;
      const { ticket } = user?.role === 'clinic'
        ? await updateTicketStatusForHealth(id, status)
        : await updateTicketStatusForGeneral(id, status);

      set((state) => ({
        tickets: state.tickets.map(t => t._id === ticket._id ? ticket : t),
        allTickets: state.allTickets.map(t => t._id === ticket._id ? ticket : t),
        loading: false,
      }));
    } catch (err: any) {
      set({ error: err.message || 'Failed to update ticket status', loading: false });
    }
  },
}));
