import { useEffect, useState } from "react";
import { useSupportStore } from "@/store/support.store";
import {
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { SupportTicket } from "@/types/support.types";

export default function SupportAndMasterContactPage() {
  const {
    allTickets,
    fetchAllTickets,
    updateGeneralTicketStatus,
    updateHealthTicketStatus,
    loading
  } = useSupportStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    fetchAllTickets();
  }, [fetchAllTickets]);

  const handleStatusChange = async (ticketId: string, status: SupportTicket["status"]) => {
    try {
      const ticket = allTickets.find(t => t._id === ticketId);
      if (!ticket) return toast("Ticket not found.");

      const isHealth = ticket?.user?.type === 'billrest_health';
      const isGeneral = ticket?.user?.type === 'billrest_general';

      if (isHealth) await updateHealthTicketStatus(ticketId, status)
      if (isGeneral) await updateGeneralTicketStatus(ticketId, status);

      toast(`Ticket status changed to ${status}.`);
      await fetchAllTickets();
    } catch (err) {
      toast("There was a problem updating the ticket status.");
    }
  };

  const getStatusBadgeColor = (status: SupportTicket["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-200 text-yellow-800";
      case "resolved":
        return "bg-green-200 text-green-800";
      case "escalated":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  // ✅ Filter tickets
  const filteredTickets = allTickets.filter((ticket) => {
    const matchesName = ticket.user?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? ticket.status === statusFilter : true;
    const matchesType = typeFilter ? ticket.user?.type === typeFilter : true;
    return matchesName && matchesStatus && matchesType;
  });

  return (
    <div className="mx-auto px-4 py-8 space-y-8">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Contact Support</CardTitle>
        <CardDescription>All the complain requests are rendered here.</CardDescription>
      </CardHeader>

      {/* 🔍 Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder="Search by user name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
          <option value="escalated">Escalated</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">All Types</option>
          <option value="billrest_health">billrest_health</option>
          <option value="billrest_general">billrest_general</option>
        </select>
      </div>

      {/* 🧾 Table */}
      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin size-10 text-blue-600" />
        </div>
      ) : (
        <div className="rounded-lg border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Serial No</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Change Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket: SupportTicket) => (
                <TableRow key={ticket._id}>
                  <TableCell>{ticket.serialNumber}</TableCell>
                  <TableCell>{ticket.user?.name}</TableCell>
                  <TableCell>{ticket.user?.type}</TableCell>
                  <TableCell>{ticket.user?.email}</TableCell>
                  <TableCell>{ticket.user?.phone}</TableCell>
                  <TableCell>{ticket.message}</TableCell>
                  <TableCell>
                    <Badge className={`${getStatusBadgeColor(ticket.status)} px-2 py-1 rounded`}>
                      {ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={ticket.status}
                      onValueChange={(status: SupportTicket["status"]) =>
                        handleStatusChange(ticket._id, status)
                      }
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="escalated">Escalated</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredTickets.length === 0 && (
            <div className="text-center p-6 text-muted-foreground">
              No support tickets found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
