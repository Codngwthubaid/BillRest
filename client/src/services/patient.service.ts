import { axiosInstance } from "@/lib/axiosInstance";
import type { Patient } from "@/types/patient.types";

// GET all patients for clinic
export const getPatients = async (): Promise<Patient[]> => {
  const res = await axiosInstance.get("/patients");
  return res.data;
};

// DELETE a patient
export const deletePatient = async (id: string): Promise<{ message: string }> => {
  const res = await axiosInstance.delete(`/patients/${id}`);
  return res.data;
};
