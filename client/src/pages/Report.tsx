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
    DollarSign,
    Filter,
    RefreshCw,
    Award,
    Package,
    Activity,
    LineChart,
    PieChart,
    Loader2,
} from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { EmptyState } from '@/components/ui/empty-state';
import { StatsCard } from '@/components/reports/StatsCard';
import { TopProductCard } from '@/components/reports/TopProductCard';
import { InvoiceStatusBadge } from '@/components/reports/InvoiceStatusBadge';
import { SalesChart } from '@/components/reports/SalesChart';
import { ProductsChart } from '@/components/reports/ProductsChart';
import { StatusChart } from '@/components/reports/StatusChart';
import { RevenueChart } from '@/components/reports/RevenueChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';


export default function ReportPage() {
    const [isLoading, setIsLoading] = useState(true)
    const { data, loading, fetchReport } = useReportStore();
    const [filterType, setFilterType] = useState<ReportFilterType>('monthly');
    const [startDate, setStartDate] = useState<string>(
        new Date().toISOString().split('T')[0]
    );
    const [endDate, setEndDate] = useState<string>('');
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        fetchReport(filterType, startDate, endDate || undefined);
    }, [filterType, startDate, endDate, fetchReport]);

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
        <div className="min-h-screen">
            <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                    <div className="mb-4 sm:mb-0">
                        <h1 className="text-2xl font-bold">
                            Sales Report
                        </h1>
                        <p className="mt-2">
                            Comprehensive overview of your sales performance
                        </p>
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

                {/* Filter Controls */}
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
                                {getFilterIcon(filterType)}
                                Filter Type
                            </label>
                            <Select
                                value={filterType}
                                onValueChange={(value) => setFilterType(value as ReportFilterType)}
                            >
                                <SelectTrigger className="w-full">
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

                        {/* <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                Start Date
                            </label>
                            <Input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="border-slate-200"
                            />
                        </div> */}

                        {filterType === 'custom' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    End Date
                                </label>
                                <Input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="border-slate-200"
                                />
                            </div>
                        )}
                    </div>
                </CardContent>

                {/* Loading State */}
                {loading && (
                    <div className="space-y-6">
                        {/* Loading Summary Cards */}
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

                        {/* Loading Content */}
                        <Card className="border-0">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-center py-12">
                                    <LoadingSpinner size="large" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Empty State */}
                {!loading && (!data || (data.invoices.length === 0)) && (
                    <EmptyState
                        icon={FileText}
                        title="No report data available"
                        description="No sales data found for the selected period. Try adjusting your filters or date range."
                        action={
                            <Button onClick={handleRefresh} className="gap-2">
                                <RefreshCw className="h-4 w-4" />
                                Refresh Data
                            </Button>
                        }
                    />
                )}

                {/* Report Data */}
                {!loading && data && data.invoices.length > 0 && (
                    <div className="space-y-8 animate-in fade-in-50 duration-500">
                        {/* Summary Statistics */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatsCard
                                title="Total Revenue"
                                value={`${data.totalSales.toLocaleString()} ${data.invoices[0]?.currency || 'USD'}`}
                                icon={DollarSign}
                                trend="+12.5%"
                                trendDirection="up"
                                className='bg-green-500 hover:bg-green-600 text-white'
                            />
                            <StatsCard
                                title="Total Invoices"
                                value={data.count.toString()}
                                icon={FileText}
                                trend="+8.2%"
                                trendDirection="up"
                                className='bg-blue-500 hover:bg-blue-600 text-white'
                            />
                            <StatsCard
                                title="Products Sold"
                                value={data.topProducts.reduce((sum, p) => sum + p.quantity, 0).toString()}
                                icon={Package}
                                trend="+15.3%"
                                trendDirection="up"
                                className='bg-blue-500 hover:bg-blue-600 text-white'
                            />
                            <StatsCard
                                title="Average Order"
                                value={`${Math.round(data.totalSales / data.count).toLocaleString()} ${data.invoices[0]?.currency || 'USD'}`}
                                icon={TrendingUp}
                                trend="+4.1%"
                                trendDirection="up"
                                className='bg-green-500 hover:bg-green-600 text-white'
                            />
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
                                        Sales Trend
                                    </TabsTrigger>
                                    <TabsTrigger value="revenue" className="flex items-center gap-2">
                                        <BarChart3 className="h-4 w-4" />
                                        Revenue
                                    </TabsTrigger>
                                    <TabsTrigger value="products" className="flex items-center gap-2">
                                        <Package className="h-4 w-4" />
                                        Products
                                    </TabsTrigger>
                                    <TabsTrigger value="status" className="flex items-center gap-2">
                                        <PieChart className="h-4 w-4" />
                                        Status
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="sales" className="space-y-4">
                                    <SalesChart data={data} filterType={filterType} />
                                </TabsContent>

                                <TabsContent value="revenue" className="space-y-4">
                                    <RevenueChart data={data} filterType={filterType} />
                                </TabsContent>

                                <TabsContent value="products" className="space-y-4">
                                    <ProductsChart data={data} filterType={filterType} />
                                </TabsContent>

                                <TabsContent value="status" className="space-y-4">
                                    <StatusChart data={data} filterType={filterType} />
                                </TabsContent>
                            </Tabs>
                        </CardContent>


                        {/* Top Products */}
                        <CardHeader className="pt-5 px-0">
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <Award className="h-6 w-6 text-yellow-500" />
                                Top Performing Products
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='px-0'>
                            {data.topProducts.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {data.topProducts.map((product, index) => (
                                        <TopProductCard
                                            key={index}
                                            product={product}
                                            rank={index + 1}
                                            currency={data.invoices[0]?.currency || 'USD'}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <EmptyState
                                    icon={Package}
                                    title="No products data"
                                    description="No product sales data available for this period."
                                    compact
                                />
                            )}
                        </CardContent>

                        {/* Invoices Table */}
                        <CardHeader className="px-0">
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <FileText className="h-6 w-6 text-blue-500" />
                                Recent Invoices
                                <Badge variant="secondary" className="ml-2">
                                    {data.invoices.length}
                                </Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='px-0'>
                            <div className="overflow-x-auto rounded-lg border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="font-semibold">Invoice #</TableHead>
                                            <TableHead className="font-semibold">Customer</TableHead>
                                            <TableHead className="font-semibold">Date</TableHead>
                                            <TableHead className="font-semibold">Total</TableHead>
                                            <TableHead className="font-semibold">Status</TableHead>
                                            <TableHead className="font-semibold">Payment</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.invoices.map((invoice, index) => (
                                            <TableRow
                                                key={invoice._id}
                                                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-200"
                                                style={{ animationDelay: `${index * 50}ms` }}
                                            >
                                                <TableCell className="font-mono text-sm font-medium text-blue-600 dark:text-blue-400">
                                                    #{invoice.invoiceNumber}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                                            {invoice.customerName.charAt(0).toUpperCase()}
                                                        </div>
                                                        {invoice.customerName}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-slate-600 dark:text-slate-400">
                                                    {new Date(invoice.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </TableCell>
                                                <TableCell className="font-semibold">
                                                    {invoice.totalAmount.toLocaleString()} {invoice.currency}
                                                </TableCell>
                                                <TableCell>
                                                    <InvoiceStatusBadge status={invoice.status} />
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="capitalize">
                                                        {invoice.paymentMethod}
                                                    </Badge>
                                                </TableCell>
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
};
