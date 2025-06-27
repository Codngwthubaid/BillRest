import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, Keyboard, HelpCircle } from 'lucide-react';

const shortcuts = [
    {
        section: '🧾 Invoice/Billing Page Shortcuts',
        keys: [
            ['Ctrl + N', 'Start new invoice'],
            ['Ctrl + P', 'Print current invoice'],
            ['Ctrl + S', 'Save invoice (draft or final)'],
            ['Ctrl + Shift + W', 'Send invoice via WhatsApp'],
            ['Esc', 'Cancel invoice / Close popup'],
            ['Ctrl + B', 'Focus barcode input'],
            ['Ctrl + F', 'Focus product search field'],
            ['Enter (in search/barcode field)', 'Add item to invoice'],
            ['Ctrl + D', 'Apply discount field (if applicable)'],
            ['Ctrl + T', 'Toggle GST ON/OFF (by default ON)'],
        ],
    },
    {
        section: '🛒 Product Management Screen',
        keys: [
            ['Ctrl + A', 'Add new product'],
            ['Ctrl + E', 'Edit selected product'],
            ['Del or Backspace', 'Delete selected product (with confirmation)'],
            ['Ctrl + U', 'Upload product image'],
            ['Ctrl + Q', 'Quick barcode entry mode (for multiple products)'],
        ],
    },
    {
        section: '📊 Reports Page',
        keys: [
            ['Ctrl + R', 'Refresh report'],
            ['Ctrl + E', 'Export report as PDF'],
            ['Ctrl + H', 'Show top-selling items'],
        ],
    },
    {
        section: '⚙ Global Shortcuts',
        keys: [
            ['Ctrl + Shift + L', 'Logout'],
            ['Ctrl + Shift + A', 'Open Admin panel (if user has access)'],
            ['Ctrl + K', 'Open keyboard shortcut cheat-sheet (help popup)'],
            ['Ctrl + M', 'Go to Main Dashboard'],
            ['Ctrl + Shift + ?', 'Contact Support or trigger support popup'],
        ],
    },
];

const HelpPage: React.FC = () => {
    return (
        <div className="min-h-screen py-10 px-4 sm:px-8 lg:px-16 bg-background text-foreground">
            <div className="max-w-5xl mx-auto space-y-10">
                <div className="text-start">
                    <h1 className="text-2xl font-bold mb-2">Help & Shortcuts Guide</h1>
                    <p className="text-muted-foreground">Use this guide to explore available keyboard shortcuts and contact our support.</p>
                </div>

                {shortcuts.map((group, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2 my-4">
                                <Keyboard className="h-5 w-5 text-primary" />
                                {group.section}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="text-left border-b border-border">
                                        <th className="py-2 px-4 font-semibold">Key(s)</th>
                                        <th className="py-2 px-4 font-semibold">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {group.keys.map(([key, action], idx) => (
                                        <tr key={idx} className="border-t border-border">
                                            <td className="py-2 px-4 font-mono bg-muted/10 rounded-md whitespace-nowrap">{key}</td>
                                            <td className="py-2 px-4">{action}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                ))}


                <CardHeader className='mb-3'>
                    <CardTitle className="flex items-center gap-2">
                        <HelpCircle className="h-5 w-5 text-primary" />
                        Support Admin Credentials
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-blue-600" />
                        <span className="text-sm">support@example.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Phone className="h-5 w-5 text-green-600" />
                        <span className="text-sm">+1 (234) 567-890</span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                        For any issues or questions, feel free to reach out to our support team. We're here to help!
                    </p>
                </CardContent>

            </div>
        </div>
    );
};

export default HelpPage;
