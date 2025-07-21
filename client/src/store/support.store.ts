import { create } from 'zustand';
import type { SupportTicket } from '@/types/support.types';
import { useAuthStore } from './auth.store';

import {
  createSupportTicketForGeneral,
  getMyTicketsForGeneral,
  getTicketBySerialNumberForGeneral,
  getAllSupportTicketsForGeneral,
  updateTicketStatusForGeneral,
  sendMsgToAdmin,
  getAllMessagesSendToAdmin,

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
  messages: { senderRole: string; message: string; timestamp?: string }[];

  fetchTickets: () => Promise<void>;
  fetchAllTickets: () => Promise<void>;
  fetchTicketBySerialNumber: (serialNumber: number) => Promise<void>;
  submitTicket: (subject: string, message: string) => Promise<void>;

  updateGeneralTicketStatus: (id: string, status: string) => Promise<void>;
  updateHealthTicketStatus: (id: string, status: string) => Promise<void>;
  fetchMessagesForTicket: (ticketId: string, ticketType: string) => Promise<void>;
  sendMessageToAdmin: (data: {
    ticketId: string;
    message: string;
    ticketType: string;
  }) => Promise<void>;

}

export const useSupportStore = create<SupportStore>((set) => ({
  tickets: [],
  messages: [],
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

      const [generalTickets, healthTickets] = await Promise.all([
        getAllSupportTicketsForGeneral(),
        getAllSupportTicketsForHealth()
      ]);

      const combinedTickets = [...generalTickets, ...healthTickets];
      set({ allTickets: combinedTickets, loading: false });
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

  updateGeneralTicketStatus: async (id, status) => {
    try {
      set({ loading: true });
      const { ticket } = await updateTicketStatusForGeneral(id, status);
      set((state) => ({
        tickets: state.tickets.map(t => t._id === ticket._id ? ticket : t),
        allTickets: state.allTickets.map(t => t._id === ticket._id ? ticket : t),
        loading: false,
      }));
    } catch (err: any) {
      console.error("Error updating general ticket:", err);
      set({ error: err.message || 'Failed to update general ticket', loading: false });
    }
  },

  updateHealthTicketStatus: async (id, status) => {
    try {
      set({ loading: true });
      const { ticket } = await updateTicketStatusForHealth(id, status);
      set((state) => ({
        tickets: state.tickets.map(t => t._id === ticket._id ? ticket : t),
        allTickets: state.allTickets.map(t => t._id === ticket._id ? ticket : t),
        loading: false,
      }));
    } catch (err: any) {
      console.error("Error updating health ticket:", err);
      set({ error: err.message || 'Failed to update health ticket', loading: false });
    }
  },

  sendMessageToAdmin: async ({ ticketId, message, ticketType }) => {
    try {
      set({ loading: true });

      const { ticket } = await sendMsgToAdmin({ ticketId, message, ticketType });

      set((state) => ({
        tickets: state.tickets.map(t => t._id === ticket._id ? ticket : t),
        allTickets: state.allTickets.map(t => t._id === ticket._id ? ticket : t),
        ticket: state.ticket?._id === ticket._id ? ticket : state.ticket,
        loading: false,
      }));
    } catch (err: any) {
      console.error("Failed to send message to admin:", err);
      set({ error: err.message || "Failed to send message to admin", loading: false });
    }
  },
  
  fetchMessagesForTicket: async (ticketId, ticketType) => {
    try {
      set({ loading: true });
      const { messages } = await getAllMessagesSendToAdmin(ticketId, ticketType);
      set({ messages, loading: false });
    } catch (err: any) {
      console.error("Failed to fetch messages:", err);
      set({ error: err.message || "Failed to fetch messages", loading: false });
    }
  },
}));
