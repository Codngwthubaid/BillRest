export interface SupportTicket {
  _id: string;
  subject: string;
  message: string;
  status: 'pending' | 'resolved' | 'escalated';
  createdAt: string;
  updatedAt: string;
}