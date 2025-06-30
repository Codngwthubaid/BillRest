import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, Keyboard, HelpCircle, Loader2 } from 'lucide-react';
import { shortcuts } from '@/constants/index';

export default function HelpPage() {

    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-xl font-semibold animate-pulse text-blue-600">
                    <Loader2 className="animate-spin size-12" />
                </div>
            </div>
        );
    }

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
