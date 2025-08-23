import { create } from "zustand";
import type {
    Appointment,
    CreateAppointmentPayload,
    UpdateAppointmentPayload,
} from "@/types/appointment.types";
import {
    createAppointment as apiCreateAppointment,
    getAppointments as apiGetAppointments,
    getAppointmentById as apiGetAppointmentById,
    updateAppointment as apiUpdateAppointment,
    deleteAppointment as apiDeleteAppointment,
    getAllAppointments as apiGetAllAppointments,
} from "@/services/appointment.service";

interface AppointmentState {
    appointments: Appointment[];
    allAppointments: Appointment[];
    selectedAppointment: Appointment | null;
    loading: boolean;
    error: string | null;

    // Actions
    fetchAppointments: () => Promise<void>;
    fetchAllAppointments: () => Promise<void>;
    fetchAppointmentById: (id: string) => Promise<void>;
    createAppointment: (payload: CreateAppointmentPayload) => Promise<Appointment | null>;
    updateAppointment: (id: string, payload: UpdateAppointmentPayload) => Promise<Appointment | null>;
    deleteAppointment: (id: string) => Promise<boolean>;

    setAppointments: (appointments: Appointment[]) => void;
    setSelectedAppointment: (appointment: Appointment | null) => void;
}

export const useAppointmentStore = create<AppointmentState>((set) => ({
    appointments: [],
    allAppointments: [],
    selectedAppointment: null,
    loading: false,
    error: null,

    setAppointments: (appointments) => set({ appointments }),
    setSelectedAppointment: (appointment) => set({ selectedAppointment: appointment }),

    fetchAppointments: async () => {
        set({ loading: true, error: null });
        try {
            const data = await apiGetAppointments();
            set({ appointments: data, loading: false });
        } catch (err: any) {
            console.error("Fetch appointments error:", err);
            set({
                error: err.message || "Failed to fetch appointments",
                loading: false,
            });
        }
    },

    fetchAppointmentById: async (id) => {
        set({ loading: true, error: null });
        try {
            const data = await apiGetAppointmentById(id);
            set({ selectedAppointment: data, loading: false });
        } catch (err: any) {
            console.error("Fetch appointment by ID error:", err);
            set({
                error: err.message || "Failed to fetch appointment",
                loading: false,
            });
        }
    },

    createAppointment: async (payload) => {
        set({ loading: true, error: null });
        try {
            const appointment = await apiCreateAppointment(payload);
            set((state) => ({
                appointments: [...state.appointments, appointment],
                loading: false,
            }));
            return appointment;
        } catch (err: any) {
            console.error("Create appointment error:", err);
            set({
                error: err.message || "Failed to create appointment",
                loading: false,
            });
            return null;
        }
    },

    updateAppointment: async (id, payload) => {
        set({ loading: true, error: null });
        try {
            const updated = await apiUpdateAppointment(id, payload);
            set((state) => ({
                appointments: state.appointments.map((appt) =>
                    appt._id === id ? updated : appt
                ),
                selectedAppointment:
                    state.selectedAppointment?._id === id
                        ? updated
                        : state.selectedAppointment,
                loading: false,
            }));
            return updated;
        } catch (err: any) {
            console.error("Update appointment error:", err);
            set({
                error: err.message || "Failed to update appointment",
                loading: false,
            });
            return null;
        }
    },

    deleteAppointment: async (id) => {
        set({ loading: true, error: null });
        try {
            await apiDeleteAppointment(id);
            set((state) => ({
                appointments: state.appointments.filter((appt) => appt._id !== id),
                selectedAppointment:
                    state.selectedAppointment?._id === id
                        ? null
                        : state.selectedAppointment,
                loading: false,
            }));
            return true;
        } catch (err: any) {
            console.error("Delete appointment error:", err);
            set({
                error: err.message || "Failed to delete appointment",
                loading: false,
            });
            return false;
        }
    },

    fetchAllAppointments: async () => {
        set({ loading: true, error: null });
        try {
            const data = await apiGetAllAppointments();
            set({ allAppointments: data, loading: false });
        } catch (err: any) {
            console.error("Fetch all appointments error:", err);
            set({
                error: err.message || "Failed to fetch all appointments",
                loading: false,
            });
        }
    },

}));
