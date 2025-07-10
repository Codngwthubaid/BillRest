import { useEffect } from "react";
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
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SupportAndMasterContactPage() {
    const { allTickets, fetchAllTickets, updateTicketStatus, loading } = useSupportStore();

    useEffect(() => {
        fetchAllTickets();
    }, [fetchAllTickets]);

    const handleStatusChange = async (ticketId: string, status: string) => {
        try {
            await updateTicketStatus(ticketId, status);
            toast(`Ticket status changed to ${status}.`,);
        } catch (err) {
            toast("There was a problem updating the ticket status.");
        }
    };

    const getStatusBadgeColor = (status: string) => {
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

    return (
        <div className="mx-auto px-4 py-8 space-y-8">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Contact Support</CardTitle>
                <CardDescription>All the complain requests are rendered here.</CardDescription>
            </CardHeader>


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
                                <TableHead>Email</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Message</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Change Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array.isArray(allTickets) && allTickets.map((ticket: any) => (
                                <TableRow key={ticket?._id ?? Math.random()}>
                                    <TableCell>{ticket?.serialNumber ?? "-"}</TableCell>
                                    <TableCell>{ticket?.user?.name ?? "-"}</TableCell>
                                    <TableCell>{ticket?.user?.email ?? "-"}</TableCell>
                                    <TableCell>{ticket?.user?.phone ?? "-"}</TableCell>
                                    <TableCell>{ticket?.message ?? "-"}</TableCell>
                                    <TableCell>
                                        <Badge className={`${getStatusBadgeColor(ticket?.status)} px-2 py-1 rounded`}>
                                            {ticket?.status ?? "-"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={ticket?.status}
                                            onValueChange={(status) => handleStatusChange(ticket?._id, status)}
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
                    {allTickets.length === 0 && (
                        <div className="text-center p-6 text-muted-foreground">
                            No support tickets found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
