import { useState, useEffect } from 'react';
import { useReportStore } from '@/store/report.store';
import type { ReportFilterType } from '@/services/report.service';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
    BarChart3,
    TrendingUp,
    FileText,
    Calendar,
    IndianRupee,
    Filter,
    RefreshCw,
    Award,
    Package,
    Loader2,
    Activity,
    LineChart,
    PieChart
} from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { EmptyState } from '@/components/ui/empty-state';
import { StatsCard } from '@/components/reports/StatsCard';
import { TopProductCard } from '@/components/reports/TopProductCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';

import { AppointmentChart } from './AppointmentChart';
import { AppointmentStatsChart } from './AppointmentStatsChart';
import { ServicesChart } from './ServicesChart';
import { AppointmentStatusChart } from './AppointmentStatusChart';

export default function ReportsForHealth() {
    const [isLoading, setIsLoading] = useState(true);
    const { healthReport: data, loading, fetchHealthReport: fetchReport } = useReportStore();
    const [filterType, setFilterType] = useState<ReportFilterType>('monthly');
    const [startDate, setStartDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState<string>('');
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        fetchReport(filterType, startDate, endDate || undefined);
    }, [filterType, startDate, endDate]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchReport(filterType, startDate, endDate || undefined);
        setIsRefreshing(false);
    };

    const getFilterIcon = (type: ReportFilterType) => {
        switch (type) {
            case 'daily': return <Calendar className="h-4 w-4" />;
            case 'weekly': return <BarChart3 className="h-4 w-4" />;
            case 'monthly': return <TrendingUp className="h-4 w-4" />;
            default: return <Filter className="h-4 w-4" />;
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="animate-spin size-12 text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold">Health Sales Report</h1>
                        <p className="mt-2">Overview of your clinic’s health services performance</p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRefresh}
                            disabled={loading || isRefreshing}
                            className="gap-2"
                        >
                            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                    </div>
                </div>

                <CardHeader className="pb-4 px-0">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Filter className="h-5 w-5 text-blue-600" />
                        Filters & Date Range
                    </CardTitle>
                </CardHeader>
                <CardContent className='px-0 pb-5'>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                {getFilterIcon(filterType)} Filter Type
                            </label>
                            <Select
                                value={filterType}
                                onValueChange={(value) => setFilterType(value as ReportFilterType)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select filter type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="daily">📅 Daily</SelectItem>
                                    <SelectItem value="weekly">📊 Weekly</SelectItem>
                                    <SelectItem value="monthly">📈 Monthly</SelectItem>
                                    <SelectItem value="quarterly">🗓️ Quarterly</SelectItem>
                                    <SelectItem value="yearly">📅 Yearly</SelectItem>
                                    <SelectItem value="financial">💰 Financial</SelectItem>
                                    <SelectItem value="custom">⚙️ Custom</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        {filterType === 'custom' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Calendar className="h-4 w-4" /> End Date
                                </label>
                                <Input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                        )}
                    </div>
                </CardContent>

                {loading && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <Card key={i} className="border-0">
                                    <CardContent className="p-6">
                                        <div className="flex items-center space-x-4">
                                            <Skeleton className="h-12 w-12 rounded-full" />
                                            <div className="space-y-2 flex-1">
                                                <Skeleton className="h-4 w-20" />
                                                <Skeleton className="h-6 w-24" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        <Card className="border-0">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-center py-12">
                                    <LoadingSpinner size="large" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {!loading && (!data || (data.ipds.length === 0)) && (
                    <EmptyState
                        icon={FileText}
                        title="No report data available"
                        description="No health sales data found for this period."
                        action={
                            <Button onClick={handleRefresh} className="gap-2">
                                <RefreshCw className="h-4 w-4" />
                                Refresh Data
                            </Button>
                        }
                    />
                )}

                {!loading && data && data.ipds.length > 0 && (
                    <div className="space-y-8 animate-in fade-in-50 duration-500">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatsCard
                                title="Total Revenue"
                                value={data.totalRevenue.toLocaleString()}
                                icon={IndianRupee}
                                className="bg-green-500 hover:bg-green-600 text-white" />
                            <StatsCard
                                title="Total Appointments" value={data.totalAppointments.toString()}
                                icon={FileText}
                                className="bg-blue-500 hover:bg-blue-600 text-white" />
                            <StatsCard
                                title="Total Patients"
                                value={data.totalPatients.toString()}
                                icon={Package}
                                className="bg-blue-500 hover:bg-blue-600 text-white" />
                            <StatsCard
                                title="Total Services"
                                value={data.totalServices.toString()}
                                icon={TrendingUp}
                                className="bg-green-500 hover:bg-green-600 text-white" />
                        </div>



                        <CardHeader className="px-0">
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Activity className="h-6 w-6 text-indigo-500" />
                                Analytics Dashboard
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='px-0'>
                            <Tabs defaultValue="sales" className="w-full">
                                <TabsList className="grid w-full grid-cols-4 mb-6">
                                    <TabsTrigger value="sales" className="flex items-center gap-2">
                                        <LineChart className="h-4 w-4" />
                                        Appointment Trend
                                    </TabsTrigger>
                                    <TabsTrigger value="revenue" className="flex items-center gap-2">
                                        <BarChart3 className="h-4 w-4" />
                                        Appointment Distribution
                                    </TabsTrigger>
                                    <TabsTrigger value="products" className="flex items-center gap-2">
                                        <Package className="h-4 w-4" />
                                        Services
                                    </TabsTrigger>
                                    <TabsTrigger value="status" className="flex items-center gap-2">
                                        <PieChart className="h-4 w-4" />
                                        Appointment Status
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="sales" className="space-y-4">
                                    <AppointmentChart data={data} filterType={filterType} />
                                </TabsContent>

                                <TabsContent value="revenue" className="space-y-4">
                                    <AppointmentStatsChart data={data} filterType={filterType} />
                                </TabsContent>

                                <TabsContent value="products" className="space-y-4">
                                    <ServicesChart data={data} filterType={filterType} />
                                </TabsContent>

                                <TabsContent value="status" className="space-y-4">
                                    <AppointmentStatusChart data={data} filterType={filterType} />
                                </TabsContent>
                            </Tabs>
                        </CardContent>


                        {/* Top Services */}
                        <CardHeader className="pt-5 px-0">
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Award className="h-6 w-6 text-yellow-500" /> Top Performing Services
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='px-0'>
                            {data.topServices.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {data.topServices.map((service, index) => (
                                        <TopProductCard
                                            key={index}
                                            product={{
                                                name: service.service,
                                                quantity: service.quantity,
                                                totalSales: service.totalSales
                                            }}
                                            rank={index + 1}
                                            currency="INR"
                                        />
                                    ))}
                                </div>
                            ) : (
                                <EmptyState
                                    icon={Package}
                                    title="No service data"
                                    description="No service sales data available for this period."
                                    compact
                                />
                            )}
                        </CardContent>

                        <CardHeader className="px-0">
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <FileText className="h-6 w-6 text-blue-500" /> Recent Appointments
                                <Badge variant="secondary" className="ml-2">{data.appointments.length}</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='px-0'>
                            <div className="overflow-x-auto rounded-lg border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>#</TableHead>
                                            <TableHead>AppointmentID</TableHead>
                                            <TableHead>Patient</TableHead>
                                            <TableHead>Gender</TableHead>
                                            <TableHead>Phone Number</TableHead>
                                            <TableHead>Address</TableHead>
                                            <TableHead>Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.appointments.map((appointment, index) => (
                                            <TableRow key={appointment._id} style={{ animationDelay: `${index * 50}ms` }}>
                                                <TableCell className="font-mono text-sm font-medium text-blue-600">{index + 1}</TableCell>
                                                <TableCell>{appointment.appointmentNumber}</TableCell>
                                                <TableCell>{appointment.patient?.name}</TableCell>
                                                <TableCell>{appointment.patient?.gender}</TableCell>
                                                <TableCell>{appointment.patient?.phoneNumber}</TableCell>
                                                <TableCell>{appointment.patient?.address}</TableCell>
                                                <TableCell><Badge variant="outline">{appointment.status}</Badge></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>

                    </div>
                )}
            </div>
        </div>
    );
}
