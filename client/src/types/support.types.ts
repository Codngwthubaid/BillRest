export interface SupportTicket {
  _id: string;
  serialNumber: number;
  subject: string;
  message: string;
  status: 'pending' | 'resolved' | 'escalated';
  respondedBy?: string;
  createdAt: string;
  updatedAt: string;
}
