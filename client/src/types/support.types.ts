export interface SupportTicket {
  _id: string;
  type: 'billrest_general' | 'billrest_health';
  serialNumber: number;
  subject: string;
  message: string;
  status: 'pending' | 'resolved' | 'escalated';
  respondedBy?: string;
  createdAt: string;
  updatedAt: string;
  descText: string;
  user: {
    type: 'billrest_general' | 'billrest_health';
    name: string;
    email: string;
    phone: string;
  };
}
