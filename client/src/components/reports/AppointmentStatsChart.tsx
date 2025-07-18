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
import { UserPlus, Calendar, TrendingUp } from 'lucide-react';
import type { ReportFilterType } from '@/services/report.service';

interface Appointment {
  _id: string;
  createdAt: string;
}

interface AppointmentStatsChartProps {
  data: {
    appointments: Appointment[];
  };
  filterType: ReportFilterType;
}

export const AppointmentStatsChart: React.FC<AppointmentStatsChartProps> = ({ data, filterType }) => {
  // Transform appointment data into chart format
  const rawData = data?.appointments?.map((appointment) => {
    const date = new Date(appointment.createdAt);
    const period = date.toLocaleDateString('en-US', {
      month: filterType === 'monthly' ? 'short' : undefined,
      weekday: filterType === 'daily' ? 'short' : undefined,
      day: filterType === 'daily' ? 'numeric' : undefined,
    });
    return { period };
  });

  const countMap: Record<string, number> = {};
  rawData.forEach(({ period }) => {
    countMap[period] = (countMap[period] || 0) + 1;
  });

  const chartData = Object.entries(countMap).map(([period, count], index) => ({
    period,
    appointments: count,
    color: `hsl(${(index * 37) % 360}, 70%, 60%)`, // Color variation
  }));

  const totalAppointments = chartData.reduce((sum, item) => sum + item.appointments, 0);
  const avgAppointments = chartData.length
    ? Math.round(totalAppointments / chartData.length)
    : 0;
  const peakAppointments = Math.max(...chartData.map((item) => item.appointments));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="border-0 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950 dark:to-green-950">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Total Appointments</p>
                <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                  {totalAppointments.toLocaleString()}
                </p>
              </div>
              <UserPlus className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Average Appointments</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {avgAppointments}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950 dark:to-violet-950">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Peak Day</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {peakAppointments}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Appointment Distribution
            <span className="text-sm font-normal text-muted-foreground capitalize">
              ({filterType} view)
            </span>
          </CardTitle>
          <CardDescription>
            Visualize how your appointments are distributed over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="period" className="text-xs" tick={{ fontSize: 12 }} />
                <YAxis className="text-xs" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                  formatter={(value: any) => [`${value} appointments`, 'Appointments']}
                />
                <Bar dataKey="appointments" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color} />
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
