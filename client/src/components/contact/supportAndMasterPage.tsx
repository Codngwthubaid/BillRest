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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { SupportTicket } from "@/types/support.types";
import { Button } from "../ui/button";
import { useAuthStore } from "@/store/auth.store";

export default function SupportAndMasterContactPage() {
  const {
    allTickets,
    fetchAllTickets,
    updateGeneralTicketStatus,
    updateHealthTicketStatus,
    sendMessageToAdmin,
    fetchMessagesForTicket,
    messages: ticketMessages,
    loading
  } = useSupportStore();

  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [messages, setMessages] = useState<Record<string, string>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [activeTicketType, setActiveTicketType] = useState<string | null>(null);


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


  const handleSendMessage = async (ticketId: string, message: string, ticketType: string = "billrest_general") => {
    if (!message?.trim()) {
      toast("Please enter a message before submitting.");
      return;
    }

    try {
      await sendMessageToAdmin({
        ticketId,
        message,
        ticketType
      });

      toast.success("Message sent to admin.");
      setMessages((prev) => ({ ...prev, [ticketId]: "" }));
      await fetchAllTickets();
    } catch (err) {
      toast.error("Failed to send message to admin.");
    }
  };


  const handleViewMessages = async (ticketId: string, ticketType: string) => {
    await fetchMessagesForTicket(ticketId, ticketType);
    setActiveTicketId(ticketId);
    setActiveTicketType(ticketType);
    setIsDialogOpen(true);
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
                {
                  user?.role === "support" && (
                    <>
                      <TableHead>Submit</TableHead>
                      <TableHead>Desc Text</TableHead>
                    </>
                  )
                }
                {
                  user?.role === "master" && (
                    <>
                      <TableHead>Messages</TableHead>
                    </>
                  )
                }
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
                  {
                    user?.role === "support" && (
                      <>
                        <TableCell>
                          <Input
                            type="text"
                            placeholder="Description text"
                            value={messages[ticket._id] || ""}
                            onChange={(e) => {
                              setMessages((prev) => ({
                                ...prev,
                                [ticket._id]: e.target.value
                              }));
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                            onClick={() =>
                              handleSendMessage(
                                ticket._id,
                                messages[ticket._id],
                                ticket.user?.type
                              )
                            }
                          >
                            Submit
                          </Button>
                        </TableCell>
                      </>
                    )}
                  {
                    user?.role === "master" && (
                      <TableCell>
                        <Button
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                          onClick={() =>
                            handleViewMessages(ticket._id, ticket.user?.type)
                          }
                        >
                          View Messages
                        </Button>

                      </TableCell>
                    )
                  }
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg w-full">
          <DialogHeader>
            <DialogTitle>Messages for Ticket #{activeTicketId}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {ticketMessages.length === 0 ? (
              <p className="text-sm text-muted-foreground">No messages found for this ticket.</p>
            ) : (
              ticketMessages.map((msg, index) => (
                <div key={index} className="border rounded p-3">
                  <p className="text-sm font-semibold">
                    {msg.senderRole === "support" ? "Support Team" : "User"}:
                  </p>
                  <p className="text-sm">{msg.message}</p>
                  {msg.timestamp && (
                    <p className="text-xs text-muted-foreground mt-1">{new Date(msg.timestamp).toLocaleString()}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
