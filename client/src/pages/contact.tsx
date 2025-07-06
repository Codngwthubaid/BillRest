import React, { useEffect, useState } from 'react';
import { useSupportStore } from '@/store/support.store';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";


export default function ContactPage() {
     const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [pageLoading, setPageLoading] = useState(true);

    const {
        tickets,
        loading,
        error,
        fetchTickets,
        submitTicket,
    } = useSupportStore();

    console.log(tickets)

    useEffect(() => {
        fetchTickets();
        const timer = setTimeout(() => {
            setPageLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject || !message) return;
        await submitTicket(subject, message);
        setSubject('');
        setMessage('');
    };

    const statusBadge = (status: string) => {
        switch (status) {
            case 'resolved':
                return <Badge className="bg-green-100 text-green-800">{status}</Badge>;
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-800">{status}</Badge>;
            case 'escalated':
                return <Badge className="bg-red-100 text-red-800">{status}</Badge>;
            default:
                return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
        }
    };

    if (pageLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="animate-spin size-12 text-blue-600" />
            </div>
        );
    }

    return (
        <div className="mx-auto px-4 py-8 space-y-12 max-w-5xl">
            <Card>
                <CardHeader>
                    <CardTitle className='text-2xl font-bold'>Contact Support</CardTitle>
                    <CardDescription>Fill out the form below and we&apos;ll respond to your issue shortly.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            placeholder="Enter subject"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                        />
                        <Textarea
                            placeholder="Describe your issue"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />
                        <Button type="submit" disabled={loading} className="w-full dark:text-white bg-blue-600 hover:bg-blue-700">
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                'Submit Ticket'
                            )}
                        </Button>
                        {error && <p className="text-sm text-red-600">{error}</p>}
                    </form>
                </CardContent>
            </Card>

            {tickets.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Your Previous Tickets</h2>
                    <div className="rounded-xl border shadow-sm overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-20">#</TableHead>
                                    <TableHead>Subject</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created At</TableHead>
                                    <TableHead>Message</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {tickets.map((ticket) => (
                                    <TableRow key={ticket._id}>
                                        <TableCell className="font-medium">{ticket.serialNumber}</TableCell>
                                        <TableCell>{ticket.subject}</TableCell>
                                        <TableCell>{statusBadge(ticket.status)}</TableCell>
                                        <TableCell>{new Date(ticket.createdAt).toLocaleString()}</TableCell>
                                        <TableCell className="max-w-xs truncate" title={ticket.message}>
                                            {ticket.message}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            )}
        </div>
    );
};

