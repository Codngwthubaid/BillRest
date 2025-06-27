import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp } from 'lucide-react';
import type { ReportFilterType } from '@/services/report.service';
import { transformRevenueChartData } from '@/lib/chart.helpers';

interface RevenueChartProps {
    data: any;
    filterType: ReportFilterType;
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data, filterType }) => {


    const chartData = transformRevenueChartData(data.invoices, filterType);
    const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);
    const totalProfit = chartData.reduce((sum, item) => sum + item.profit, 0);
    const profitMargin = ((totalProfit / totalRevenue) * 100).toFixed(1);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-green-600 dark:text-green-400">Total Revenue</p>
                                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                                    ${totalRevenue.toLocaleString()}
                                </p>
                            </div>
                            <DollarSign className="h-8 w-8 text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Profit</p>
                                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                                    ${totalProfit.toLocaleString()}
                                </p>
                            </div>
                            <TrendingUp className="h-8 w-8 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-0 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Profit Margin</p>
                                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                                    {profitMargin}%
                                </p>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-xs font-bold">
                                %
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-0">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        Revenue & Profit Analysis
                        <span className="text-sm font-normal text-muted-foreground capitalize">
                            ({filterType} view)
                        </span>
                    </CardTitle>
                    <CardDescription>
                        Compare revenue and profit margins across different periods
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                <XAxis
                                    dataKey="period"
                                    className="text-xs"
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis
                                    className="text-xs"
                                    tick={{ fontSize: 12 }}
                                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--background))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                    }}
                                    formatter={(value: any, name: string) => [
                                        `$${value.toLocaleString()}`,
                                        name === 'revenue' ? 'Revenue' : 'Profit'
                                    ]}
                                />
                                <Bar dataKey="revenue" name="revenue" radius={[4, 4, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`revenue-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                                <Bar dataKey="profit" name="profit" radius={[4, 4, 0, 0]} opacity={0.7}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`profit-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};