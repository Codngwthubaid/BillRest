import React, { useEffect, useState } from 'react';
import { useSupportStore } from '@/store/support.store';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

const ContactSupportPage: React.FC = () => {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const {
        tickets,
        loading,
        error,
        fetchTickets,
        submitTicket,
    } = useSupportStore();

    useEffect(() => {
        fetchTickets();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject || !message) return;
        await submitTicket(subject, message);
        setSubject('');
        setMessage('');
    };

    const statusColor = (status: string) => {
        switch (status) {
            case 'resolved':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'escalated':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="mx-auto px-4 py-8 space-y-8">
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
                    <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
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


            {tickets.length > 0 && (
                <div className="space-y-4 mx-6">
                    <h2 className="text-xl font-semibold">Your Previous Tickets</h2>
                    {tickets.map((ticket) => (
                        <Card key={ticket._id} className="py-5">
                            <CardHeader className="flex flex-row justify-between items-start">
                                <div>
                                    <CardTitle className="text-base">{ticket.subject}</CardTitle>
                                    <CardDescription>{new Date(ticket.createdAt).toLocaleString()}</CardDescription>
                                </div>
                                <Badge className={statusColor(ticket.status)}>{ticket.status}</Badge>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground whitespace-pre-line">{ticket.message}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ContactSupportPage;
